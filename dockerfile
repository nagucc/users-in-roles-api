FROM node:9.8-alpine

# Set a working directory
WORKDIR /usr/src/app

COPY ./package.json .
COPY ./yarn.lock .

# Install Node.js dependencies
RUN yarn install --production --no-progress

# Copy application files
COPY ./src ./src

# Run the container under "node" user by default
USER node

CMD [ "npm", "start" ]