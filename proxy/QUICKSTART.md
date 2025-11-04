# Quick Start: Go Fiber Proxy with Cloudflare

This guide will help you quickly replace nginx with the Go Fiber reverse proxy for ShareHost.

## Prerequisites

- ✅ Docker and Docker Compose installed
- ✅ SSL certificates (for HTTPS)
- ✅ Domain pointing to your server via Cloudflare

## Option 1: Automated Setup (Recommended)

Run the setup script:

```bash
cd /root/zipline
sudo ./proxy/setup.sh
```

This will:
- Check prerequisites
- Stop and disable nginx (optional)
- Verify SSL certificates
- Build and start all services
- Show service status

## Option 2: Manual Setup

### 1. Stop nginx (if running)

```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
```

### 2. Add environment variables

Add to your `.env` file:

```env
DOMAIN=sharehost.me
HTTPS_ENABLED=true
```

### 3. Build and start services

```bash
cd /root/zipline
docker compose build
docker compose up -d
```

## Cloudflare Configuration

### DNS Settings

1. Go to Cloudflare Dashboard → DNS
2. Add/Update A record:
   - **Type**: A
   - **Name**: @ (or your subdomain)
   - **Content**: Your server IP
   - **Proxy status**: ✅ Proxied (orange cloud)
   - **TTL**: Auto

### SSL/TLS Settings

1. Go to SSL/TLS → Overview
2. Set encryption mode: **Full (strict)**

3. Go to SSL/TLS → Edge Certificates:
   - ✅ Always Use HTTPS: ON
   - ✅ Automatic HTTPS Rewrites: ON
   - ✅ Minimum TLS Version: TLS 1.2
   - ✅ TLS 1.3: ON

### Speed Optimization (Optional)

1. Go to Speed → Optimization:
   - ✅ Auto Minify: JS, CSS, HTML
   - ✅ Brotli: ON
   - ✅ Early Hints: ON

2. Go to Network:
   - ✅ HTTP/2: ON
   - ✅ HTTP/3 (with QUIC): ON
   - ✅ 0-RTT Connection Resumption: ON
   - ✅ WebSockets: ON

### Security (Optional)

1. Go to Security → Settings:
   - Security Level: Medium
   - Challenge Passage: 30 minutes

2. Go to Security → Bots:
   - Bot Fight Mode: ON

## Verify Installation

### 1. Check service status

```bash
docker compose ps
```

All services should show "healthy" status.

### 2. Test health endpoints

```bash
# Proxy health
curl http://localhost/proxy/health

# Backend health
curl http://localhost:3000/api/healthcheck
```

### 3. Test from external

```bash
# Should auto-redirect to HTTPS
curl -I http://sharehost.me

# Should return 200
curl -I https://sharehost.me
```

### 4. View logs

```bash
# All services
docker compose logs -f

# Proxy only
docker compose logs -f proxy

# Backend only
docker compose logs -f zipline
```

## Architecture

```
Internet
   ↓
Cloudflare CDN (Caching, DDoS Protection, SSL)
   ↓
Your Server
   ↓
Go Fiber Proxy (Port 80/443)
   ↓
ShareHost App (Port 3000)
   ↓
PostgreSQL Database (Port 5432)
```

## Port Mapping

| Service | Internal Port | External Port |
|---------|--------------|---------------|
| Proxy | 80, 443 | 80, 443 |
| ShareHost | 3000 | - (internal only) |
| PostgreSQL | 5432 | - (internal only) |

## Troubleshooting

### Port already in use

```bash
# Check what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Stop nginx if it's running
sudo systemctl stop nginx
```

### SSL certificate issues

```bash
# Verify certificate exists
ls -la /etc/nginx/ssl/

# Check certificate validity
openssl x509 -in /etc/nginx/ssl/sharehost.me.crt -text -noout
```

### Cloudflare shows 502 Bad Gateway

1. Check if proxy is running: `docker compose ps`
2. Check proxy logs: `docker compose logs proxy`
3. Verify backend is healthy: `curl http://localhost:3000/api/healthcheck`
4. Restart services: `docker compose restart`

### Real IP not showing correctly

The proxy automatically extracts real IPs from Cloudflare headers. Verify:

```bash
# Check proxy logs for CF-Connecting-IP
docker compose logs proxy | grep CF-Connecting-IP
```

## Performance Tips

1. **Enable Cloudflare caching** for static assets
2. **Use Cloudflare Page Rules** to cache everything on `/public/*`
3. **Enable Cloudflare Argo** for faster routing (paid)
4. **Monitor with Cloudflare Analytics**

## Security Tips

1. **Enable Cloudflare WAF** (Web Application Firewall)
2. **Use Cloudflare Rate Limiting** for additional protection
3. **Enable Cloudflare DDoS protection**
4. **Regularly update SSL certificates**
5. **Monitor proxy logs** for suspicious activity

## Reverting to nginx

If you need to go back to nginx:

```bash
# Stop proxy
docker compose stop proxy

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Remove proxy from docker-compose.yml (comment out proxy service)
```

## Next Steps

1. ✅ Configure Cloudflare settings (above)
2. ✅ Test your site: https://sharehost.me
3. ✅ Monitor logs for any issues
4. ✅ Set up monitoring/alerts
5. ✅ Configure backups

## Additional Resources

- [Go Fiber Documentation](https://docs.gofiber.io/)
- [Cloudflare SSL Docs](https://developers.cloudflare.com/ssl/)
- [ShareHost Documentation](../README.md)

## Support

If you encounter any issues:

1. Check logs: `docker compose logs -f`
2. Verify Cloudflare settings
3. Review the full README: `./proxy/README.md`
4. Open an issue on GitHub

---

**Congratulations!** Your ShareHost instance is now running with Go Fiber proxy and Cloudflare! 🎉
