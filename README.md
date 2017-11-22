# Parlameter deploy script

## Overview

Expects webhook requests. Only deploys if branch is `staging` or `master` based on NODE_ENV.


|NODE_ENV  |BRANCH  |
|----------|--------|
|staging   |staging |
|production|master  |

## Requirements

- [Setup the .bashrc](https://github.com/Unitech/pm2/issues/1887#issuecomment-327085935)
- [Setup the .bashrc part 2](https://github.com/Unitech/pm2/issues/1887#issuecomment-327085935)
