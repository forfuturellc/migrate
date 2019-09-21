/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */

// own modules
import { ICLIState } from "../types";
import { getVersions, migrate } from "./utils";

export async function undo(state: ICLIState) {
    if (!state.project.dbVersions.previous) {
        throw new Error("previous data version not resolved");
    }

    await migrate(
        state,
        await getVersions(state),
        state.project.dbVersions.previous,
    );
}
