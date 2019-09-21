/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */

// built-in modules
import * as path from "path";

// installed modules
import * as Debug from "debug";

// own modules
import { isVersionAscending } from "./versions";

// module variables
const debug = Debug("@forfuture/migrate:lib:project");

/** Migration output. */
export interface IMigrationOutput {
    /** Versions of migrations run on database. */
    dbVersions: {
        /** Current version of data. */
        current: string;
        /** Previous version of data. */
        previous: string;
    };
}

/** Project handle. */
export interface IProjectHandle extends IProjectState {
    /** Path to configuration file. */
    configPath: string;
    /** Path to migrations directory. */
    migrationsPath: string;
    /** Has any migration been performed? */
    isMigrated: boolean;
}

/**
 * A migration handling a specific version i.e. can upgrade/download
 * the data to a certain version from preceding/subsequent version
 * respectively.
 */
export interface IProjectMigration {
    /** Target version of data to be migrated. */
    version: string;
    /** Function handling upgrade. */
    up: (context: any) => Promise<any>;
    /** Function handling downgrade. */
    down: (context: any) => Promise<any>;
}

/** Project state. */
export interface IProjectState {
    /** Versions of migrations run on database. */
    dbVersions: {
        /** Current version of data. */
        current: string;
        /** Previous version of data. */
        previous: string;
    };
    /** Context passed to integrations. */
    context: any;
    /** Callback invoked on migration completion. */
    complete: (error: Error, output: IMigrationOutput) => Promise<any>;
}

/**
 * Close project.
 * @param projectHandle Project handle
 * @param error Any error that might have occurred
 */
export async function closeProject(
    projectHandle: IProjectHandle,
    error: Error,
) {
    debug(`closing project with config file at ${projectHandle.configPath}`);
    let output;
    if (projectHandle.isMigrated) {
        output = {
            dbVersions: projectHandle.dbVersions,
        };
    }
    await projectHandle.complete(error, output);
}

/**
 * Retrieve migration for a version.
 * @param projectHandle Project handle
 * @param version Version handled by the migration
 */
export async function getProjectMigration(
    projectHandle: IProjectHandle,
    version: string,
) {
    debug(`retrieving project migration for version ${version}`);
    const migrationModule = require(path.join(
        projectHandle.migrationsPath,
        version,
    ));
    const migration: IProjectMigration = {
        version,
        up: migrationModule.up,
        down: migrationModule.down,
    };
    return migration;
}

/**
 * Migrate the project.
 * @param projectHandle Project handle
 * @param targetVersion Final target version
 * @param migrateThroughVersions Versions to migrate through
 */
export async function migrateProject(
    projectHandle: IProjectHandle,
    targetVersion: string,
    migrateThroughVersions: string[],
) {
    debug(
        `migrating project currently at version ${projectHandle.dbVersions.current}`,
    );
    projectHandle.dbVersions.previous = projectHandle.dbVersions.current;
    for (const migrateVersion of migrateThroughVersions) {
        const migration = await getProjectMigration(
            projectHandle,
            migrateVersion,
        );
        const doUpgrade = isVersionAscending(
            projectHandle.dbVersions.current,
            migrateVersion,
        );
        if (doUpgrade) {
            debug(`migrating project up to version ${migrateVersion}`);
            await migration.up(projectHandle.context);
        } else {
            debug(`migrating project down from version ${migrateVersion}`);
            await migration.down(projectHandle.context);
        }
    }
    projectHandle.dbVersions.current = targetVersion;
    projectHandle.isMigrated = true;
}

/**
 * Open project, with configuration file at `configPath`.
 * @param configPath Path to project file
 * @param migrationsPath Path to migration modules
 */
export async function openProject(
    configPath: string,
    migrationsPath: string,
): Promise<IProjectHandle> {
    debug(`opening project with config file at ${configPath}`);
    const config = require(configPath);
    const initRet = (await config.init()) as IProjectState;
    return {
        ...initRet,
        configPath,
        migrationsPath,
        isMigrated: false,
    };
}
