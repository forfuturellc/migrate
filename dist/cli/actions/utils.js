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
// installed modules
const Debug = require("debug");
// own modules
const migrateLib = require("../../lib");
// module variables
const debug = Debug("@forfuture/migrate:cli");
function getVersions(state) {
    return __awaiter(this, void 0, void 0, function* () {
        const versions = yield migrateLib.versions.getVersions(state.paths.migrations);
        if (!versions.length) {
            throw new Error("no data versions found");
        }
        return versions;
    });
}
exports.getVersions = getVersions;
function migrate(state, versions, targetVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentVersion = state.project.dbVersions.current;
        const migrateThroughVersions = migrateLib.versions.findVersionsInRange(versions, currentVersion, targetVersion);
        if (!migrateThroughVersions.length) {
            debug("no migrations to run");
            return;
        }
        yield migrateLib.project.migrateProject(state.project, targetVersion, migrateThroughVersions);
    });
}
exports.migrate = migrate;
//# sourceMappingURL=utils.js.map