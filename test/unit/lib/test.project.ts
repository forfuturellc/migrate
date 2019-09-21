/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */

// installed modules
import test from "ava";

// own modules
import {
    closeProject,
    getProjectMigration,
    migrateProject,
    openProject,
} from "../../../dist/lib/project";
import { commonPaths } from "../utils";
import {
    assertContext,
    getRecordedMigrations,
    isCompleted,
} from "../../data/migrations/utils";

// module variables
let projectHandle;

test.beforeEach("opening project", async function(t) {
    projectHandle = await openProject(
        commonPaths.config,
        commonPaths.migrations,
    );
});

test("lib/project.openProject()", async function(t) {
    t.is(projectHandle.dbVersions.current, "0.1.0");
    t.is(projectHandle.dbVersions.previous, "0.0.0");
    assertContext(projectHandle.context);
    t.is(typeof projectHandle.complete, "function");
    t.is(projectHandle.configPath, commonPaths.config);
    t.is(projectHandle.migrationsPath, commonPaths.migrations);
});

test("lib/project.getProjectMigration()", async function(t) {
    const migration = await getProjectMigration(projectHandle, "0.1.0");
    t.is(migration.version, "0.1.0");
    t.is(typeof migration.up, "function");
    t.is(typeof migration.down, "function");
});

test("lib/project.migrateProject()", async function(t) {
    await migrateProject(projectHandle, "1.0.0", ["1.0.0"]);
    const migrated = await getRecordedMigrations();
    t.deepEqual(migrated, [["up", "1.0.0"]]);
    t.is(projectHandle.dbVersions.previous, "0.1.0");
    t.is(projectHandle.dbVersions.current, "1.0.0");
});

test("lib/project.closeProject()", async function(t) {
    await closeProject(projectHandle, null);
    t.true(await isCompleted());
});
