FROM node:current
WORKDIR /app
# This isn't good enough due to need to make sure we always build latest git masters, we do it inside an npm task
# COPY package.json /app
# RUN npm install
COPY . /app
# We are running tests only
# EXPOSE 3000
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN echo 1 | apt-get -y install keyboard-configuration
RUN apt-get install -y libfreetype6 libfontconfig1 libnss3-dev libgconf-2-4 libxss1 libappindicator1 libindicator7 xorg xvfb gtk2-engines-pixbuf sudo dbus-x11 xfonts-base xfonts-100dpi xfonts-75dpi xfonts-cyrillic xfonts-scalable
# apt-get -f install fixes the missing dependency errors from dpkg -i and follows through -Tom
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && dpkg -i ./google-chrome-stable_current_amd64.deb  || apt-get -f -y install
RUN rm /usr/bin/google-chrome && echo "#!/bin/bash\ngoogle-chrome-stable --no-sandbox $*" > /usr/bin/google-chrome && chmod 755 /usr/bin/google-chrome
# tried to run chrome not as root inside the container to avoid the need for --no-sandbox, but that runs into:
# https://github.com/jessfraz/dockerfiles/issues/350
# Which can only be "worked around" by disabling all security for docker, completely defeating the purpose.
# RUN groupadd -g 999 appuser && useradd -r -u 999 -g appuser appuser && mkdir -p /home/appuser && chown appuser.appuser /home/appuser && chown -R appuser.appuser /app
# USER appuser
CMD [ "./scripts/start-in-docker" ]
