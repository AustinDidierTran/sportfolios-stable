# Use proper node image
FROM node:14.18

# Directory to use in container
WORKDIR /sportfolios

# Copy file into container
COPY . ./

# Install modules into container
RUN npm install && npm cache clean --force
RUN apt-get update && apt-get install awscli

#open port
EXPOSE 1337

# Start the api
CMD start.sh 
