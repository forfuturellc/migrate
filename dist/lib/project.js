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
const path = require("path");
// installed modules
const Debug = require("debug");
// own modules
const versions_1 = require("./versions");
// module variables
const debug = Debug("@forfuture/migrate:lib:project");
/**
 * Close project.
 * @param projectHandle Project handle
 * @param error Any error that might have occurred
 */
function closeProject(projectHandle, error) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`closing project with config file at ${projectHandle.configPath}`);
        let output;
        if (projectHandle.isMigrated) {
            output = {
                dbVersions: projectHandle.dbVersions,
            };
        }
        yield projectHandle.complete(error, output);
    });
}
exports.closeProject = closeProject;
/**
 * Retrieve migration for a version.
 * @param projectHandle Project handle
 * @param version Version handled by the migration
 */
function getProjectMigration(projectHandle, version) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`retrieving project migration for version ${version}`);
        const migrationModule = require(path.join(projectHandle.migrationsPath, version));
        const migration = {
            version,
            up: migrationModule.up,
            down: migrationModule.down,
        };
        return migration;
    });
}
exports.getProjectMigration = getProjectMigration;
/**
 * Migrate the project.
 * @param projectHandle Project handle
 * @param targetVersion Final target version
 * @param migrateThroughVersions Versions to migrate through
 */
function migrateProject(projectHandle, targetVersion, migrateThroughVersions) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`migrating project currently at version ${projectHandle.dbVersions.current}`);
        projectHandle.dbVersions.previous = projectHandle.dbVersions.current;
        for (const migrateVersion of migrateThroughVersions) {
            const migration = yield getProjectMigration(projectHandle, migrateVersion);
            const doUpgrade = versions_1.isVersionAscending(projectHandle.dbVersions.current, migrateVersion);
            if (doUpgrade) {
                debug(`migrating project up to version ${migrateVersion}`);
                yield migration.up(projectHandle.context);
            }
            else {
                debug(`migrating project down from version ${migrateVersion}`);
                yield migration.down(projectHandle.context);
            }
        }
        projectHandle.dbVersions.current = targetVersion;
        projectHandle.isMigrated = true;
    });
}
exports.migrateProject = migrateProject;
/**
 * Open project, with configuration file at `configPath`.
 * @param configPath Path to project file
 * @param migrationsPath Path to migration modules
 */
function openProject(configPath, migrationsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`opening project with config file at ${configPath}`);
        const config = require(configPath);
        const initRet = yield config.init();
        return Object.assign({}, initRet, { configPath,
            migrationsPath, isMigrated: false });
    });
}
exports.openProject = openProject;
//# sourceMappingURL=project.js.map