# My Zipline Deployment

This is my personal Zipline instance deployment.

## Server Information

- **Server IP**: 147.93.180.184
- **Access URL**: http://147.93.180.184:3000
- **Deployed**: October 16, 2025

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- `.env` file configured (see `.env.example` for reference)

### Environment Setup

Create a `.env` file with the following required variables:

```bash
# Generate with: openssl rand -base64 42 | tr -dc A-Za-z0-9 | cut -c -32
POSTGRESQL_PASSWORD=your_secure_password_here
CORE_SECRET=your_core_secret_here

# Database configuration
POSTGRESQL_USER=zipline
POSTGRESQL_DB=zipline

# Optional: Customize port and hostname
# CORE_PORT=3000
# CORE_HOSTNAME=0.0.0.0
```

### Generate Secrets

```bash
echo "POSTGRESQL_PASSWORD=$(openssl rand -base64 42 | tr -dc A-Za-z0-9 | cut -c -32 | tr -d '\n')" > .env
echo "CORE_SECRET=$(openssl rand -base64 42 | tr -dc A-Za-z0-9 | cut -c -32 | tr -d '\n')" >> .env
```

### Deploy

```bash
# Create required directories
mkdir -p uploads public themes

# Start services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

## Management Commands

### View Logs
```bash
docker compose logs -f zipline      # Zipline logs
docker compose logs -f postgresql   # Database logs
```

### Restart Services
```bash
docker compose restart
```

### Stop Services
```bash
docker compose down
```

### Update to Latest Version
```bash
docker compose pull
docker compose up -d
```

### Backup Database
```bash
docker exec zipline-postgresql-1 pg_dump -U zipline zipline > backup-$(date +%Y%m%d).sql
```

### Restore Database
```bash
cat backup.sql | docker exec -i zipline-postgresql-1 psql -U zipline zipline
```

## Security Notes

⚠️ **IMPORTANT**: Never commit the `.env` file to Git! It contains sensitive secrets.

- The `.env` file is already excluded in `.gitignore`
- Keep backups of your `.env` file in a secure location
- For production, use a reverse proxy with SSL/TLS (Nginx, Caddy, Traefik)
- Consider using a firewall to restrict access

## Repository Structure

```
.
├── docker-compose.yml    # Docker services configuration
├── .env                  # Environment variables (NOT in Git)
├── uploads/              # Uploaded files (NOT in Git)
├── public/               # Public assets
├── themes/               # Custom themes
└── DEPLOYMENT.md         # This file
```

## Links

- **Original Zipline Project**: https://github.com/diced/zipline
- **Documentation**: https://zipline.diced.sh
- **Discord Community**: https://discord.gg/EAhCRfGxCF

## Notes

This is a private fork of Zipline for personal deployment. All credit for the Zipline application goes to the original developers.
