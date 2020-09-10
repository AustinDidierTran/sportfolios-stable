# Use proper node image
FROM node:14.4

# Directory to use in container
WORKDIR /sportfolios

ENV PATH /sportfolios/node_modules/.bin:$PATH

# Copy file into container
COPY ["package.json", "package-lock.json", "./"]

# Install modules into container
RUN npm install

COPY . ./

# Start the app
CMD ["npm", "run", "dev"]