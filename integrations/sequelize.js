/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// installed modules
const async = require("asyncawait/async");
const await = require("asyncawait/await");
const Sequelize = require("sequelize");


const MigrationModel = {
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


function toMigration(migration) {
    if (!migration) {
        return null;
    }
    return {
        version: migration.version,
        migratedAt: migration.migratedAt,
    };
}


class SequelizeIntegration {
    constructor(sequelize, options={}) {
        this.sequelize = sequelize;
        this.options = Object.assign({
            tableName: "db_migrations",
        }, options);

        this._Migration = this.sequelize.define("DatabaseMigration", MigrationModel, {
            tableName: this.options.tableName,
        });
        this._transaction = null;
        this._empty = false;

        this.integrate = async (this.integrate);
        this.close = async (this.close);
    }

    integrate() {
        // TODO: Document that all models should & will be synced!
        await (this.sequelize.sync());
        this._transaction = await (this.sequelize.transaction());

        const migrations = await (this._Migration.findAll({
            order: [[MigrationModel.migratedAt.field, "DESC"]],
            limit: 2,
        }, {
            transaction: this._transaction,
        }));
        this._empty = !migrations.length;

        const versions = {
            current: toMigration(migrations[0]),
            previous: toMigration(migrations[1]),
        };
        // TODO: Document the context provided to migration modules.
        const context = {
            sequelize: this.sequelize,
            transaction: this._transaction,
        };

        return [versions, context, this.close.bind(this)];
    }

    close(error, output) {
        if (error || !output) {
            await (this._transaction.rollback());
            return;
        }

        const migrations = [];
        if (this._empty) {
            migrations.push({
                version: output.previousVersion,
                migratedAt: new Date(0),
            });
        }
        migrations.push({
            version: output.currentVersion,
            migratedAt: new Date(),
        });

        await (this._Migration.bulkCreate(migrations, {
            transaction: this._transaction,
        }));
        await (this._transaction.commit());
    }
}


exports = module.exports = SequelizeIntegration;
