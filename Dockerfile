# Use proper node image
FROM node:14.18

# Directory to use in container
WORKDIR /sportfolios

ENV PATH /sportfolios/node_modules/.bin:$PATH

# Copy file into container
COPY . ./

# Install modules into container
RUN npm install && npm cache clean --force
# RUN apt-get update
# RUN apt-get -y install awscli 
EXPOSE 1337

# Start the api
CMD bash start.sh
# CMD npm run dev --trace-warnings"