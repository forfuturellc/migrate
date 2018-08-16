"use strict";
/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// built-in modules
const path = require("path");
// installed modules
const Debug = require("debug");
const program = require("commander");
// own modules
const migrate = require("./lib");
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
    .option("-t, --history", "show migration history");
/** Main entry point for program. */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        debug("parsing CLI args");
        program.parse(process.argv);
        // Resolve paths to absolutes
        const paths = {};
        ["configPath", "migrationsPath", "packagePath"].forEach(function (argName) {
            if (program[argName]) {
                paths[argName] = path.resolve(program[argName]);
            }
        });
        let projectHandle;
        const versions = yield migrate.versions.getVersions(paths.migrationsPath);
        if (program.list) {
            console.log(versions);
            return yield exit();
        }
        debug(`available data versions: ${versions}`);
        if (!versions.length) {
            return fail("no data versions found");
        }
        projectHandle = yield migrate.project.openProject(paths.configPath, paths.migrationsPath);
        const currentVersion = projectHandle.dbVersions.current || program.current;
        if (!currentVersion) {
            return fail("current data version not resolved");
        }
        // NOTE/impl: The current version may still be `null` in
        // the project handle.
        projectHandle.dbVersions.current = currentVersion;
        if (program.which) {
            console.log(currentVersion);
            return yield exit();
        }
        debug(`current data version: ${currentVersion}`);
        if (program.history) {
            console.log(projectHandle.dbVersions);
            return yield exit();
        }
        debug(`previous data version: ${projectHandle.dbVersions.previous}`);
        let targetVersion;
        if (program.undo) {
            if (!projectHandle.dbVersions.previous) {
                return fail("previous data version not resolved");
            }
            targetVersion = projectHandle.dbVersions.previous;
        }
        else if (program.latest) {
            targetVersion = migrate.versions.getNewestVersion(versions);
        }
        else if (program.packagePath) {
            targetVersion = require(program.packagePath).version;
            if (!targetVersion) {
                return fail("package manifest is missing version property");
            }
        }
        else {
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
            return yield exit();
        }
        const migrateThroughVersions = migrate.versions.findVersionsInRange(versions, currentVersion, targetVersion);
        if (!migrateThroughVersions.length) {
            debug("no migrations to run");
            return yield exit();
        }
        try {
            yield migrate.project.migrateProject(projectHandle, targetVersion, migrateThroughVersions);
        }
        catch (error) {
            return yield exit(error);
        }
        return yield exit();
        function exit(error) {
            return __awaiter(this, void 0, void 0, function* () {
                if (projectHandle) {
                    yield migrate.project.closeProject(projectHandle, error);
                }
                if (error) {
                    fail(error);
                }
            });
        }
    });
}
exports.main = main;
/**
 * Exit the process with an error.
 * @param error Error object or error message
 */
function fail(error) {
    const isError = error instanceof Error;
    const message = isError ? error.message : error;
    console.error(`error: ${message}`);
    if (isError) {
        const padding = "    ";
        const stack = padding + error.stack
            .split("\n")
            .slice(1)
            .map((line) => line.trim())
            .join(`\n${padding}`);
        console.error(stack);
    }
    process.exit(1);
}
//# sourceMappingURL=cli.js.map