# 🚀 Deployment Guide

> **Purpose:** To provide a streamlined production deployment strategy for the DAX Issuer Web application using Docker with zero-downtime capabilities, focused on main branch deployments.

---

## 📋 Table of Contents

1. [Prerequisites](#1️⃣-prerequisites)
2. [Quick Start Guide](#2️⃣-quick-start-guide)
3. [Configuration](#3️⃣-configuration)
4. [Deployment Process](#4️⃣-deployment-process)
5. [Versioning & Tagging](#5️⃣-versioning--tagging)
6. [Docker Optimizations](#6️⃣-docker-optimizations)
7. [Health Checks & Monitoring](#7️⃣-health-checks--monitoring)
8. [Troubleshooting](#8️⃣-troubleshooting)
9. [Quick Reference](#✅-quick-reference)

---

## 1️⃣ Prerequisites

### 🛠️ Required Tools

| Tool               | Version | Purpose             | Installation                                               |
| ------------------ | ------- | ------------------- | ---------------------------------------------------------- |
| **Docker Desktop** | Latest  | Container runtime   | [Download](https://www.docker.com/products/docker-desktop) |
| **Git**            | 2.30+   | Version control     | [Download](https://git-scm.com/)                           |
| **Node.js**        | 20+     | Runtime environment | [Download](https://nodejs.org/)                            |
| **Shell**          | bash/sh | Script execution    | Git Bash (Windows)                                         |

### 💾 System Requirements

- **Disk Space:** Minimum 2GB available
- **Memory:** 4GB RAM recommended
- **Network:** Internet access for Docker pulls
- **Port:** 3030 available for the application

### 📚 Knowledge Prerequisites

- Understanding of [Git Workflow Guidelines](git-workflow-guidelines.md)
- Basic Docker concepts
- Shell scripting fundamentals

---

## 2️⃣ Quick Start Guide

### 🚀 Production Deployment

#### Step-by-Step Process

```bash
# 1️⃣ Ensure you're on main branch with latest changes
git checkout main
git pull origin main

# 2️⃣ Deploy
dos2unix deploy.sh
sh deploy.sh
```

#### 🔍 Verification

```bash
# Check deployment status
docker ps | grep dax-issuer-web

# Test application
curl http://localhost:3030

# View logs
docker logs dax-issuer-web
```

---

## 📁 File Structure

```
├── Dockerfile              # 🐳 Optimized production Dockerfile
├── deploy.sh               # 🚀 Zero-downtime deployment script
├── .dockerignore           # 🚫 Files to exclude from Docker context
└── docs/
    deployment-guide.md  # 📖 This deployment guide
```

---

## 3️⃣ Configuration

### Script Variables

The deployment script uses these configurable variables:

| Variable         | Default          | Description           |
| ---------------- | ---------------- | --------------------- |
| `CONTAINER_NAME` | `dax-issuer-web` | Docker container name |
| `IMAGE_NAME`     | `dax-issuer-web` | Docker image name     |
| `PORT_IN_USE`    | `3030`           | Application port      |

### Customizing Configuration

You can modify these variables directly in `deploy.sh` or set them as environment variables:

```bash
# Custom deployment with different port
PORT_IN_USE=8080 sh deploy.sh

# Custom container name
CONTAINER_NAME=my-app sh deploy.sh
```

---

## 🏗️ Dockerfile Optimizations

### Multi-Stage Build

- **Builder Stage**: Builds the application with all dependencies
- **Runner Stage**: Minimal runtime image with production dependencies only

### Performance Features

- Alpine Linux base for smaller image size (~100MB vs 1GB+)
- Node.js 20 for latest performance improvements
- BuildKit enabled for faster builds and layer caching
- Non-root user (`nextjs:nodejs`) for security
- Optimized package installation with `npm ci`
- Standalone Next.js output for minimal runtime

### Security Features

- Non-root user execution
- Minimal attack surface with Alpine Linux
- Production-only dependencies in runtime
- Proper signal handling with `dumb-init`

## 4️⃣ Deployment Process

### 🔄 Zero-Downtime Deployment Workflow

#### Step-by-Step Process

| Step   | Action                   | Description                           | Safety Measure                          |
| ------ | ------------------------ | ------------------------------------- | --------------------------------------- |
| **1️⃣** | **Git Validation**       | Verify main branch and latest changes | Ensure deployment from correct source   |
| **2️⃣** | **Prerequisites Check**  | Docker daemon, port conflicts         | Fail fast before any changes            |
| **3️⃣** | **Image Building**       | Build new Docker image                | Verify build before stopping containers |
| **4️⃣** | **Container Management** | Stop old, start new container         | Graceful shutdown with cleanup          |
| **5️⃣** | **Health Verification**  | Test application responsiveness       | Ensure successful deployment            |
| **6️⃣** | **Post-Deployment**      | Logging and cleanup                   | Audit trail and resource management     |

#### Deployment Safety Features

```bash
# ✅ Build verification before stopping current container
if docker build -t "$IMAGE_NAME:new" .; then
    echo "✅ Build successful, proceeding with deployment"
else
    echo "❌ Build failed, aborting deployment"
    exit 1
fi

# ✅ Graceful container shutdown
docker stop "$CONTAINER_NAME" --time 30 || true

# ✅ Automatic cleanup
docker image prune -f > /dev/null 2>&1 || true
```

### Production Deployment Rules

| Rule                   | Requirement                    | Purpose                      |
| ---------------------- | ------------------------------ | ---------------------------- |
| **� Main Branch Only** | Deploy only from `main` branch | Ensure stable, tested code   |
| **✅ Build Success**   | Docker build must complete     | Prevent broken deployments   |
| **� Health Check**     | Application must respond       | Verify successful deployment |
| **🧹 Cleanup**         | Remove old images/containers   | Maintain clean environment   |

---

## 5️⃣ Versioning & Tagging

### 🏷️ Semantic Versioning

Following [SemVer](https://semver.org/) standards for production releases:

```
v1.2.3
│ │ │
│ │ └── PATCH: Bug fixes, security patches
│ └──── MINOR: New features, backward compatible
└────── MAJOR: Breaking changes, API modifications
```

#### Version Examples

| Version Change | Example             | Purpose          | When to Use                     |
| -------------- | ------------------- | ---------------- | ------------------------------- |
| **🚀 MAJOR**   | `v1.0.0` → `v2.0.0` | Breaking changes | API redesign, major refactor    |
| **✨ MINOR**   | `v1.1.0` → `v1.2.0` | New features     | Add functionality, enhancements |
| **🐛 PATCH**   | `v1.1.1` → `v1.1.2` | Bug fixes        | Hotfixes, security patches      |

### Production Deployment with Tags

#### Creating and Deploying Tagged Releases

```bash
# 1️⃣ Prepare release on main branch
git checkout main
git pull origin main

# 2️⃣ Create semantic version tag
git tag -a v1.2.0 -m "Release v1.2.0: Add user authentication and dashboard
- feat(auth): Google OAuth integration
- feat(dashboard): User activity overview
- fix(ui): Form validation improvements
- perf(api): Database query optimization"

# 3️⃣ Push tag to remote
git push origin v1.2.0

# 4️⃣ Deploy to production
sh deploy.sh

# 5️⃣ Tag Docker image with same version
docker tag dax-issuer-web:latest dax-issuer-web:v1.2.0
```

#### Version-Specific Deployment

```bash
# Deploy specific version
VERSION=v1.2.0
docker run -d \
  -p 3030:3030 \
  --name dax-issuer-web \
  --restart unless-stopped \
  dax-issuer-web:$VERSION
```

---

## 🏥 Health Checks

### Built-in Container Health

The Dockerfile includes a health check that:

- Tests HTTP endpoint availability
- Runs every 30 seconds with 10-second timeout
- Allows 3 retries with 40-second startup grace period
- Uses Node.js to verify application responsiveness

### Manual Health Verification

```bash
# Check container health status
docker inspect dax-issuer-web --format='{{.State.Health.Status}}'

# Test application endpoint
curl http://localhost:3030

# View health check logs
docker inspect dax-issuer-web --format='{{range .State.Health.Log}}{{.Output}}{{end}}'
```

## 🔄 Container Management

### Stopping and Starting

```bash
# Stop the application
docker stop dax-issuer-web

# Start the application
docker start dax-issuer-web

# Restart the application
docker restart dax-issuer-web

# Remove the container completely
docker stop dax-issuer-web && docker rm dax-issuer-web
```

### Manual Deployment Steps

If you need to deploy manually without the script:

```bash
# 1. Build the image
docker build -t dax-issuer-web:latest .

# 2. Stop existing container
docker stop dax-issuer-web || true
docker rm dax-issuer-web || true

# 3. Run new container
docker run -d \
  -p 3030:3030 \
  --name dax-issuer-web \
  --restart unless-stopped \
  dax-issuer-web:latest
```

## 🧹 Maintenance

### Cleanup Commands

```bash
# Clean up Docker resources
docker system prune -f

# Remove unused images
docker image prune -f

# View container logs
docker logs dax-issuer-web

# View container stats
docker stats dax-issuer-web

# Check container resource usage
docker stats --no-stream dax-issuer-web
```

### Monitoring

```bash
# View real-time logs
docker logs -f dax-issuer-web

# View last 100 log lines
docker logs --tail 100 dax-issuer-web

# Check container status
docker ps | grep dax-issuer-web

# Inspect container details
docker inspect dax-issuer-web
```

## 🐳 Docker Compose Usage

### Production

```bash
docker-compose up -d
```

### Development

```bash
docker-compose --profile dev up -d
```

### With Custom Environment

```bash
# Create docker-compose.override.yml for custom settings
docker-compose up -d
```

## 🛠️ Development Workflow

### Local Development with Docker

```bash
# Build and run development container
docker build -f Dockerfile.dev -t dax-issuer-web:dev .
docker run -d -p 3000:3000 -v $(pwd):/app --name dax-issuer-web-dev dax-issuer-web:dev

# Or use Docker Compose
docker-compose --profile dev up -d
```

### Building Production Image

```bash
# Using the build script
./docker-build.sh build

# With custom tag
./docker-build.sh build --tag v1.0.0

# With cache optimization
./docker-build.sh build-cache
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3030
   # or on Windows:
   netstat -ano | findstr :3030

   # Kill process using the port (Linux/Mac)
   lsof -ti :3030 | xargs kill -9

   # Modify port in deploy.sh
   # Change PORT_IN_USE=3030 to PORT_IN_USE=8080
   ```

2. **Docker Build Fails**

   ```bash
   # Check Docker daemon
   docker info

   # Clean build cache
   docker builder prune -f

   # Check available disk space
   df -h

   # Manual build with verbose output
   docker build --no-cache -t dax-issuer-web:test .
   ```

3. **Container Won't Start**

   ```bash
   # Check container logs
   docker logs dax-issuer-web

   # Check container status
   docker ps -a | grep dax-issuer-web

   # Inspect container configuration
   docker inspect dax-issuer-web

   # Run container interactively for debugging
   docker run -it --rm dax-issuer-web:latest sh
   ```

4. **Application Not Accessible**

   ```bash
   # Check if container is running
   docker ps | grep dax-issuer-web

   # Check port mapping
   docker port dax-issuer-web

   # Test local connection
   curl http://localhost:3030

   # Check container IP
   docker inspect dax-issuer-web | grep IPAddress
   ```

5. **Shell Compatibility Issues**

   ```bash
   # If sh deploy.sh fails, try:
   sh deploy.sh

   # Or make script executable and run directly:
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Performance Optimization

1. **Memory Management**

   ```bash
   # Check container memory usage
   docker stats --no-stream dax-issuer-web

   # If memory issues occur, restart container
   docker restart dax-issuer-web
   ```

2. **Build Performance**

   ```bash
   # Use Docker BuildKit for faster builds
   DOCKER_BUILDKIT=1 docker build -t dax-issuer-web .

   # Clean up build cache if builds are slow
   docker builder prune -f
   ```

3. **Network Issues**

   ```bash
   # Check container network
   docker network ls

   # Inspect container network settings
   docker inspect dax-issuer-web | grep -A 20 "NetworkSettings"
   ```

## 🔧 Development vs Production

### Development

For development with hot-reload:

```bash
# Run in development mode
npm run dev

# Or use development Docker setup if available
docker build -f Dockerfile.dev -t dax-issuer-web:dev .
docker run -d -p 3000:3000 -v $(pwd):/app dax-issuer-web:dev
```

### Production

For production deployment:

```bash
# Use the deployment script
sh deploy.sh

# Or manual production deployment
docker build -t dax-issuer-web:latest .
docker run -d -p 3030:3030 --name dax-issuer-web --restart unless-stopped dax-issuer-web:latest
```

## 📊 Monitoring and Observability

### Container Metrics

```bash
# Real-time stats
docker stats dax-issuer-web

# Resource usage snapshot
docker stats --no-stream dax-issuer-web

# Container processes
docker top dax-issuer-web
```

### Application Logs

```bash
# Tail logs with timestamps
docker logs -f -t dax-issuer-web

# Last 100 lines
docker logs --tail 100 dax-issuer-web

# Logs since specific time
docker logs --since="2024-10-24T00:00:00" dax-issuer-web
```

### Health Monitoring

```bash
# Check health status
docker inspect dax-issuer-web --format='{{.State.Health.Status}}'

# View health check history
docker inspect dax-issuer-web --format='{{range .State.Health.Log}}{{.Start}} - {{.Output}}{{end}}'

# Container uptime
docker inspect dax-issuer-web --format='{{.State.StartedAt}}'
```

## 🔐 Security Considerations

### Container Security

- Application runs as non-root user (`nextjs:nodejs`)
- Minimal Alpine Linux base image reduces attack surface
- Production-only dependencies minimize vulnerabilities
- Regular base image updates include security patches

### Network Security

- Only necessary port (3030) is exposed
- Container restart policy prevents service interruption
- No sensitive data in environment variables or logs

### Best Practices

```bash
# Regularly update base images
docker pull node:20-alpine

# Scan images for vulnerabilities (if available)
docker scan dax-issuer-web:latest

# Monitor container for suspicious activity
docker logs dax-issuer-web | grep -i error
```

### Environment-Specific Configurations

```bash
# Production environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3030

# Development environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
```

---

## 📝 Summary

## ✅ Quick Reference

### 🎯 Production Deployment Rules

| Rule                       | Description                                    | Why Important                        |
| -------------------------- | ---------------------------------------------- | ------------------------------------ |
| **� Main Branch Only**     | Deploy only from main branch                   | Ensure stable, tested code           |
| **🔒 Build Verification**  | Always verify build before stopping containers | Zero-downtime guarantee              |
| **🏷️ Semantic Versioning** | Use proper version tags for releases           | Version control, rollback capability |
| **🧹 Clean Environment**   | Remove old containers and images               | Maintain system performance          |
| **� Health Verification**  | Test application after deployment              | Ensure successful deployment         |
| **👥 Team Communication**  | Document and communicate deployments           | Coordination and awareness           |

### ⚡ Quick Commands Reference

```bash
# 🚀 Standard production deployment
git checkout main && git pull origin main
sh deploy.sh

# 🏷️ Tagged release deployment
git checkout main && git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
sh deploy.sh

# 🔍 Check deployment status
docker ps | grep dax-issuer-web
docker logs -f dax-issuer-web

# 🌐 Test application
curl http://localhost:3030

# 🛑 Stop application
docker stop dax-issuer-web && docker rm dax-issuer-web

# 🧹 Clean up resources
docker system prune -f
```

### 🌐 Production Environment

| Aspect        | Value                              | Description              |
| ------------- | ---------------------------------- | ------------------------ |
| **URL**       | http://localhost:3030              | Application access point |
| **Container** | `dax-issuer-web`                   | Docker container name    |
| **Image**     | `dax-issuer-web:latest`            | Docker image tag         |
| **Port**      | 3030                               | Application port         |
| **Logs**      | `docker logs dax-issuer-web`       | View application logs    |
| **Status**    | `docker ps \| grep dax-issuer-web` | Check container status   |

### 📚 Additional Resources

- [Git Workflow Guidelines](git-workflow-guidelines.md) - Branch management and workflow
- [Docker Documentation](https://docs.docker.com/) - Container management
- [Next.js Deployment](https://nextjs.org/docs/deployment) - Framework-specific deployment
- [Semantic Versioning](https://semver.org/) - Version numbering standards

---

> 🎉 **Remember**: Simple, consistent deployment practices ensure reliability and make troubleshooting easier. Always deploy from main branch and test thoroughly!
