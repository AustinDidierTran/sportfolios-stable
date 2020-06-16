pm2 stop all
npm i
cd api/src/db
db-migrate up
pm2 restart all