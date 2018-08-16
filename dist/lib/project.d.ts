/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
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
export declare function closeProject(projectHandle: IProjectHandle, error: Error): Promise<void>;
/**
 * Retrieve migration for a version.
 * @param projectHandle Project handle
 * @param version Version handled by the migration
 */
export declare function getProjectMigration(projectHandle: IProjectHandle, version: string): Promise<IProjectMigration>;
/**
 * Migrate the project.
 * @param projectHandle Project handle
 * @param targetVersions Versions to migrate through
 */
export declare function migrateProject(projectHandle: IProjectHandle, targetVersions: string[]): Promise<void>;
/**
 * Open project, with configuration file at `configPath`.
 * @param configPath Path to project file
 * @param migrationsPath Path to migration modules
 */
export declare function openProject(configPath: string, migrationsPath: string): Promise<IProjectHandle>;
