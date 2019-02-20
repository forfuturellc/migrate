/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
import { ICLIState } from "../types";
export declare function getVersions(state: ICLIState): Promise<string[]>;
export declare function migrate(state: ICLIState, versions: string[], targetVersion: string): Promise<void>;
