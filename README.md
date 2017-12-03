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

# ... new migrations added ...

# Run migrations.
# No need to specify which version we are in! The tool
# keeps history.
$ npx migrate

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
$ npm install gitlab:forfuture/migrate#semver:0.0.0
```


<a name="license"></a>
## license

**The MIT License (MIT)**

Copyright (c) 2017 Forfuture LLC <we@forfuture.co.ke>
