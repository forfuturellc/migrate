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
const utils_1 = require("./utils");
function undo(state) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!state.project.dbVersions.previous) {
            throw new Error("previous data version not resolved");
        }
        yield utils_1.migrate(state, yield utils_1.getVersions(state), state.project.dbVersions.previous);
    });
}
exports.undo = undo;
//# sourceMappingURL=undo.js.map