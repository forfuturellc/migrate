/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
/* eslint-disable no-console */


// built-in modules
const async = require("asyncawait/async");
const await = require("asyncawait/await");
const path = require("path");


// installed modules
const Debug = require("debug");
const program = require("commander");


// own modules
const migrations = require("./migrations");
const pkg = require("../package");
const utils = require("./utils");


// module variables
const debug = Debug("migrate:cli");


program
    .version(pkg.version)
    .usage("[options] [version]")
    .option("-i, --init-path <path>", "path to initialization file", "./script/migrate")
    .option("-m, --migrations-path <path>", "path to migrations directory", "./script/migrations")
    .option("-p, --package-path <path>", "path to package.json", "./package")
    .option("-c, --current <version>", "use as current version")
    .option("-l, --latest", "migrate to the latest version")
    .option("-u, --undo", "undo last migration")
    .option("-l, --list", "list available data versions")
    .option("-w, --which", "show current data version")
    .option("-t, --history", "show migration history")
    ; // eslint-disable-line indent


const run = async (function run() {
    let projectHandle;
    let output;
    let error;

    try { await (async (function() {
        program.parse(process.argv);

        const paths = {};
        ["initPath", "migrationsPath", "packagePath"].forEach(function(key) {
            paths[key] = path.resolve(program[key]);
        });

        const versions = await (utils.getVersions(paths.migrationsPath));
        if (program.list) {
            console.log(versions);
            return;
        }

        projectHandle = await (utils.openProject(paths.initPath));

        const { dbVersions, context } = projectHandle;
        const currentVersion = (dbVersions.current && dbVersions.current.version) || program.current;
        if (!currentVersion) {
            console.error("error: current version not found");
            return;
        }
        if (program.which) {
            console.log(currentVersion);
            return;
        }
        debug("current version: %s", currentVersion);
        if (program.history) {
            console.log(dbVersions);
            return;
        }
        debug("versions in db: %j", dbVersions);

        let targetVersion = program.args.shift();
        if (targetVersion && versions.indexOf(targetVersion) === -1) {
            throw "target version not found";
        }
        if (!targetVersion && program.undo) {
            if (!dbVersions.previous) {
                return;
            }
            targetVersion = dbVersions.previous.version;
        }
        if (!targetVersion && program.latest) {
            targetVersion = migrations.getLatestVersion(versions);
        }
        if (!targetVersion) {
            try {
                targetVersion = require(paths.packagePath).version;
            } catch (error) {
                if (error.code === "MODULE_NOT_FOUND") {
                    throw "package file (e.g. package.json) not found";
                }
                throw error;
            }
            if (!targetVersion) throw "target version not found";
        }
        debug("target version: %s", targetVersion);

        if (currentVersion === targetVersion) {
            debug("currentVersion(%s) -eq targetVersion(%s)", currentVersion, targetVersion);
            return;
        }

        const targetMigrations = migrations.findVersions(versions, currentVersion, targetVersion).map(function(version) {
            return {
                version,
                module: require(path.join(paths.migrationsPath, version)),
            };
        });

        if (!targetMigrations.length) {
            debug("no migrations to run");
            return;
        }

        const up = migrations.goingUp(currentVersion, targetVersion);
        await (migrations.migrate(up, targetMigrations, context));

        output = {
            currentVersion: targetVersion,
            previousVersion: currentVersion,
        };
        debug("migration output: %j", output);
    })()); } catch (ex) {
        error = ex;
    }

    // Clean up.
    if (projectHandle) {
        await (utils.closeProject(projectHandle, error, output));
    }

    // Error handling.
    // TODO:
    // Improve error logging!
    if (error) {
        console.error("error:", error.message || error);
        if (error.stack) {
            const padding = "       ";
            console.error(padding + error.stack.split("\n").slice(1).map((l) => l.trim()).join(`\n${padding}`));
        }
        throw error;
    }

    return output;
});


const runAndExit = async (function runAndExit() {
    try {
        await (run());
    } catch (ex) {
        process.exit(1);
    }
    process.exit();
});


if (require.main === module) {
    runAndExit();
}


exports = module.exports = {
    /**
     * Run the CLI.
     * @kind function
     * @return {Promise}
     */
    run,
    /**
     * Run the CLI and exit immediately.
     * *Automatically invoked if this file is run as script.*
     * @kind function
     */
    runAndExit,
};
