#!/usr/bin/env bash

printf '\n\nRunning sql scripts...'

mysql -uroot -p$MYSQL_ROOT_PASSWORD <<Set_Server_Defaults
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
Set_Server_Defaults

mysql -uroot -p$MYSQL_ROOT_PASSWORD <<GRANT_PRIVILEGES
GRANT ALL PRIVILEGES ON *.* TO 'tester'@'%' IDENTIFIED BY 'tester';
GRANT_PRIVILEGES
