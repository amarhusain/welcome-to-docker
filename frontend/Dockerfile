# Stage 1: Build the Angular application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY frontend/ ./

# Build the Angular application
RUN npm run build --prod


# Expose port
EXPOSE 4200

# Command to start nginx
CMD ["ng", "serve"]
