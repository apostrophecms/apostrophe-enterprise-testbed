#!/bin/bash

echo "**** VERSION OF DEBIAN:"
lsb_release -a
echo "^^^^ VERSION UP HERE"
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
apt-get update
apt-get install -y mongodb-org-shell
mongo --version && echo ">>> SUCCESSFUL MONGO SHELL INSTALL"
