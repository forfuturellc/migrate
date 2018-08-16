/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// own modules
import {
    assertContext,
    recordMigratedVersion,
    setCurrentVersion,
} from "./utils";

// module variables
const version = "0.0.0";


export async function up(context: any) {
    assertContext(context);
    await recordMigratedVersion("up", version);
    await setCurrentVersion(version);
}


export async function down(context: any) {
    assertContext(context);
    await recordMigratedVersion("down", version);
    await setCurrentVersion(version);
}
