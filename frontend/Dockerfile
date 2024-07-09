# Stage 1: Build the Angular application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY frontend/ ./

# Build the Angular application
RUN npm run build --prod


# Stage 2: Serve the Angular application
FROM nginx:alpine

# Copy the built app from Stage 1
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy nginx configuration file (if needed)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 4200

# Command to start nginx
CMD ["nginx", "-g", "daemon off;"]
