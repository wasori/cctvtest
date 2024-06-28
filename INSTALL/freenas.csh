#!/bin/tcsh
echo "Installing updates..."
pkg update -f
pkg upgrade -y
echo "Installing packages..."
pkg install -y nano ffmpeg libav x264 x265 mysql56-server node npm
echo "Enabling mysql..."
sysrc mysql_enable=yes
service mysql-server start
echo "Adding Shinobi user to database..."
mysql -h localhost -u root -e "source sql/user.sql"
echo "Securing mysql..."
#/usr/local/bin/mysql_secure_installation
#mysql -h localhost -u root -e "source sql/secure_mysql.sq"
npm i npm -g
#There are some errors in here that I don't want you to see. Redirecting to dev null :D
npm install --unsafe-perm > & /dev/null
# npm audit fix --force > & /dev/null
npm install pm2@latest -g
cp conf.sample.json conf.json
cp super.sample.json super.json
pm2 start camera.js
#pm2 start cron.js
pm2 save
pm2 list
pm2 startup rcd
echo "====================================="
echo "||=====   Install Completed   =====||"
echo "====================================="
echo "||  Login with the Superuser and   ||"
echo "||       create a new user at      ||"
echo "||  http://THIS_JAIL_IP:8080/super ||"
echo "||==================================="
echo "|| Superuser : admin@shinobi.video ||"
echo "||     Default Password : admin    ||"
echo "====================================="
