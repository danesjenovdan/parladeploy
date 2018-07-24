# parladeploy
A server that listens for webhooks and auto-deploys configured projects when changes are pushed to github

---

## Deploying parladeploy itself
1. On remote server:
    - Make sure [pm2](https://github.com/Unitech/pm2) is running on the remote (deployment) server
2. On your local machine:
    - Install dependencies by running `yarn`
    - Check out the [`config.prod.js`](./config.prod.js) and [`ecosystem.config.js`](./ecosystem.config.js) file and configure it for your remote user, host, git repo, etc.
    - Run `yarn run deploy:<remote>:setup` from your local computer (if on Windows run the command from cygwin, mintty, etc.). This will setup the app on the remote server.
    - Run `yarn run deploy:<remote>`. This will update the remote app to your current git ref and (re)start the deployed app. Do this every time you make changes to this repo and want to update the deployed version.

## Setting up auto-deployment for other apps
1. On remote server:
    - `cd` to the directory where parladeploy itself is deployed e.g. `/home/parlauser/parladeploy/current`
    - Check out the configuration in `/targets/<app>/ecosystem.config.js`. If you want to deploy the app to the same machine that parladeploy runs on set the host to `localhost`
    - Run `yarn run <app>:setup`. This will setup the app to be deployed next time changes are pushed to the configured branch

---

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
