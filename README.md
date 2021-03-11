## EVM-SCAN

### Setting
Set Database configure and evm jsonrpc url like this: 

`mv setting.js.example setting.js`
`mv config/setting.js.example config/setting.js`



### Database Migration
Use sequelize


#### Example
- Init: `node_modules/.bin/sequelize init`
- Status: `node_modules/.bin/sequelize db:migrate:status`
- Migrate: `node_modules/.bin/sequelize db:migrate`
- Undo migration: `node_modules/.bin/sequelize db:migrate:undo`
- Undo a migration: `node_modules/.bin/sequelize db:migrate:undo --name MigrationFile`
- Create model: `node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string`
- Create migration: `node_modules/.bin/sequelize migration:create --name UserAddAge`
- Create seed: `node_modules/.bin/sequelize seed:create --name userTest`
- Db seed: `node_modules/.bin/sequelize db:seed SeedFile`
- Db seed all: `node_modules/.bin/sequelize db:seed all`
- Undo Seed: `node_modules/.bin/sequelize db:seed:undo SeedFile`
- Undo all seed: `node_modules/.bin/sequelize db:seed:undo all`



### Usage
- migrate: `node_modules/.bin/sequelize db:migrate`
- run porter: `node porter.js`
- run api web service: `node api/index.js`