# Sportfolios

A sport platform looking to generate sport portfolios (Sportfolios) automatically by helping sport associations handle their logistics, schedule and results and gather this data related to players.

## Table of content

- [Project setup](#project-setup)
- [Install node,npm,nvm](#install-node-npm-nvm)
- [Setup the project with the mock server](#setup-the-project-with-the-mock-server)
- [Setup the project with a server](#setup-the-project-with-a-server)
- [How to run migrations](#how-to-run-migrations)
- [Final step](#final-step)
- [How to run the application](#how-to-run-the-application)
  - [How email are displayed](#how-email-are-displayed)
- [How to follow git flow and make standard pull requests](#how-to-follow-git-flow-and-make-standard-pull-requests)
- [FAQ](#faq)
  - [What to do if you can't connect to SSH](#what-to-do-if-you-can-t-connect-to-ssh)
- [References](#references)
  - [Webpack setup](#webpack-setup)
  - [How to create SSL certificates](#how-to-create-ssl-certificates)

## Project setup

Give your computer access to your Github account with an SSH Key

Verify if you already have an ssh key by running the following command:

```
cat ~/.ssh/id_rsa.pub
```

If it says file is not found, then you need to generate your SSH key using the following command

```
ssh-keygen -t rsa
```

Press enter until the ssh key is generated
Copy your SSH key to your clipboard by running the following command

```
pbcopy < ~/.ssh/id_rsa.pub
```

- Go to your Github Account on https://github.com
- Click on your picture on the top right and access your Settings
- In the Personal Settings, go to SSH and GPG keys
- On the top right, press on New SSH Key
- Give Personal Computer as the title. For the Key, paste your public SSH key
- Your computer now has access to your Git Repository

Clone this repository using the url, like in this command.

```sh
git clone git@github.com:AustinDidierTran/sportfolios-stable.git
```

Once this is done, enter the project and install npm dependencies.

```sh
cd sportfolios-stable
npm install
```

So there it is, you have installed the project! If you only need to do client-side development, setup the project with the mock server

## Install node,npm,nvm

In order to install and use npm, we recommend you use nvm (node version manager). You can install it with the following command:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

Then, you will have to install and use node v10.13.

```
nvm install 10.13
nvm use 10.13
```

## Setup the project with the mock server

First, create a copy of _conf-template.js_ and name it _conf.js_ at the root.

Second, create a _.env_ file at the root with the following content:

```
NODE_ENV=development

AWS_ACCESS_KEY_ID=AKIA6JQINATQN5SREG4U
AWS_SECRET_ACCESS_KEY=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
AWS_S3_BUCKET=sportfolios-images
```

Then, install pm2:

```
npm install pm2 -g
```

Then, at the root, simply run:

```
pm2 start pm2-dev.json
```

There it is, you have a running project pointing to the mock-server! Note that all your requests won't affect the data as it is all mocked.

## Setup the project with a server

To install postgres, you will need homebrew:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Then, install postgres:

```
brew install postgres
```

When you'll be prompted for a password, decide your own password. Know that it will be written in a config file, so it won't be encrypted on your computer, so don't choose a personal password. It will also be used for all projects locally, so make sure to remember it. Also, keep default port.

After this, connect postgresql

```
psql -U postgres
```

Where username is the username you set for postgresql.

Then, you will need to create 3 databases

```sql
CREATE DATABASE sportfolios_api;
CREATE DATABASE sportfolios_api_dev;
CREATE DATABASE sportfolios_api_test;
\q
```

Once this is done, you will need to create a knexfile.js with your own configuration. It should look like this:

```javascript
const path = require('path');

const BASE_PATH = path.join(__dirname, 'api', 'src', 'db');

module.exports = {
  test: {
    client: 'pg',
    connection:
      'database://username:password@localhost/sportfolios_api_test',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  development: {
    client: 'pg',
    connection:
      'database://username:password@localhost/sportfolios_api_dev',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  production: {
    client: 'pg',
    connection:
      'database://username:password@localhost/sportfolios_api',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
};
```

Where sportfolios_api_test is our test database, sportfolios_api_dev is our development and sportfolios_api is our production api. Don't forget to change database, username and password for the right arguments in the connection parameters

You will also need to create a new file at `api/src/db` called `database.json`. Its content will look like this:

```json
{
  "dev": "database://username:password@localhost/sportfolios_api_dev",
  "test": "database://username:password@localhost/sportfolios_api_test",
  "prod": "database://username:password@localhost/sportfolios_api",
  "other": "postgres://uname:pw@server.com/dbname"
}
```

Don't forget to change `database`, `username` and `password` for the right parameters.

## How to run migrations

You will then need to run migrations, to run migrations, you will need the package db-migrate. If it hasn’t been installed, install it with npm:

```
npm install -g db-migrate
```

Once it is installed, make sure you are in the db folder.

```
cd api/src/db
```

Then, run the following command:

```
db-migrate up
```

To create a new migration, think of a verbose name. You can look at examples to inspire yours. When ready, run the following command:

```
db-migrate create <migration name> --sql-file
```

For more info about db-migrate, you can look at the documentation: https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#up

## Final step

There you go. After this, run in two different terminals the following commands to run in dev:

```sh
npm run webserver
npm run dev
```

There you go, you should have a running API on port 1337 and server on port 3000!

## How to run the application

To run the application, simply run the following command:

```
pm2 start pm2-dev.json
```

If pm2 is not available, install it via npm

```
npm install pm2 -g
```

These are useful commands for use with pm2 in the project

```
pm2 status
pm2 logs api
pm2 logs webclient
pm2 restart all
pm2 stop all
```

### How email are displayed

As you won’t have access to the Google API Keys, you won’t receive any emails. The content of these emails will be logged into the terminal, which you will be able to access via this command:

```
pm2 logs api
```

## How to follow git flow and make standard pull requests

Before you start working, make sure you are on the latest version:

```
git checkout develop
git pull
```

Then, create a new branch and make sure it follows the standard <jira issue code>/<arbitrary short description>. For example, for the task WCS-51, you could create the branch with the following line:

```
git checkout -b WCS-51/add-git-instructions
```

Then, start coding! As you go on, you can watch your current branch status with the following commands.

```
git status
git diff
```

When you feel you are ready to commit and push files, you can start staging files. If you want to stage all files, you can use the following command:

```
git add .
```

If you don’t want to stage all files, please consider adding these files to .gitignore. If there is a reason you don’t want to add a file, you may add files manually this way:

```
git add <filepath>
```

Note that paths do not have to be complete. If they aren’t, it is going to stage all file whose paths start with the incomplete path.

Think of a quick commit message that says a lot in a short description. In the long run, try not to waste too much time on this, but at least make a minimal effort. Once you are ready, you can commit staged files using the following command:

```
git commit -m "<commit message>"
```

Then, when you are ready to push, you can do so with the following command.

```
git push
```

However, on your first push, you will need to set the upstream remote branch. You will be given the right command when trying to push and you will be able to copy/paste it. It should have the following form:

```
git push --set-upstream origin <branch name>
```

Then, head to https://github.com/AustinDidierTran/sportfolios-stable ‑
Connect your account to preview links
and create your pull request! There should be a link created to quickly create a pull request that looks like this:

![](pull-request.png)

Simply press on Compare & pull request to start creating your pull request.

Before you go any further, make sure the changes you pushed are the ones you wanted to make. If they are wrong, you can always update your changes and make another commit. As you push your new commit, the pull request will update automatically, as the branch will be updated and pull requests are based on branches, not commits.

Make sure your pull request name starts with the Jira issue name, followed by a short description. For example, for the issue WCS-51, it could look like [WCS-51] Add git instruction section to README. If there is anything visual that might be added, make sure it is there. You can also tag your master so that he gets notified to review your pull request.

## FAQ

### What to do if you can't connect to SSH

1. If it's your first time trying on your machine and on this network, you probably aren't authorized by the security group.

## References

### Webpack setup

Follow all the steps from this guide: https://webpack.js.org/guides/
https://www.freecodecamp.org/news/production-fullstack-react-express/

### How to create SSL certificates

```
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```
