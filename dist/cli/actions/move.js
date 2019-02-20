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
const utils_1 = require("./utils");
// module variables
const debug = Debug("@forfuture/migrate:cli");
function move(state, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const versions = yield utils_1.getVersions(state);
        let targetVersion;
        if (options.toLatestVersion) {
            targetVersion = migrateLib.versions.getNewestVersion(versions);
        }
        else if (options.usePackage) {
            targetVersion = require(state.paths.package).version;
            if (!targetVersion) {
                throw new Error("package manifest is missing version property");
            }
        }
        else {
            targetVersion = options.target;
            if (!targetVersion) {
                throw new Error("<version> arg not provided");
            }
        }
        if (!options.force && versions.indexOf(targetVersion) === -1) {
            throw new Error("target data version not available");
        }
        if (state.project.dbVersions.current === targetVersion) {
            debug(`current data version same as target data version (${targetVersion})`);
            return;
        }
        yield utils_1.migrate(state, versions, targetVersion);
    });
}
exports.move = move;
//# sourceMappingURL=move.js.map