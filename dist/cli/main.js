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
const actions = require("./actions");
const migrate = require("../lib");
const pkg = require("../../package");
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
    .option("-f, --force", "force migration");
/** Main entry point for program. */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        debug("parsing CLI args");
        program.parse(process.argv);
        const state = yield setup({
            noProject: program.list,
        });
        try {
            if (program.list) {
                yield actions.list(state);
            }
            else if (program.which) {
                yield actions.which(state);
            }
            else if (program.history) {
                yield actions.history(state);
            }
            else if (program.undo) {
                yield actions.undo(state);
            }
            else {
                yield actions.move(state, {
                    force: program.force,
                    target: program.args.shift(),
                    toLatestVersion: program.latest,
                    usePackage: !!program.packagePath,
                });
            }
            yield exit();
        }
        catch (error) {
            yield exit(error);
        }
        function exit(error) {
            return __awaiter(this, void 0, void 0, function* () {
                if (state.project) {
                    yield migrate.project.closeProject(state.project, error);
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
 * Initialize state for CLI.
 * @param options Setup options
 */
function setup(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const state = {
            paths: {
                config: path.resolve(program.configPath),
                migrations: path.resolve(program.migrationsPath),
                package: program.packagePath ? path.resolve(program.packagePath) : null,
            },
        };
        if (!options.noProject) {
            state.project = yield migrate.project.openProject(state.paths.config, state.paths.migrations);
            const currentVersion = state.project.dbVersions.current || program.current;
            if (!currentVersion) {
                fail("current data version not resolved");
            }
            state.project.dbVersions.current = currentVersion;
            debug(`database versions:`, state.project.dbVersions);
        }
        return state;
    });
}
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
//# sourceMappingURL=main.js.map