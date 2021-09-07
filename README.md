# Sportfolios

A sport platform looking to generate sport portfolios (Sportfolios) automatically by helping sport associations handle their logistics, schedule and results and gather this data related to players.

## Table of content

- [Project setup](#project-setup)
- [Install node, npm, nvm](#install-node-npm-nvm)
- [Install db migrate](#install-db-migrate)
- [Setup the project](#setup-the-project)
- [Using Docker](#using-docker)
  - [Install Docker](#install-docker)
  - [Setup db migration](#setup-db-migration-docker)
  - [How to run the application](#how-to-run-the-application-docker)
- [Using pm2](#using-pm2)
  - [Install pm2](#install-pm2)
  - [Install postgresql](#install-postgresql)
  - [Setup db migration](#setup-db-migration-pm2)
  - [How to run the application](#how-to-run-the-application-pm2)
- [How to run migrations](#how-to-run-migrations)
- [How to run the application](#how-to-run-the-application)
- [How email are displayed](#how-email-are-displayed)
  - [With Docker](#with-docker)
  - [With pm2](#with-pm2)
- [How to follow git flow and make standard pull requests](#how-to-follow-git-flow-and-make-standard-pull-requests)
- [FAQ](#faq)
  - [What to do if you can't connect to SSH](#what-to-do-if-you-can't-connect-to-ssh)
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

## Install node, npm, nvm

In order to install and use npm, we recommend you use nvm (node version manager). You can install it with the following command:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

Then, you will have to install and use node v10.13.

```
nvm install 14.2
nvm use 14.2
```

## Install db migrate

You will then need to run migrations, to run migrations, you will need the package db-migrate. If it hasn’t been installed, install it with npm:

```
npm install -g db-migrate
```

## Setup the project

First, create a copy of _conf-template.js_ and name it _conf.js_ at the root.

Second, create a _.env_ file at the root with the following content:

```
NODE_ENV=development
PREFIX="[DEV] | "

AWS_ACCESS_KEY_ID=AKIA6JQINATQN5SREG4U
AWS_SECRET_ACCESS_KEY=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
AWS_S3_BUCKET=sportfolios-images

STRIPE_PUBLIC_KEY=pk_test_qd1ulz9FxZA3aj2OcBfjqqro00G1K5WrTb
STRIPE_SECRET_KEY=sk_test_tzvUgJHRWyWNg0s3ctjHFd6P00DoFwlm9f
STRIPE_WEBHOOK_SECRET=1

DISPLAY_ERROR=true

YOUR_EMAIL=[insert email here]
```

Third, create a folder named _keys_ and create a file named _google-keys.json_ at this path

```
sportfolios-stable/api/src/server/utils/keys/google-keys.json
```

Put this content inside of it

```
{
  "type": "service_account",
  "project_id": "sportfoliosapp-184623",
  "private_key_id": "3f6e19c005c9f8541fa45243647174a6dbbbe136",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQClyyn3wl0km8ue\nnWK/4plD/DmAY21cpvqGaPwLXJQP1yMDEWuwTnzEHp7ZBV75oWY691mNYbyu1o7P\nbxgNqUFxlD2DxHN5VFJJrpg3ZUFM4bomxEmk5Tl1MGudKL0C/1jT8rdQOGRLg9tj\nA79+IRLAaLY0hu/NQqxUKcO1QYHZ7WROxBFaBJfEkHy4dHz+MDgvR6GSQIe1seD/\n1rSDD8/0LWDVUf+MsnYmy0A0q2JpEHUIV0ZwVTCmmzo0k88WFAkEknkpe0E+Y7lu\nPSeXFUiRtGQrdu1CYmFZIMQphLgpj5Vy8Up4wHTtpan85UceS1mm0FuTIoBfAxAm\n3jkLSU1PAgMBAAECggEAI2CpWWl7l6K4/eUmm7x+KPAq0vckcHdfEQxY8BG2tHSb\nT33JpWryG6VPDw8i15C1sFJ0pQMckJBPE/toPg4GXXac87+ZRmQUVQ2xBG0SVJX8\nM2aCMnIJYzTMWdJGFtwm978cl70YxbZiu4uisobbKfyOGMJMbFfUTvdEgCp0y2wR\nByabwPp0kUa60zP16z4fqBmYNIqdYpWD06nWJR7PmoHeE2+OW+lvWi1v4EfYfRSl\nwtVL3ytHDZoC2rzEIuseWvKoT+cK5ULJAdf1ogtLcs52tjxy5LpjfbGPmrey5tk1\ndB8Ndr+ttPqGXkMdek5qhirVCUaaSqoPDvyEWWVWRQKBgQDZCk1X0vo0nMcJgUBm\nwsLpS9d7NYtehbg3JTQPed50c8rAHng9zvPRWHTUrRgbeJQ7VQe2teGDhpprIQq7\nQzHaiHg2Pdt8QSoMrBB7n9WvrJoGw9r6VJiBH/n2XyAaHai4Tf1s7HR9E2GuYGX8\nU55Gf685VnT/4biPtP7pulcWgwKBgQDDjen9dZwFDJ2Kk0b+pCLsc/yWdynAxo2M\nzJd2ldRN1Iwr9AIrx3gNEydTsPOwlaYC/kzZMNyCs/8nK1cWC2hgsmXcQA3PeRIz\nxZuDz8OE+eZy4hUYdkgu4e6I9HtqUBudvEwUlFbxhA72Xtx+H4Rf49bafnB++Wrf\nLWzDXloURQKBgQCeg/izEQLulCaGWaEorExgyaSKdzPgCDfgBsr8Fp0TXlKReG+H\nbPQETN+fSQCXZ7yTjOnCVxpqzk9PuOU2mb/6hLuPmiQInytP8Adl0vnlgWFJWZhA\nRrLPdARDHXy7tje4zDUwbY4yn4ozKnKyFHw/rxfR/8QZ8siyJJYdLJxYcwKBgQCM\nk5AJ7GnkF1WJMKZwl32jjR2e7LrPIezPsqOPU9XyvUCmuBp3bkUW4RX8S9BiuLFG\npZiI6V8bdlmNxtIrvreiC5y94C4NX3N+VCefcdOT3DGVlIClvSHW0gOv4FB39G5l\nzd7DTH/TzqMS6M6IvA9k/1yMZShpntL87KKrL0CCIQKBgArcBM6e9FdiFi0Wq9cq\nWdM7gZR8lphAfZgBst5xW8Nkgz5078MSFl96qZc2Xyc1RcsVTdXesz23zU8064iR\n6yF9TCoNgqN2SIs49kBUIbj+jlyurIU5XtcIj3HTjBG8LnfvLkBjiUibK1mrIc1R\njvFNrOQYBVWw/f1Rh5R35J9s\n-----END PRIVATE KEY-----\n",
  "client_email": "test-emails@sportfoliosapp-184623.iam.gserviceaccount.com",
  "client_id": "110025484649688284052",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/test-emails%40sportfoliosapp-184623.iam.gserviceaccount.com"
}

```

There are 2 ways to run the application:

- With [Docker](#using-docker) (works really well on Linux!)
- With [pm2](#using-pm2) (more used for mac)

#

## Using Docker

### Install Docker

Linux:

```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker your-user (no need to use sudo for each docker command)
```

Change 1.27.4 with the latest version of compose found here: https://docs.docker.com/compose/release-notes/

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Mac:

Install Docker Desktop from https://hub.docker.com/editions/community/docker-ce-desktop-mac

### Setup db migration Docker

Edit one line in the files `docker-compose.yml` and `docker-compose.prod.yml` to change your postgres password (optional):

```yml
POSTGRES_PASSWORD: password
```

In sportfolios-stable, create a knexfile.js with your own configuration. It should look like this:

```javascript
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_PATH = path.join(__dirname, 'api', 'src', 'db');

export const test = {
  client: 'pg',
  connection:
    'postgres://postgres:password@localhost/sportfolios_api_test',
  migrations: {
    directory: path.join(BASE_PATH, 'migrations'),
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds'),
  },
};
export const development = {
  client: 'pg',
  connection:
    'postgres://postgres:password@localhost/sportfolios_api_dev',
  migrations: {
    directory: path.join(BASE_PATH, 'migrations'),
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds'),
  },
};
export const production = {
  client: 'pg',
  connection:
    'postgres://postgres:password@localhost/sportfolios_api',
  migrations: {
    directory: path.join(BASE_PATH, 'migrations'),
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds'),
  },
};
```

Where sportfolios_api_test is our test database, sportfolios_api_dev is our development and sportfolios_api is our production api. Don't forget to change `password` for the right arguments in the connection parameters

You will also need to create a new file at `api/src/db` called `database.json`. Its content will look like this:

```json
{
  "dev": {
    "driver": "pg",
    "user": "postgres",
    "password": "password",
    "host": "localhost",
    "database": "sportfolios_api_dev"
  },
  "test": {
    "driver": "pg",
    "user": "postgres",
    "password": "password",
    "host": "localhost",
    "database": "sportfolios_api_test"
  },
  "prod": {
    "driver": "pg",
    "user": "postgres",
    "password": "password",
    "host": "localhost",
    "database": "sportfolios_api"
  },

  "other": "postgres://uname:pw@server.com/dbname"
}
```

Don't forget to change `password` for the right parameters (in Docker, the default postgresql user is `postgres`).

### How to run the application Docker

To run the application in development mode, you need to build the Docker containers and run them in sportfolios-stable:

Build containers:

```
docker-compose build
```

Run containers:

```
docker-compose up
```

Both at the same time:

```
docker-compose up --build
```

To run the application in production mode, simply run in sportfolios-stable this command:

```
docker-compose -f docker-compose.prod.yml up --build
```

These are useful commands to use with Docker in the project:

```
docker ps (list active containers and show id)
docker stop <container id or name> (stop a specific container)
ctrl+c (stop all containers started by the compose up command in "attached mode")
```

[Docker documentation](https://docs.docker.com/) for more infos

**Important notes:**

- If a postgresql server is already running locally on the pc, simply stop it with this command:

```
sudo service postgresql stop
```

- If you need to do a db migration, just run the db-migrate command while the db container is up and running.

- If there are some errors about `node_modules/.staging` when launching compose, try deleting `package-lock.json`.

- Whenever a new node module is installed, you need to stop the containers and rebuild them (know problem, could probably be improved so we could skip this step).

#

## Using pm2

### Install pm2

```
npm install pm2 -g
```

Then, at the root, simply run:

```
pm2 start pm2-dev.json
```

### Install postgresql

Linux:

```
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/ap (lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

sudo apt-get update

sudo apt-get -y install postgresql-12
```

Mac:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew install postgres
```

When you'll be prompted for a password, decide your own password. Know that it will be written in a config file, so it won't be encrypted on your computer, so don't choose a personal password. It will also be used for all projects locally, so make sure to remember it. Also, keep default port.

After this, connect postgresql

```
psql -U postgres
```

Where U is the username you set for postgresql.

Then, you will need to create 3 databases

```sql
CREATE DATABASE sportfolios_api;
CREATE DATABASE sportfolios_api_dev;
CREATE DATABASE sportfolios_api_test;
\q
```

### Setup db migration pm2

In sportfolios-stable, create a knexfile.js with your own configuration. It should look like this:

```javascript
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_PATH = path.join(__dirname, 'api', 'src', 'db');

export const test = {
  client: 'pg',
  connection:
    'postgres://postgres:password@localhost/sportfolios_api_test',
  migrations: {
    directory: path.join(BASE_PATH, 'migrations'),
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds'),
  },
};
export const development = {
  client: 'pg',
  connection:
    'postgres://postgres:password@localhost/sportfolios_api_dev',
  migrations: {
    directory: path.join(BASE_PATH, 'migrations'),
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds'),
  },
};
export const production = {
  client: 'pg',
  connection:
    'postgres://postgres:password@localhost/sportfolios_api',
  migrations: {
    directory: path.join(BASE_PATH, 'migrations'),
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds'),
  },
};
```

Where sportfolios_api_test is our test database, sportfolios_api_dev is our development and sportfolios_api is our production api. Don't forget to change `username` and `password` for the right arguments in the connection parameters

You will also need to create a new file at `api/src/db` called `database.json`. Its content will look like this:

```json
{
  "dev": {
    "driver": "pg",
    "user": "username",
    "password": "password",
    "host": "localhost",
    "database": "sportfolios_api_dev"
  },
  "test": {
    "driver": "pg",
    "user": "username",
    "password": "password",
    "host": "localhost",
    "database": "sportfolios_api_test"
  },
  "prod": {
    "driver": "pg",
    "user": "username",
    "password": "password",
    "host": "localhost",
    "database": "sportfolios_api"
  },

  "other": "postgres://uname:pw@server.com/dbname"
}
```

Don't forget to change `username` and `password` for the right parameters.

### How to run the application pm2

```
pm2 start pm2-dev.json
```

#

## How to run migrations

The first time you run the app and each time there is a migration to do, you need to do a migration.

Make sure you are in the db folder and that db is running (Docker or pm2 si up).

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

If the migration doesn't end with `[done]`, there is an error, first thing to do is to close your docker, after you can delete the node_module folder and package-lock.json file.

Then, run the following command at the root folder:

```
yarn
```

After you have to rebuild your container and go back in the db folder

```
api/src/db
```

And then run

```
db-migrate up
```

## How to access your local DB with pgAdmin4

First, install pgAdmin 4.

```
https://www.pgadmin.org/download/
```

Once installed create a server (right click on server then create) with those information:

![](pgAdminGeneral.png)

Change your username for your postgres username. If you don't have one try 'postgres' as username.

![](pgAdminConnection.png)

You're all set! Go to Servers -> Sportfolios -> Database -> sportfolios_api_dev -> Schemas -> Tables to see all your tables.

## Quick way to populate your db

Two SQL scripts exists to populate your db

```
sportfolios-stable/quickCreateTournamentQueries.sql
```

```
sportfolios-stable/quickCreateSessions.sql
```

Run them in pgAdmin using the Query tool

## How email are displayed

As you won’t have access to the Google API Keys, you won’t receive any emails. The content of these emails will be logged into the terminal, which you will be able to access via this command:

### With Docker

The containers logs will be printed in the terminal in which you did `docker-compose up`, you can always do:

```
docker logs sportfolios_api_dev
```

### With pm2

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

## PWA

### What is a PWA

A progressive web app is, as the name implies, a web application. It is said to be progressive because it has extra new features. In brief, it can be downloaded as an application with no extra code (except IOS), it works offline, and can use some native features, such as push notifications. [Learn more](https://web.dev/what-are-pwas/)

To be a PWA, the application need to pass all of the [LightHouse tests](https://web.dev/lighthouse-pwa/).

For further information, refer to this [article](https://web.dev/lighthouse-pwa/).

This [website](https://web.dev/lighthouse-pwa/) made by microsoft is great to test the production build.

### Service workers

An essential part of any PWA is the use of a service worker
Since we use webpack, we use [Workbox](https://web.dev/workbox/) to generate ours.

To learn more about service workers, you can play this [game](https://serviceworkies.com/), or read this [article](https://web.dev/service-worker-mindset/).

## What's next?

Next up, deploy the PWA on the google store and app store. To do so, use [PWABuilder](https://serviceworkies.com/).

We also need to optimize the downloads directly from our website, by adding a download banner on the beforeinstallprompt, for example. Follow this [article](https://web.dev/customize-install/) to learn how to do it.
