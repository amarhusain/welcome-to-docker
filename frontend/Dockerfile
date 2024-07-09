# Stage 1: Build the Angular application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Expose port 80
EXPOSE 4200

# Start app
CMD ["ng", "serve"]
