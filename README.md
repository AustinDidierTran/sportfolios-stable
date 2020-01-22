# Todo list

### How to create a migration

1. db-migrate create _migration_name_ --sql-file
2. Edit up and down migration files
3. Run it with `db-migrate up [2020....]`. You can also set

REF: https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#up

### Setup hooks

Setup hooks, for example, on user delete, all user_to_team relations should be deleted for this

### Setup authentication, koa and test

https://mherman.org/blog/building-a-restful-api-with-koa-and-postgres/

### Setup webpack

Follow all the steps from this guide: https://webpack.js.org/guides/hot-module-replacement/

[x] Getting Started
[x] Asset management
[x] Output Management
[x] Development
[] Code splitting
[] Caching
[] Authoring libraries
[] Environment variables
[] Build performance
[] concent security policies
[] Development - Vagrant
[] Dependency Management
[] Installation
[] Scaffolding
[x] Hot module replacement
[] Tree Shaking
[] Production
[] Lazy Loading
[] Shimming
[] Typescript
[] Progresive Web Application
[] Public Path
[] Integrations
[] Asset Modules
[] Advanced Entry

### Asset-management

[] A logical next step from here is minifying and optimizing your images. Check out the image-webpack-loader and url-loader for more on how you can enhance your image loading process. (https://github.com/tcoopman/image-webpack-loader) (https://webpack.js.org/loaders/url-loader/)

# FAQ

### What to do if you can't connect to SSH

1. If it's your first time trying on your machine and on this network, you probably aren't authorized by the security group.
