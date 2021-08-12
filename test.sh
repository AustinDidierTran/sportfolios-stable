cd api/src/db
db-migrate db:drop sportfolios_api_test #make sure you are not connected on pgadmin to sportfolios_api_test
db-migrate db:create sportfolios_api_test
db-migrate up -e 'test'
cd ../../..
jest