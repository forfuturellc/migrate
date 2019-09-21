/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */

// own modules
import { ICLIState } from "../types";

export async function which(state: ICLIState) {
    console.log(state.project.dbVersions.current);
}
