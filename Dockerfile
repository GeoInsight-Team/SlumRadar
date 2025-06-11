# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (for TensorFlow)
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install dependencies (force reinstall to avoid issues)
RUN npm install --force

# Copy the entire backend code into the container
COPY . .

# Expose the port your backend runs on (change if needed)
EXPOSE 5000

# Ensure TensorFlow is properly built inside the container
RUN npm rebuild @tensorflow/tfjs-node --build-from-source

# Command to start the backend server
CMD ["npm", "run", "dev"]
