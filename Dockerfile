# Base image
FROM node:18-alpine

# update npm global
RUN npm install -g npm@latest \
    && npm -g update

# update alpine dependencies
RUN apk update \
    && apk upgrade \
    && apk add --update tzdata \
    && rm -rf /var/cache/apk/*

# add git
RUN apk --no-cache add git

# Specific timezone for current container
ENV TZ=Asia/Bangkok

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# extract software version information from git
RUN git config --global --add safe.directory '*' \
    && git log -1 > APPLICATION_VERSION.txt

# Script generate Prisma
# RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
