# Parlameter deploy script

## Deploying
- Make sure pm2 is running on the remote (deployment) server
- To setup the app on the remote server, run `yarn run deploy:prod:setup` on your local computer (if on windows run from cygwin, mintty, etc.)
- After that every time you make changes and want to update the remote, run `yarn run deploy:prod` (locally)

## Setting up project to be auto deployed
- On the remote server `cd` in to the directory folder e.g. `/home/parlauser/parladeploy/current`
- In this directory run the command to setup the project e.g. `yarn run parlanode:prod:setup` (this will setup the app to be deployed locally, on the remote server)

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
