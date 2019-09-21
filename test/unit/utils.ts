/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */

// built-in versions
import * as path from "path";

// module variables
const paths = {
    testData: path.resolve(__dirname, "../data"),
};

/**
 * Common paths.
 */
export const commonPaths = {
    testData: paths.testData,
    config: path.join(paths.testData, "migration"),
    migrations: path.join(paths.testData, "migrations"),
};
