# migrate

> Database-agnostic migration framework

* [Usage](#usage)
* [Installation](#installation)
* [License](#license)


<a name="usage"></a>
## usage

```bash
# Intro: We have entered into a project that does NOT
# manage database migrations, using this tool.

# Run migrations.
# The tool does not know which database version you are currently at.
# We need to explicitly specify this using the `--current` options.
# Let's assume we are at version `1.0.0` and we want to migrate to
# another version i.e. `1.1.0`
$ npx migrate \
    --current 1.0.0 \
    1.1.0

# From now on, we do NOT need to specify the --current option.
# The tool keeps history.

# ... new migrations added ...

# Migrate to the application's current version as
# specified in the relevant package.json.
$ npx migrate --package-path ./package.json

# Migrate to the latest version available.
$ npx migrate --latest

# Migrate to a specific version (e.g. 1.4.0).
$ npx migrate 1.4.0

# Undo last migration.
$ npx migrate --undo

# List available migrations/versions.
$ npx migrate --list

# Show current database version we are at.
$ npx migrate --which

# Show a brief history of migrations.
$ npx migrate --history

# Show help information.
$ npx migrate --help
```


<a name="installation"></a>
## installation

```bash
# Replace 'v0.2.1' with the latest version.
# See git tags.
$ npm install gitlab:forfuture/migrate#v0.2.1
```


<a name="license"></a>
## license

**The MIT License (MIT)**

Copyright (c) 2017 Forfuture LLC <we@forfuture.co.ke>
