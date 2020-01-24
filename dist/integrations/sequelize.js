"use strict";
/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// installed modules
const Sequelize = require("sequelize");
/** Default construction options. */
exports.defaultIntegrationOptions = {
    tableName: "db_migrations",
};
/** DB model definition for a migration. */
exports.MigrationModel = {
    id: {
        field: "id",
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    version: {
        field: "version",
        type: Sequelize.TEXT,
    },
    migratedAt: {
        field: "migrated_at",
        type: Sequelize.DATE,
    },
};
/** Integration for Sequelize ORM. */
class SequelizeIntegration {
    constructor(sequelize, options = {}) {
        this.sequelize = sequelize;
        this.options = options;
        this.isEmpty = false;
        this.options = Object.assign({}, exports.defaultIntegrationOptions, options);
        this.Model = this.sequelize.define("DatabaseMigration", exports.MigrationModel, {
            tableName: this.options.tableName,
        });
    }
    integrate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sequelize.sync();
            this.transaction = yield this.sequelize.transaction();
            const migrations = yield this.Model.findAll({
                order: [[exports.MigrationModel.migratedAt.field, "DESC"]],
                limit: 2,
                transaction: this.transaction,
            });
            this.isEmpty = !migrations.length;
            const getVersion = (migration) => migration ? migration.version : null;
            return {
                dbVersions: {
                    current: getVersion(migrations[0]),
                    previous: getVersion(migrations[1]),
                },
                context: {
                    sequelize: this.sequelize,
                    transaction: this.transaction,
                },
                complete: this.close.bind(this),
            };
        });
    }
    close(error, output) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error || !output) {
                yield this.transaction.rollback();
                yield this.sequelize.close();
                return;
            }
            const migrations = [];
            if (this.isEmpty) {
                migrations.push({
                    version: output.dbVersions.previous,
                    migratedAt: new Date(0),
                });
            }
            migrations.push({
                version: output.dbVersions.current,
                migratedAt: new Date(),
            });
            yield this.Model.bulkCreate(migrations, {
                hooks: false,
                transaction: this.transaction,
            });
            yield this.transaction.commit();
            yield this.sequelize.close();
        });
    }
}
exports.SequelizeIntegration = SequelizeIntegration;
//# sourceMappingURL=sequelize.js.map