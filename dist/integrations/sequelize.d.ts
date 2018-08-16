/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
import * as Sequelize from "sequelize";
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
export declare const defaultIntegrationOptions: ISequelizeIntegrationOptions;
/** DB model definition for a migration. */
export declare const MigrationModel: {
    id: {
        field: string;
        type: Sequelize.DataTypeInteger;
        primaryKey: boolean;
        autoIncrement: boolean;
    };
    version: {
        field: string;
        type: Sequelize.DataTypeText;
    };
    migratedAt: {
        field: string;
        type: Sequelize.DataTypeDate;
    };
};
/** Integration for Sequelize ORM. */
export declare class SequelizeIntegration {
    private sequelize;
    private options;
    private Model;
    private transaction;
    private isEmpty;
    constructor(sequelize: Sequelize.Sequelize, options?: ISequelizeIntegrationOptions);
    integrate(): Promise<migrate.project.IProjectState>;
    private close;
}
