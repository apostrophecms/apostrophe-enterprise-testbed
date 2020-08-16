FROM node:current
WORKDIR /app
# This isn't good enough due to need to make sure we always build latest git masters, we do it inside an npm task
# COPY package.json /app
# RUN npm install
COPY . /app
EXPOSE 3000
# For build
ARG MONGODB_VERSION=${MONGODB_VERSION}
ARG DEBIAN_FRONTEND=noninteractive
ENV APOS_MONGODB_URI=${APOS_MONGODB_URI}
# m won't work because in 4.4 it does not install mongorestore
# m mongodb version manager
# RUN npm install -g m

# We need mongodb community edition packages in order to get mongorestore
RUN echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/${MONGODB_VERSION} main" | tee /etc/apt/sources.list.d/mongodb-org-${MONGODB_VERSION}.list
RUN echo "Version: ${MONGODB_VERSION}"
RUN wget -qO - https://www.mongodb.org/static/pgp/server-${MONGODB_VERSION}.asc | apt-key add -
RUN apt-get update
RUN apt-get install -y systemd mongodb-org-shell mongodb-org-tools # mongodb-org-shell mongodb-org-mongos mongodb-org-server mongodb-org-tools
# Useful tools so we can muck about and install stuff
RUN apt-get install -y build-essential vim git
RUN echo 1 | apt-get -y install keyboard-configuration libfreetype6 libfontconfig1 libnss3-dev libgconf-2-4 lsof
# libxss1 libappindicator1 libindicator7 xorg xvfb gtk2-engines-pixbuf sudo dbus-x11 xfonts-base xfonts-100dpi xfonts-75dpi xfonts-cyrillic xfonts-scalable
# apt-get -f install fixes the missing dependency errors from dpkg -i and follows through -Tom
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && dpkg -i ./google-chrome-stable_current_amd64.deb  || apt-get -f -y install
RUN rm /usr/bin/google-chrome && echo "#!/bin/bash\ngoogle-chrome-stable --headless --disable-dev-shm-usage --no-sandbox \$*" > /usr/bin/google-chrome && chmod 755 /usr/bin/google-chrome
# tried to run chrome not as root inside the container to avoid the need for --no-sandbox, but that runs into:
# https://github.com/jessfraz/dockerfiles/issues/350
# Which can only be "worked around" by disabling all security for docker, completely defeating the purpose.
# RUN groupadd -g 999 appuser && useradd -r -u 999 -g appuser appuser && mkdir -p /home/appuser && chown appuser.appuser /home/appuser && chown -R appuser.appuser /app
# USER appuser
#CMD echo "URI: ${APOS_MONGODB_URI}" && ./scripts/start-in-docker
# CMD rm -rf node_modules && npm install && npm start

#CMD npm test

# Just keep the container alive so we can `docker-compose apostrophe exec` things of our choice
# https://github.com/docker/compose/issues/1926#issuecomment-505294443
CMD while :; do :; done & kill -STOP $! && wait $!
