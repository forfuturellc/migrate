# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## Unreleased

Changed:

- Codebase refactored to TypeScript
- Import paths:
  - `require("@forfuture/migrate/integrations")` changed to `require("@forfuture/migrate/dist/integrations")`
- CLI options:
  - `-i, --init-path <path>` changed to `-c, --config-path <path>`
  - `-c, --current <version>` changed to `-x, --current <version>`
- CLI defaults:
  - path to configuration file; `./script/migrate` changed to `./scripts/config/migration`
  - path to migrations; `./script/migrations` changed to `./scripts/migrations`
  - target version **must** be specified using `--undo`, `--latest`, `--package-path` or `<version>` CLI arg
- Debug:
  - `debug` prefix changed from `migrate` to `@forfuture/migrate`

Fixed:

- CLI options:
  - `-l, --latest` changed to `-z, --latest`; `-l` is used alongside `--list`

Removed:

- CLI defaults:
  - default path to package/manifest file removed; `-p, --package-path <path>`


## 0.1.0 - 2017-12-21

Added:

* Add CLI options:
  - `--package-path`
  - `--latest`

Changed:

* By default, migrations will **not** migrate to latest version.
  Instead, the migration will migrate to the version specified in
  relevant package file (e.g. `package.json`). Use `--latest` CLI
  option to revert to earlier behaviour.

Fixed:

* **integrations/sequelize:** Fix running on a fresh database


## 0.0.0 - 2017-12-02

**Out in the Wild**
