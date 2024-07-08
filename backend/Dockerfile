# Stage 1: Build the TypeScript code
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Compile the TypeScript code
RUN npm run build

# Stage 2: Run the application
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files again to install production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the compiled code from the previous stage
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/app.js"]
