FROM node:current
EXPOSE 3001
# For build
ARG MONGODB_VERSION=${MONGODB_VERSION}
ARG DEBIAN_FRONTEND=noninteractive
# For runtime
ENV APOS_MONGODB_URI=${APOS_MONGODB_URI}
ENV PORT=3001
# We need mongodb community edition packages in order to get mongorestore, we use a
# separate container to actually run it because the CE packages insist on systemd, which isn't
# a Docker thing
RUN echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/${MONGODB_VERSION} main" | tee /etc/apt/sources.list.d/mongodb-org-${MONGODB_VERSION}.list
RUN wget -qO - https://www.mongodb.org/static/pgp/server-${MONGODB_VERSION}.asc | apt-key add -
RUN apt-get update
RUN apt-get install -y systemd mongodb-org-shell mongodb-org-tools
# Useful tools so we can muck about and install stuff
RUN apt-get install -y build-essential vim git
# Needed for headless chrome
RUN echo 1 | apt-get -y install keyboard-configuration libfreetype6 libfontconfig1 libnss3-dev libgconf-2-4 lsof
# This will produce errors but then apt-get will clean it up and make it work
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && dpkg -i ./google-chrome-stable_current_amd64.deb  || apt-get -f -y install
# Wrapper that runs with the right headless flags
#
# tried to run chrome not as root inside the container to avoid the need for --no-sandbox, but that
# runs into: https://github.com/jessfraz/dockerfiles/issues/350
RUN rm /usr/bin/google-chrome && echo "#!/bin/bash\ngoogle-chrome-stable --headless --disable-dev-shm-usage --no-sandbox \$*" > /usr/bin/google-chrome && chmod 755 /usr/bin/google-chrome

# Fake CMD. just keep the container alive so we can `docker-compose apostrophe exec` things of our choice
# https://github.com/docker/compose/issues/1926#issuecomment-505294443
CMD echo "Started up, use 'docker-compose exec apostrophe bash' to do as you please.\nThe data/apostrophe folder is shared with the host."; tail -f /dev/null
