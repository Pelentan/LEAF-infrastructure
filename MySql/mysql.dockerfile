FROM mysql:5.7.37-debian
RUN apt update &&  apt upgrade -y && apt install vim iputils-ping -y

ADD etc/leaf_portal.sql /docker-entrypoint-initdb.d
ADD etc/leaf_users.sql /docker-entrypoint-initdb.d
COPY etc/my.cnf /etc/mysql/my.cnf
ADD etc/setup_database.sh /docker-entrypoint-initdb.d/setup_database.sh


