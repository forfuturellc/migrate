/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
import * as migrate from "../lib";
export interface ICLIState {
    paths: {
        config: string;
        migrations: string;
        package: string;
    };
    project?: migrate.project.IProjectHandle;
}
