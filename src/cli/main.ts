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
import * as actions from "./actions";
import { ICLIState } from "./types";
import * as migrate from "../lib";
const pkg = require("../../package");

// module variables
const debug = Debug("@forfuture/migrate:cli");

program
    .version(pkg.version)
    .usage("[options] [version]")
    .option(
        "-c, --config-path <path>",
        "path to configurations file",
        "./scripts/config/migration",
    )
    .option(
        "-m, --migrations-path <path>",
        "path to migrations directory",
        "./scripts/migrations",
    )
    .option("-p, --package-path <path>", "path to package.json")
    .option("-x, --current <version>", "use as current version")
    .option("-z, --latest", "migrate to the latest version")
    .option("-u, --undo", "undo last migration")
    .option("-l, --list", "list available data versions")
    .option("-w, --which", "show current data version")
    .option("-t, --history", "show migration history")
    .option("-f, --force", "force migration");

/** Main entry point for program. */
export async function main() {
    debug("parsing CLI args");
    program.parse(process.argv);

    const state = await setup({
        noProject: program.list,
    });

    try {
        if (program.list) {
            await actions.list(state);
        } else if (program.which) {
            await actions.which(state);
        } else if (program.history) {
            await actions.history(state);
        } else if (program.undo) {
            await actions.undo(state);
        } else {
            await actions.move(state, {
                force: program.force,
                target: program.args.shift(),
                toLatestVersion: program.latest,
                usePackage: !!program.packagePath,
            });
        }

        await exit();
    } catch (error) {
        await exit(error);
    }

    async function exit(error?: Error) {
        if (state.project) {
            await migrate.project.closeProject(state.project, error);
        }
        if (error) {
            fail(error);
        }
    }
}

/**
 * Initialize state for CLI.
 * @param options Setup options
 */
async function setup(
    options: {
        noProject?: boolean;
    } = {},
): Promise<ICLIState> {
    const state = {
        paths: {
            config: path.resolve(program.configPath),
            migrations: path.resolve(program.migrationsPath),
            package: program.packagePath
                ? path.resolve(program.packagePath)
                : null,
        },
    } as ICLIState;

    if (!options.noProject) {
        state.project = await migrate.project.openProject(
            state.paths.config,
            state.paths.migrations,
        );

        const currentVersion =
            state.project.dbVersions.current || program.current;
        if (!currentVersion) {
            fail("current data version not resolved");
        }

        state.project.dbVersions.current = currentVersion;
        debug(`database versions:`, state.project.dbVersions);
    }

    return state;
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
        const stack =
            padding +
            (error as Error).stack
                .split("\n")
                .slice(1)
                .map((line) => line.trim())
                .join(`\n${padding}`);
        console.error(stack);
    }
    process.exit(1);
}
