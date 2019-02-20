/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */

// installed modules
import * as Debug from "debug";

// own modules
import * as migrateLib from "../../lib";
import { ICLIState } from "../types";
import { getVersions, migrate } from "./utils";

// module variables
const debug = Debug("@forfuture/migrate:cli");


export async function move(state: ICLIState, options: {
    force?: boolean,
    target?: string;
    toLatestVersion?: boolean;
    usePackage?: boolean;
} = {}) {
    const versions = await getVersions(state);
    let targetVersion: string;

    if (options.toLatestVersion) {
        targetVersion = migrateLib.versions.getNewestVersion(versions);
    } else if (options.usePackage) {
        targetVersion = require(state.paths.package).version;
        if (!targetVersion) {
            throw new Error("package manifest is missing version property");
        }
    } else {
        targetVersion = options.target;
        if (!targetVersion) {
            throw new Error("<version> arg not provided");
        }
    }

    if (!options.force && versions.indexOf(targetVersion) === -1) {
        throw new Error("target data version not available");
    }

    if (state.project.dbVersions.current === targetVersion) {
        debug(`current data version same as target data version (${targetVersion})`);
        return;
    }

    await migrate(state, versions, targetVersion);
}
