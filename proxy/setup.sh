#!/bin/bash

# ShareHost Go Fiber Proxy Setup Script
# This script helps migrate from nginx to Go Fiber proxy

set -e

echo "=================================================="
echo "  ShareHost - Go Fiber Proxy Setup"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"

# Check if nginx is running
echo -e "${YELLOW}Step 2: Checking nginx status...${NC}"

if systemctl is-active --quiet nginx; then
    echo -e "${YELLOW}nginx is currently running${NC}"
    read -p "Do you want to stop and disable nginx? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Stopping nginx..."
        systemctl stop nginx
        systemctl disable nginx
        echo -e "${GREEN}✓ nginx stopped and disabled${NC}"
    else
        echo -e "${YELLOW}Warning: nginx is still running. Make sure ports 80 and 443 are available.${NC}"
    fi
else
    echo -e "${GREEN}✓ nginx is not running${NC}"
fi

# Check if SSL certificates exist
echo -e "${YELLOW}Step 3: Checking SSL certificates...${NC}"

SSL_CERT="/etc/nginx/ssl/sharehost.me.crt"
SSL_KEY="/etc/nginx/ssl/sharehost.me.key"

if [ -f "$SSL_CERT" ] && [ -f "$SSL_KEY" ]; then
    echo -e "${GREEN}✓ SSL certificates found${NC}"
else
    echo -e "${RED}SSL certificates not found at:${NC}"
    echo "  Certificate: $SSL_CERT"
    echo "  Key: $SSL_KEY"
    echo ""
    read -p "Do you want to continue without SSL (HTTP only)? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please place your SSL certificates in /etc/nginx/ssl/"
        exit 1
    fi
    export HTTPS_ENABLED=false
fi

# Check if .env file exists
echo -e "${YELLOW}Step 4: Checking environment configuration...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}No .env file found. Creating from example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env from .env.example${NC}"
        echo -e "${YELLOW}Please edit .env file with your configuration${NC}"
        exit 0
    else
        echo -e "${RED}.env.example not found${NC}"
        exit 1
    fi
fi

# Add proxy environment variables to .env if not present
if ! grep -q "DOMAIN=" .env; then
    echo "" >> .env
    echo "# Proxy Configuration" >> .env
    echo "DOMAIN=sharehost.me" >> .env
    echo "HTTPS_ENABLED=true" >> .env
    echo -e "${GREEN}✓ Added proxy configuration to .env${NC}"
fi

# Build and start services
echo -e "${YELLOW}Step 5: Building and starting services...${NC}"

echo "Building Docker images..."
docker compose build

echo "Starting services..."
docker compose up -d

echo ""
echo -e "${GREEN}=================================================="
echo "  Setup Complete!"
echo "==================================================${NC}"
echo ""
echo "Services Status:"
docker compose ps
echo ""
echo "Useful Commands:"
echo "  View logs:        docker compose logs -f"
echo "  View proxy logs:  docker compose logs -f proxy"
echo "  Stop services:    docker compose down"
echo "  Restart proxy:    docker compose restart proxy"
echo ""
echo "Health Checks:"
echo "  Proxy health:     curl http://localhost/proxy/health"
echo "  Backend health:   curl http://localhost:3000/api/healthcheck"
echo ""
echo -e "${GREEN}Your ShareHost instance should now be running with Go Fiber proxy!${NC}"

# Optional: Remove nginx
echo ""
read -p "Do you want to completely remove nginx? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing nginx..."
    apt remove -y nginx nginx-common
    echo -e "${GREEN}✓ nginx removed${NC}"
fi

echo ""
echo -e "${GREEN}Setup completed successfully!${NC}"
