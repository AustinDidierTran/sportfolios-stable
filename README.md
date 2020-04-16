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
https://www.freecodecamp.org/news/production-fullstack-react-express/

### How to create SSL certificates

```
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```
