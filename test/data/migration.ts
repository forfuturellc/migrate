/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */

import * as migrate from "../../dist/lib";
import { recordCompletion } from "./migrations/utils";


export const context = { isContext: true };


export async function init(): Promise<migrate.project.IProjectState> {
    return {
        dbVersions: {
            current: "0.1.0",
            previous: "0.0.0",
        },
        context,
        async complete(error, output) {
            await recordCompletion();
        },
    };
}
