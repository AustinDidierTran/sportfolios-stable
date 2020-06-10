pm2 stop all
cd api/src/db
db-migrate up
pm2 restart all