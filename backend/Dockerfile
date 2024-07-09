# Stage 1: Build the TypeScript code
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application
COPY . .

# Install dependencies
RUN npm install

# Compile the TypeScript code
RUN npm run build



# Stage 2: Run the application
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

COPY --from=0 /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/app.js"]
