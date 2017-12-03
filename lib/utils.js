/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// built-in modules
const assert = require("assert");
const async = require("asyncawait/async");
const await = require("asyncawait/await");
const fs = require("fs");


// installed modules
const Debug = require("debug");
const Promise = require("bluebird");


// module variables
const debug = Debug("migrate:utils");


Promise.promisifyAll(fs);


const getVersions = async (function getVersions(migrationsPath) {
    debug("retrieving data versions at %s", migrationsPath);
    const migrations = await (fs.readdirAsync(migrationsPath));
    const versions = migrations.filter(function(filename) {
        // NOTE/impl: Typescript support
        return filename.endsWith(".map");
    }).map(function(filename) {
        return filename.replace(/\.[^\d]+$/, "");
    });

    debug("migrations found: %s", versions);
    return versions;
});


const openProject = async (function openProject(initPath) {
    debug("opening project at %s", initPath);
    // TODO:
    // Allow loading initialization files in other formats,
    // languages, etc.
    // Make initialization bad ass!
    const init = require(initPath);
    assert.equal(typeof init, "function", "Initialization function not found.");

    const [dbVersions, context, done] = await (init());

    return {
        initPath,
        dbVersions,
        context,
        done,
    };
});


const closeProject = async (function closeProject(handle, error, output) {
    debug("closing project at %j", handle.initPath);
    await (handle.done(error, output));
});


exports = module.exports = {
    /**
     * Retrieve the available versions for migration.
     * @kind function
     * @param  {String} migrationsPath Path to migrations directory
     * @return {Promise} `[ version... ]`
     */
    getVersions,
    /**
     * Open project, using initialization file at
     * `initPath`.
     * @kind function
     * @param  {String} initPath Path to initialization file
     * @return {Promise} `InitHandle { dbVersions, context, done }`
     */
    openProject,
    /**
     * Close project, using initialization handle.
     * @kind function
     * @param  {Object} initHandle Initialization handle
     * @return {Promise}
     */
    closeProject,
};
