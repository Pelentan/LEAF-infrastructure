FROM debian:bullseye as base

# Set container to EST
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create runtime user
# ARG BUILD_UID=1000
# ENV REMOTE_USER=\\tester
# RUN useradd -u $BUILD_UID -g www-data build_user

# Server installs
RUN apt-get update && apt-get install -y wget libpng-dev zlib1g-dev \
  libzip-dev git zip unzip iputils-ping netcat vim 

# Install NFS
RUN apt install -y nfs-kernel-server rpcbind
WORKDIR /mnt/sharefolder
RUN chown -R nobody:nogroup /mnt/sharefolder
RUN chmod -R 755 /mnt/sharefolder
RUN echo "/mnt/sharefolder  192.168.22.0/24(rw,sync,root_squash,no_subtree_check,no_wdelay)" > /etc/exports
RUN exportfs -rv
RUN firewall-cmd --zone=internal --add-service mountd --permanent
RUN firewall-cmd --zone=internal --add-service rpc-bind --permanent
RUN firewall-cmd --zone=internal --add-service nfs --permanent
RUN firewall-cmd --reload
RUN systemctl enable nfs-server rpcbind
RUN systemctl start nfs-server rpcbind nfs-mountd