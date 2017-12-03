/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// installed modules
const async = require("asyncawait/async");
const await = require("asyncawait/await");
const Debug = require("debug");
const semver = require("semver");


// module variables
const debug = Debug("migrate:migrations");


function findVersions(versions, from, to) {
    const up = goingUp(from, to);
    const [min, max] = up ? [from, to] : [to, from];

    return versions.filter(function(version) {
        if (up && version === from) return false;
        return semver.gte(version, min) && semver.lte(version, max);
    }).sort(up ? semver.compare : semver.rcompare);
}


function getEarliestVersion(versions) {
    return versions.sort(semver.compare)[0];
}


function getLatestVersion(versions) {
    return versions.sort(semver.rcompare)[0];
}


function goingUp(from, to) {
    return semver.lt(from, to);
}


const migrate = async (function migrate(up, migrations, context) {
    debug("running migrations");
    const method = up ? "up" : "down";

    // TODO: perform in parallel!
    for (const migration of migrations) {
        await (migration.module[method](context));
    }
});


exports = module.exports = {
    /**
     * Return versions satisfying range.
     * @kind function
     * @param  {String[]} versions Versions to inspect
     * @param  {String} from Current version
     * @param  {String} to Wanted version
     * @return {String[]} satisfying versions
     */
    findVersions,
    /**
     * Return the earliest version.
     * @kind function
     * @param  {String[]} versions Versions to inspect
     * @return {String}
     */
    getEarliestVersion,
    /**
     * Return the latest version.
     * @kind function
     * @param  {String[]} versions Versions to inspect
     * @return {String}
     */
    getLatestVersion,
    /**
     * Return `true` if `from` is lt `to`.
     * @kind function
     * @param  {String} from Current version
     * @param  {String} to Wanted version
     * @return {String}
     */
    goingUp,
    /**
     * Run migrations.
     * @kind function
     * @param  {Boolean} up Is going up?
     * @param  {Migration[]} migrations Migrations to run
     * @param  {Object} context Context passed to each migration
     * @param  {Function} done `callback(error)`
     */
    migrate,
};
