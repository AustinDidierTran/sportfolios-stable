# Sportfolios

A sport platform looking to generate sport portfolios (Sportfolios) automatically by helping sport associations handle their logistics, schedule and results and gather this data related to players.

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

Go to your Github Account on https://github.com
Click on your picture on the top right and access your Settings
In the Personal Settings, go to SSH and GPG keys
On the top right, press on New SSH Key
Give Personal Computer as the title. For the Key, paste your public SSH key
Your computer now has access to your Git Repository

Clone this repository using the url, like in this command.

```sh
git clone git@github.com:AustinDidierTran/sportfolios-stable.git
```

Once this is done, enter the project and install npm dependencies.

```sh
cd sportfolios-stable
npm install
```

Then, you will need to setup your postgresql database. Go to this link to install postgresql:

https://www.postgresql.org/download/

After this, connect postgresql

```
psql -U username
```

Where username is the username you set for postgresql.

Then, you will need to create 3 databases

```sql
CREATE DATABASE koa_api;
CREATE DATABASE koa_api_dev;
CREATE DATABASE koa_api_test;
\q
```

Once this is done, you will need to create a knexfile.js with your own configuration. It should look like this:

```javascript
const path = require('path');

const BASE_PATH = path.join(__dirname, 'api', 'src', 'db');

module.exports = {
  test: {
    client: 'pg',
    connection: 'database://username:password@localhost/koa_api_test',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  development: {
    client: 'pg',
    connection: 'database://username:password@localhost/koa_api_dev',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  development: {
    client: 'pg',
    connection: 'database://username:password@localhost/koa_api',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
};
```

Where koa_api_test is our test database, koa_api_dev is our development and koa_api is our production api. Don't forget to change database, username and password for the right arguments in the connection parameters

You will also need to create a new file at `api/src/db` called `database.json`. Its content will look like this:

```json
{
  "dev": "database://username:password@localhost/koa_api",
  "test": "database://username:password@localhost/koa_api_test",
  "prod": "database://username:password@localhost/koa_api_test",
  "other": "postgres://uname:pw@server.com/dbname"
}
```

Don't forget to change `database`, `username` and `password` for the right parameters.

You will then need to run migrations. To do so, you will need to install globally the `db-migrate` package.

```
npm install -g db-migrate
```

You can now run migrations to setup the database

```
db-migrate up
```

For more info about db-migrate, you can look at the documentation: https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#up

There you go. After this, run in two different terminals the following commands to run in dev:

```sh
npm run webserver
npm run dev
```

There you go, you should have a running API on port 1337 and server on port 3000!

## FAQ

### What to do if you can't connect to SSH

1. If it's your first time trying on your machine and on this network, you probably aren't authorized by the security group.

## References

### Webpack setup

Follow all the steps from this guide: https://webpack.js.org/guides/
