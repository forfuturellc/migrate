/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// built-in modules
import * as fs from "fs";
import * as path from "path";

// installed modules
import * as Debug from "debug";
import * as semver from "semver";

// module variables
const debug = Debug("@forfuture/migrate:lib:versions");


/**
 * Return a sorted list of versions that would need to be
 * migrated through to move from version `from` to version `to`.
 * @param versions Versions to search through
 * @param from Current version
 * @param to Target version
 */
export function findVersionsInRange(versions: string[], from: string, to: string) {
    const isAscending = isVersionAscending(from, to);
    const [min, max] = isAscending ? [from, to] : [to, from];
    return versions.filter(function(version) {
        if (version === min) { return false; }
        return (semver.gt(version, min) && semver.lte(version, max));
    }).sort(isAscending ? semver.compare : semver.rcompare);
}


/**
 * Find the newest/latest version.
 * @param versions Versions to search through
 */
export function getNewestVersion(versions: string[]) {
    return versions.sort(semver.rcompare)[0];
}


/**
 * Find the oldest/earliest version.
 * @param versions Versions to search through
 */
export function getOldestVersion(versions: string[]) {
    return versions.sort(semver.compare)[0];
}


/**
 * Retrieve the available versions for migration.
 * @param migrationsPath Path to migrations directory
 */
export async function getVersions(migrationsPath: string) {
    debug(`retrieving data versions at ${migrationsPath}`);
    const migrations = await new Promise(function(resolve, reject) {
        fs.readdir(migrationsPath, async function(error, filenames) {
            if (error) {
                if (error.code === "ENOENT") {
                    return resolve([]);
                }
                return reject(error);
            }
            const stats = await Promise.all(filenames.map(function(file) {
                return new Promise(function(resolve2, reject2) {
                    fs.stat(path.join(migrationsPath, file), function(error2, stats2) {
                        if (error2) { return reject2(error2); }
                        return resolve2(stats2);
                    });
                });
            }));
            resolve(filenames.map((filename, index) => [filename, stats[index]]));
        });
    }) as [string, fs.Stats][];
    const versions = migrations
        // Ignore sourcemap files, type-definition files
        .filter(function([filename, stats]) {
            if (!stats.isFile()) { return true; }
            return !filename.endsWith(".map") && !filename.endsWith(".ts");
        })
        .map(function([filename, stats]) {
            // Remove extension
            if (stats.isFile()) {
                filename = filename.replace(/\.[^.]+$/, "");
            }
            return filename;
        })
        // Filter out invalid version specifiers
        .filter((version) => !!semver.valid(version))
        ;
    debug(`retrieved data versions: ${versions}`);
    return versions;
}


/**
 * Is the version ascending i.e. increasing.
 * @param from Current version
 * @param to Wanted version
 */
export function isVersionAscending(from: string, to: string) {
    return semver.lt(from, to);
}
