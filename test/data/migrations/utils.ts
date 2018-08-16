/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// built-in modules
import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

// own modules
import { context as originalContext } from "../migration";


/**
 * Common paths.
 */
export const commonPaths = {
    completion: path.resolve(__dirname, ".completion"),
    currentVersion: path.resolve(__dirname, ".current_version"),
    migratedVersions: path.resolve(__dirname, ".migrated_versions"),
};


export function assertContext(context: any) {
    assert.strictEqual(context, originalContext, "context mismatch");
}


export async function setCurrentVersion(version: string) {
    await new Promise(function(resolve, reject) {
        return fs.writeFile(commonPaths.currentVersion, version, function(error) {
            if (error) { return reject(error); }
            return resolve();
        });
    });
}

export async function recordCompletion() {
    await new Promise(function(resolve, reject) {
        return fs.writeFile(commonPaths.completion, "1", (e) => e ? reject(e) : resolve());
    });
}
export async function isCompleted() {
    return await new Promise(function(resolve) {
        return fs.stat(commonPaths.completion, (e) => e ? resolve(false) : resolve(true));
    });
}

export async function recordMigratedVersion(direction: "up" | "down", version: string) {
    const migratedVersions = await new Promise(function(resolve, reject) {
        return fs.readFile(commonPaths.migratedVersions, "utf8", function(error, contents) {
            if (error && error.code !== "ENOENT") { return reject(error); }
            return resolve(contents ? JSON.parse(contents) : []);
        });
    }) as [string, string][];
    migratedVersions.push([direction, version]);
    await new Promise(function(resolve, reject) {
        return fs.writeFile(commonPaths.migratedVersions, JSON.stringify(migratedVersions), function(error) {
            if (error) { return reject(error); }
            return resolve();
        });
    });
}
export async function getRecordedMigrations() {
    return await new Promise(function(resolve, reject) {
        return fs.readFile(commonPaths.migratedVersions, "utf8", function(error, contents) {
            if (error) {
                return reject(error);
            }
            return resolve(contents ? JSON.parse(contents) : []);
        });
    }) as [string, string][];
}
