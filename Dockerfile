FROM node:latest

# Set the working directory in the container
WORKDIR /myapp

# Copy package.json and install dependencies
COPY package.json /myapp
RUN npm install




# Copy the rest of the application code
COPY . .

# Start the application
CMD ["npm", "start"]
