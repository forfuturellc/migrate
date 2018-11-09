"use strict";
/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// built-in modules
const fs = require("fs");
const path = require("path");
// installed modules
const Debug = require("debug");
const semver = require("semver");
// module variables
const debug = Debug("@forfuture/migrate:lib:versions");
/**
 * Return a sorted list of versions that would need to be
 * migrated through to move from version `from` to version `to`.
 * @param versions Versions to search through
 * @param from Current version
 * @param to Target version
 */
function findVersionsInRange(versions, from, to) {
    const isAscending = isVersionAscending(from, to);
    const [min, max] = isAscending ? [from, to] : [to, from];
    return versions.filter(function (version) {
        if (version === min) {
            return false;
        }
        return (semver.gt(version, min) && semver.lte(version, max));
    }).sort(isAscending ? semver.compare : semver.rcompare);
}
exports.findVersionsInRange = findVersionsInRange;
/**
 * Find the newest/latest version.
 * @param versions Versions to search through
 */
function getNewestVersion(versions) {
    return versions.sort(semver.rcompare)[0];
}
exports.getNewestVersion = getNewestVersion;
/**
 * Find the oldest/earliest version.
 * @param versions Versions to search through
 */
function getOldestVersion(versions) {
    return versions.sort(semver.compare)[0];
}
exports.getOldestVersion = getOldestVersion;
/**
 * Retrieve the available versions for migration.
 * @param migrationsPath Path to migrations directory
 */
function getVersions(migrationsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`retrieving data versions at ${migrationsPath}`);
        const migrations = yield new Promise(function (resolve, reject) {
            fs.readdir(migrationsPath, function (error, filenames) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        if (error.code === "ENOENT") {
                            return resolve([]);
                        }
                        return reject(error);
                    }
                    const stats = yield Promise.all(filenames.map(function (file) {
                        return new Promise(function (resolve2, reject2) {
                            fs.stat(path.join(migrationsPath, file), function (error2, stats2) {
                                if (error2) {
                                    return reject2(error2);
                                }
                                return resolve2(stats2);
                            });
                        });
                    }));
                    resolve(filenames.map((filename, index) => [filename, stats[index]]));
                });
            });
        });
        const versions = migrations
            // Ignore sourcemap files, type-definition files
            .filter(function ([filename, stats]) {
            if (!stats.isFile()) {
                return true;
            }
            return !filename.endsWith(".map") && !filename.endsWith(".ts");
        })
            .map(function ([filename, stats]) {
            // Remove extension
            if (stats.isFile()) {
                filename = filename.replace(/\.[^.]+$/, "");
            }
            return filename;
        })
            // Filter out invalid version specifiers
            .filter((version) => !!semver.valid(version));
        debug(`retrieved data versions: ${versions}`);
        return versions;
    });
}
exports.getVersions = getVersions;
/**
 * Is the version ascending i.e. increasing.
 * @param from Current version
 * @param to Wanted version
 */
function isVersionAscending(from, to) {
    return semver.lt(from, to);
}
exports.isVersionAscending = isVersionAscending;
//# sourceMappingURL=versions.js.map