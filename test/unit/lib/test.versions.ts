/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// installed modules
import test from "ava";

// own modules
import {
    findVersionsInRange,
    getNewestVersion,
    getOldestVersion,
    getVersions,
    isVersionAscending,
} from "../../../dist/lib/versions";
import { commonPaths } from "../utils";


test("lib/versions.findVersionsInRange()", function(t) {
    const data: [[string[], string, string], string[]][] = [
        // migrating up
        [
            [["0.4.0", "0.1.0", "0.2.0", "0.3.0", "0.5.0", "0.7.0"], "0.2.0", "0.5.0"],
            ["0.3.0", "0.4.0", "0.5.0"],
        ],
        // migrating down
        [
            [["0.4.0", "0.1.0", "0.2.0", "0.3.0", "0.5.0", "0.7.0"], "0.5.0", "0.2.0"],
            ["0.5.0", "0.4.0", "0.3.0"],
        ],
    ];
    for (const i of data) {
        const [[versions, from, to], expected] = i;
        t.deepEqual(findVersionsInRange(versions, from, to), expected);
    }
});


test("lib/versions.getNewestVersion()", function(t) {
    const data: [[string[]], string][] = [
        [[["1.0.0", "0.1.0", "2.2.0", "2.0.0"]], "2.2.0"],
    ];
    for (const i of data) {
        const [[versions], expected] = i;
        t.is(getNewestVersion(versions), expected);
    }
});


test("lib/versions.getOldestVersion()", function(t) {
    const data: [[string[]], string][] = [
        [[["1.0.0", "0.1.0", "2.2.0", "2.0.0"]], "0.1.0"],
    ];
    for (const i of data) {
        const [[versions], expected] = i;
        t.is(getOldestVersion(versions), expected);
    }
});


test("lib/versions.getVersions()", async function(t) {
    const versions = await getVersions(commonPaths.migrations);
    t.deepEqual(versions, ["0.0.0", "0.1.0", "1.0.0"]);
});


test("lib/versions.isVersionAscending()", function(t) {
    const data: [[string, string], boolean][] = [
        [["0.0.0", "0.1.0"], true],
        [["0.1.0", "0.0.0"], false],
        [["0.0.0", "0.0.0"], false],
    ];
    for (const i of data) {
        const [[from, to], expected] = i;
        t.is(isVersionAscending(from, to), expected);
    }
});
