/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// installed modules
const test = require("ava");


// own modules
const migrate = require("../..");


test("exports", (t) => {
    const keys = ["cli", "migrations", "utils"];
    for (const key of keys) {
        t.truthy(migrate[key], `${key} not exported.`);
    }
});
