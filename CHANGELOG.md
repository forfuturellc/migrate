# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## Unreleased

Added:

* Add CLI options:
  - `--package-path`
  - `--latest`

Changed:

* By default, migrations will **not** migrate to latest version.
  Instead, the migration will migrate to the version specified in
  relevant package file (e.g. `package.json`). Use `--latest` CLI
  option to revert to earlier behaviour.


## 0.0.0 - 2017-12-02

**Out in the Wild**
