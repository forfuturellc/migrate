/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 */
/**
 * Return a sorted list of versions that would need to be
 * migrated through to move from version `from` to version `to`.
 * @param versions Versions to search through
 * @param from Current version
 * @param to Target version
 */
export declare function findVersionsInRange(versions: string[], from: string, to: string): string[];
/**
 * Find the newest/latest version.
 * @param versions Versions to search through
 */
export declare function getNewestVersion(versions: string[]): string;
/**
 * Find the oldest/earliest version.
 * @param versions Versions to search through
 */
export declare function getOldestVersion(versions: string[]): string;
/**
 * Retrieve the available versions for migration.
 * @param migrationsPath Path to migrations directory
 */
export declare function getVersions(migrationsPath: string): Promise<string[]>;
/**
 * Is the version ascending i.e. increasing.
 * @param from Current version
 * @param to Wanted version
 */
export declare function isVersionAscending(from: string, to: string): boolean;
