/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */

// installed modules
import * as Debug from "debug";

// own modules
import * as migrateLib from "../../lib";
import { ICLIState } from "../types";

// module variables
const debug = Debug("@forfuture/migrate:cli");

export async function getVersions(state: ICLIState) {
    const versions = await migrateLib.versions.getVersions(
        state.paths.migrations,
    );
    if (!versions.length) {
        throw new Error("no data versions found");
    }

    return versions;
}

export async function migrate(
    state: ICLIState,
    versions: string[],
    targetVersion: string,
) {
    const currentVersion = state.project.dbVersions.current;

    const migrateThroughVersions = migrateLib.versions.findVersionsInRange(
        versions,
        currentVersion,
        targetVersion,
    );
    if (!migrateThroughVersions.length) {
        debug("no migrations to run");
        return;
    }

    await migrateLib.project.migrateProject(
        state.project,
        targetVersion,
        migrateThroughVersions,
    );
}
