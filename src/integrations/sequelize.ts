/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */


// installed modules
import * as Sequelize from "sequelize";

// own modules
import * as migrate from "../lib";


/** Context passed to migration modules. */
export interface ISequelizeIntegrationContext {
    /** Sequelize instance. */
    sequelize: Sequelize.Sequelize;
    /** DB transaction. */
    transaction: Sequelize.Transaction;
}


/** Constructor options for `SequelizeIntegration`. */
export interface ISequelizeIntegrationOptions {
    /** Name for table used to store migration data. */
    tableName?: string;
}


/** Default construction options. */
export const defaultIntegrationOptions: ISequelizeIntegrationOptions = {
    tableName: "db_migrations",
};


/** DB model definition for a migration. */
export const MigrationModel = {
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
export class SequelizeIntegration {
    private Model: Sequelize.Model<any, any>;
    private transaction: Sequelize.Transaction;
    private isEmpty = false;

    constructor(
        private sequelize: Sequelize.Sequelize,
        private options: ISequelizeIntegrationOptions = {},
    ) {
        this.options = Object.assign({}, defaultIntegrationOptions, options);
        this.Model = this.sequelize.define("DatabaseMigration", MigrationModel, {
            tableName: this.options.tableName,
        });
    }

    public async integrate(): Promise<migrate.project.IProjectState> {
        await this.sequelize.sync();
        this.transaction = await this.sequelize.transaction();

        const migrations = await this.Model.findAll({
            order: [[MigrationModel.migratedAt.field, "DESC"]],
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
            } as ISequelizeIntegrationContext,
            complete: this.close.bind(this),
        };
    }

    private async close(error: Error, output: migrate.project.IMigrationOutput) {
        if (error || !output) {
            await this.transaction.rollback();
            await this.sequelize.close();
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

        await this.Model.bulkCreate(migrations, {
            transaction: this.transaction,
        });
        await this.transaction.commit();
        await this.sequelize.close();
    }
}
