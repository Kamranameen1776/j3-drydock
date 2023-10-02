# J3 DryDock

Module for managing JiBe DryDock

Consists of [API](api/README.md) and [Frontend](frontend/README.md) projects.

### Prerequisites

https://dev.azure.com/jibe-erp/JiBe/_wiki/wikis/JiBe2Web.wiki/674/Development-Technology-Stack

### Publish & release new version

The project uses <b>semantic-release</b> bot that automates the whole release workflow.

### Release branches

```json
 "dev",
{
    "name": "beta",
    "prerelease": true
}
```

### How does it work?

The <b>semantic-release</b> uses the commit messages to determine the consumer impact of changes in the codebase.
|Commit message|Release type
|-|-|
|`fix(pencil)`: stop graphite breaking when too much pressure applied|~~Patch~~ Fix Release  
|`feat(pencil)`: add 'graphiteWidth' option|~~Minor~~ Feature Release  
|`perf(pencil)`: remove graphiteWidth option|~~Major~~ Breaking Release

When pushing commits to the prerelase branch, <b>semantic-release</b> will publish the pre-release version with \*-beta suffix on the dist-tag @beta

[^1]: For UI project you need to install dependencies separately

## Husky (Git Hooks)
This project uses Husky to run git hooks. Currently, it runs `pre-commit` hook which runs `npx lint-staged` command on all files in `frontend` folder with `.js`, `.ts` and `.html` extensions. If this command fails, the commit will be aborted. List or rules could be checked in `.eslintrc.js` and `.prettierrc` respectively.
__Important note__:
`husky` installed in root folder `package.json` so to run git hooks need to make `npm i` in the root folder of the project.
