#!/bin/bash

# Stop script on error
set -e

# Configuration
CONTAINER_NAME="dax-issuer-web"
IMAGE_NAME="dax-issuer-web"
PORT_IN_USE=3030

echo "🚀 Starting zero-downtime deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Build new Docker image FIRST (before stopping containers)
echo ">>> Building new Docker image: $IMAGE_NAME:new"
echo ">>> This may take a few minutes..."

# Build the image and capture the result
echo ">>> Starting Docker build process..."
if docker build -t "$IMAGE_NAME:new" .; then
    echo "✅ Docker image built successfully!"
    
    # Verify the image was created and is available
    if docker images | grep -q "$IMAGE_NAME.*new"; then
        echo "✅ Image verification passed - proceeding with deployment"
    else
        echo "❌ Image verification failed - image not found!"
        echo "Aborting deployment to keep current version running."
        exit 1
    fi
else
    echo "❌ Failed to build new Docker image!"
    echo "Build process encountered errors."
    echo "Aborting deployment to keep current version running."
    exit 1
fi

echo ">>> Build phase completed successfully, proceeding with container management..."

# Now that build is successful, stop existing containers
echo ">>> Stopping existing containers..."

# Stop and remove any container using the same port
echo ">>> Checking for containers using port $PORT_IN_USE..."
EXISTING_CONTAINER=""
if docker ps --format '{{.ID}} {{.Ports}}' | grep -q ":$PORT_IN_USE->"; then
    EXISTING_CONTAINER=$(docker ps --format '{{.ID}} {{.Ports}}' | grep ":$PORT_IN_USE->" | awk '{print $1}' | head -n 1)
fi

if [ -n "$EXISTING_CONTAINER" ]; then
    echo ">>> Stopping and removing container using port $PORT_IN_USE..."
    docker stop "$EXISTING_CONTAINER" || true
    docker rm "$EXISTING_CONTAINER" || true
fi

# Stop and remove container with same name
echo ">>> Checking for existing container: $CONTAINER_NAME"
if docker ps -aq -f name="^${CONTAINER_NAME}$" | grep -q .; then
    echo ">>> Stopping and removing container: $CONTAINER_NAME"
    docker stop "$CONTAINER_NAME" || true
    docker rm "$CONTAINER_NAME" || true
fi

# Remove old image after successful build
echo ">>> Checking for old image: $IMAGE_NAME:latest"
if docker images -q "$IMAGE_NAME:latest" | grep -q .; then
    echo ">>> Removing old image: $IMAGE_NAME:latest"
    docker rmi -f "$IMAGE_NAME:latest" || true
fi

# Tag new image as latest
echo ">>> Tagging new image as latest"
docker tag "$IMAGE_NAME:new" "$IMAGE_NAME:latest"

# Remove the temporary 'new' tag
docker rmi "$IMAGE_NAME:new" || true

# Run new container with fixed name and port mapping
echo ">>> Running container: $CONTAINER_NAME on port $PORT_IN_USE"
docker run -d \
  -p "$PORT_IN_USE:3030" \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  "$IMAGE_NAME:latest"

# Verify the container is running
echo ">>> Verifying container deployment..."
sleep 3  # Give container a moment to start

if docker ps | grep -q "$CONTAINER_NAME"; then
    echo "✅ Container is running successfully!"
    echo "✅ Frontend deployment completed successfully!"
    echo "🌐 Application should be available at: http://localhost:$PORT_IN_USE"
else
    echo "❌ Container failed to start properly!"
    echo "Please check container logs: docker logs $CONTAINER_NAME"
    exit 1
fi