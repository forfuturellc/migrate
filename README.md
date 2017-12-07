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
# Assume we are in version 1.0.0 already (using the --current option).
$ npx migrate --current 1.0.0

# From now on, we do NOT need to specify the --current option.
# The tool keeps history.

# ... new migrations added ...

# Migrate to the application's current version as
# specified in the relevant package.json.
# We expect to find package.json in the current working
# directory. Otherwise, specify the --pkg option.
$ npx migrate

# Migrate to the latest version.
$ npx migrate --latest

# Migrate to a specific version (e.g. 1.4.0).
$ npx migrate 1.4.0

# Undo last migration.
$ npx migrate --undo

# List available migrations/versions.
$ npx migrate --list

# Show current data version.
$ npx migrate --which

# Show a brief history of migrations.
$ npx migrate --history

# Show help information.
$ npx migrate --help
```


<a name="installation"></a>
## installation

```bash
# Replace '0.0.0' with the latest version.
# See git tags.
$ npm install gitlab:forfuture/migrate#0.0.0
```


<a name="license"></a>
## license

**The MIT License (MIT)**

Copyright (c) 2017 Forfuture LLC <we@forfuture.co.ke>
