/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
import { ICLIState } from "../types";
export declare function move(state: ICLIState, options?: {
    force?: boolean;
    target?: string;
    toLatestVersion?: boolean;
    usePackage?: boolean;
}): Promise<void>;
