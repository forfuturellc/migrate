/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// built-in modules
import * as path from "path";

// installed modules
import * as Debug from "debug";
import * as program from "commander";

// own modules
import * as migrate from "./lib";
const pkg = require("../package");

// module variables
const debug = Debug("@forfuture/migrate:cli");


program
    .version(pkg.version)
    .usage("[options] [version]")
    .option("-c, --config-path <path>", "path to configurations file", "./scripts/config/migration")
    .option("-m, --migrations-path <path>", "path to migrations directory", "./scripts/migrations")
    .option("-p, --package-path <path>", "path to package.json")
    .option("-x, --current <version>", "use as current version")
    .option("-z, --latest", "migrate to the latest version")
    .option("-u, --undo", "undo last migration")
    .option("-l, --list", "list available data versions")
    .option("-w, --which", "show current data version")
    .option("-t, --history", "show migration history")
    ;


/** Main entry point for program. */
export async function main() {
    debug("parsing CLI args");
    program.parse(process.argv);

    // Resolve paths to absolutes
    const paths: { [key: string]: string } = {};
    ["configPath", "migrationsPath", "packagePath"].forEach(function(argName) {
        if (program[argName]) {
            paths[argName] = path.resolve(program[argName]);
        }
    });

    let projectHandle;

    const versions = await migrate.versions.getVersions(paths.migrationsPath);
    if (program.list) {
        console.log(versions);
        return await exit();
    }
    debug(`available data versions: ${versions}`);

    if (!versions.length) {
        return fail("no data versions found");
    }

    projectHandle = await migrate.project.openProject(paths.configPath, paths.migrationsPath);
    const currentVersion = projectHandle.dbVersions.current || program.current;
    if (!currentVersion) {
        return fail("current data version not resolved");
    }
    // NOTE/impl: The current version may still be `null` in
    // the project handle.
    projectHandle.dbVersions.current = currentVersion;

    if (program.which) {
        console.log(currentVersion);
        return await exit();
    }
    debug(`current data version: ${currentVersion}`);

    if (program.history) {
        console.log(projectHandle.dbVersions);
        return await exit();
    }
    debug(`previous data version: ${projectHandle.dbVersions.previous}`);

    let targetVersion;

    if (program.undo) {
        if (!projectHandle.dbVersions.previous) {
            return fail("previous data version not resolved");
        }
        targetVersion = projectHandle.dbVersions.previous;
    } else if (program.latest) {
        targetVersion = migrate.versions.getNewestVersion(versions);
    } else if (program.packagePath) {
        targetVersion = require(program.packagePath).version;
        if (!targetVersion) {
            return fail("package manifest is missing version property");
        }
    } else {
        targetVersion = program.args.shift();
        if (!targetVersion) {
            return fail("<version> arg not provided");
        }
    }

    if (versions.indexOf(targetVersion) === -1) {
        return fail("target data version not available");
    }

    if (currentVersion === targetVersion) {
        debug(`current data version (${currentVersion}) -eq target data version (${targetVersion})`);
        return await exit();
    }

    const migrateThroughVersions = migrate.versions.findVersionsInRange(versions, currentVersion, targetVersion);
    if (!migrateThroughVersions.length) {
        debug("no migrations to run");
        return await exit();
    }

    try {
        await migrate.project.migrateProject(projectHandle, migrateThroughVersions);
    } catch (error) {
        return await exit(error);
    }

    async function exit(error?: Error) {
        if (projectHandle) {
            await migrate.project.closeProject(projectHandle, error);
        }
        if (error) {
            fail(error);
        }
    }
}


/**
 * Exit the process with an error.
 * @param error Error object or error message
 */
function fail(error: Error | string) {
    const isError = error instanceof Error;
    const message = isError ? (error as Error).message : error;
    console.error(`error: ${message}`);
    if (isError) {
        const padding = "    ";
        const stack = padding + (error as Error).stack
            .split("\n")
            .slice(1)
            .map((line) => line.trim())
            .join(`\n${padding}`);
        console.error(stack);
    }
    process.exit(1);
}
