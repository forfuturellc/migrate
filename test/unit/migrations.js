/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// installed modules
const test = require("ava");


// own modules
const migrations = require("../../lib/migrations");


test("migrations.findVersions()", (t) => {
    const samples = [
        [[["0.0.0", "0.1.0", "0.2.0", "0.3.0"], "0.0.0", "0.2.0"], ["0.1.0", "0.2.0"]],
    ];
    for (const sample of samples) {
        const [[ versions, from, to ], expected] = sample;
        t.deepEqual(migrations.findVersions(versions, from, to), expected, `migrations.findVersions(${versions}, ${from}, ${to})`);
    }
});


test("migrations.getEarliestVersion()", (t) => {
    const samples = [
        [["1.0.0", "0.1.0", "2.2.0", "2.0.0"], "0.1.0"],
    ];
    for (const sample of samples) {
        const [versions, expected] = sample;
        t.is(migrations.getEarliestVersion(versions), expected, `migrations.getEarliestVersion(${versions})`);
    }
});


test("migrations.getLatestVersion()", (t) => {
    const samples = [
        [["0.0.0", "0.1.0", "2.2.0", "2.0.0"], "2.2.0"],
    ];
    for (const sample of samples) {
        const [versions, expected] = sample;
        t.is(migrations.getLatestVersion(versions), expected, `migrations.getLatestVersion(${versions})`);
    }
});

test("migrations.goingUp()", (t) => {
    const samples = [
        [["0.0.0", "0.1.0"], true],
        [["0.1.0", "0.0.0"], false],
    ];
    for (const sample of samples) {
        const [[ from, to ], expected] = sample;
        t.is(migrations.goingUp(from, to), expected, `migrations.goingUp(${from}, ${to})`);
    }
});
