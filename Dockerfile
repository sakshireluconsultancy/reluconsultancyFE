# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config file from host
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Replace the default Nginx configuration
# (Make sure nginx.conf exists at project root if you include this)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
