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

## Adding new deployment strategies

Duplicate the most appropriate project in `./targets` and adjust accordingly. Project folder contains a `flightplan.js`([flightplan](https://github.com/pstadler/flightplan)) file where you can setup the command line executions and it can also contain a `ecosystem.config.js` file which has the configuration for PM2 deployment if applicable.
