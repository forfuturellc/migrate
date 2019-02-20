/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */

// own modules
import * as migrate from "../../lib";
import { ICLIState } from "../types";


export async function list(state: ICLIState) {
    const versions = await migrate.versions.getVersions(state.paths.migrations);
    console.log(versions);
}
