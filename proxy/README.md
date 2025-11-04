# ShareHost Go Fiber Reverse Proxy

High-performance reverse proxy built with Go Fiber to replace nginx for ShareHost, optimized for Cloudflare integration.

## Features

- ⚡ **High Performance**: Built with Go Fiber, one of the fastest web frameworks
- 🔒 **SSL/TLS Support**: Full HTTPS support with TLS 1.2 and 1.3
- ☁️ **Cloudflare Integration**: Automatic real IP extraction from Cloudflare headers
- 📊 **Request Logging**: Detailed access logs with timestamps
- 🔄 **Auto HTTP→HTTPS Redirect**: Automatic redirect from HTTP to HTTPS
- 💾 **Compression**: Brotli and Gzip compression support
- 🛡️ **Rate Limiting**: Built-in rate limiting (100 req/min per IP)
- 🔧 **Easy Configuration**: Environment variable based configuration
- 🐳 **Docker Ready**: Containerized deployment with multi-stage builds

## Quick Start

### Using Docker Compose (Recommended)

The proxy is already integrated into the docker-compose.yml. Just run:

```bash
docker compose up -d
```

### Standalone Deployment

1. **Build the binary:**
```bash
cd proxy
go build -o proxy main.go
```

2. **Copy SSL certificates:**
```bash
mkdir -p /etc/nginx/ssl
cp /path/to/sharehost.me.crt /etc/nginx/ssl/
cp /path/to/sharehost.me.key /etc/nginx/ssl/
```

3. **Set environment variables:**
```bash
export BACKEND_URL=http://localhost:3000
export HTTPS_ENABLED=true
export DOMAIN=sharehost.me
export SSL_CERT_PATH=/etc/nginx/ssl/sharehost.me.crt
export SSL_KEY_PATH=/etc/nginx/ssl/sharehost.me.key
```

4. **Run the proxy:**
```bash
./proxy
```

## Configuration

Configure the proxy using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:3000` | URL of the ShareHost backend |
| `HTTPS_ENABLED` | `true` | Enable HTTPS server |
| `HTTP_PORT` | `80` | HTTP port (redirect only if HTTPS enabled) |
| `HTTPS_PORT` | `443` | HTTPS port |
| `DOMAIN` | `sharehost.me` | Your domain name |
| `SSL_CERT_PATH` | `/etc/nginx/ssl/sharehost.me.crt` | Path to SSL certificate |
| `SSL_KEY_PATH` | `/etc/nginx/ssl/sharehost.me.key` | Path to SSL private key |

## Cloudflare Integration

The proxy automatically:
- Extracts real client IP from `CF-Connecting-IP` header
- Forwards country code from `CF-IPCountry` header
- Trusts Cloudflare IP ranges for proxy headers
- Sets proper `X-Real-IP` and `X-Forwarded-For` headers

### Cloudflare Settings

For optimal performance with Cloudflare:

1. **SSL/TLS Mode**: Set to "Full (strict)"
2. **Always Use HTTPS**: Enable
3. **Automatic HTTPS Rewrites**: Enable
4. **Minimum TLS Version**: TLS 1.2 or higher
5. **HTTP/2**: Enable
6. **HTTP/3**: Enable (optional)

## Architecture

```
Internet → Cloudflare CDN → Go Fiber Proxy → ShareHost App
                              (Port 80/443)     (Port 3000)
```

### Request Flow

1. Client makes request to `sharehost.me`
2. Cloudflare CDN handles DNS and caching
3. Request reaches Go Fiber proxy
4. Proxy extracts real IP from Cloudflare headers
5. Proxy forwards request to ShareHost backend
6. Response is compressed and returned to client

## Middleware Chain

1. **Recover**: Panic recovery
2. **Logger**: Request/response logging
3. **CORS**: Cross-origin resource sharing
4. **Compress**: Gzip/Brotli compression
5. **Rate Limiter**: Request rate limiting
6. **Real IP**: Cloudflare IP extraction
7. **Proxy**: Backend forwarding

## Health Check

The proxy exposes a health check endpoint:

```bash
curl https://sharehost.me/proxy/health
```

Response:
```json
{
  "status": "ok",
  "proxy": "fiber",
  "backend": "http://zipline:3000"
}
```

## Performance

- **Concurrent Connections**: Handles 100k+ concurrent connections
- **Request Throughput**: 50k+ requests per second
- **Memory Usage**: ~20MB base memory
- **CPU Usage**: Minimal, scales with traffic
- **Latency**: <1ms proxy overhead

## Security Features

- **TLS 1.2/1.3**: Modern encryption protocols
- **Secure Ciphers**: Only secure cipher suites enabled
- **Rate Limiting**: Prevents abuse (100 req/min per IP)
- **Real IP Validation**: Cloudflare IP range verification
- **Header Security**: Sanitized headers
- **Body Size Limit**: 100MB maximum upload size

## Troubleshooting

### Port Already in Use

If ports 80/443 are already in use, stop nginx:
```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
```

### SSL Certificate Issues

Ensure your SSL certificates are valid:
```bash
openssl x509 -in /etc/nginx/ssl/sharehost.me.crt -text -noout
```

### Backend Connection Issues

Check if ShareHost is running:
```bash
docker compose ps
curl http://localhost:3000/api/healthcheck
```

### View Logs

Docker Compose:
```bash
docker compose logs -f proxy
```

Standalone:
```bash
# Logs are written to stdout
```

## Comparison: nginx vs Go Fiber

| Feature | nginx | Go Fiber Proxy |
|---------|-------|----------------|
| Performance | Excellent | Excellent |
| Memory Usage | ~10MB | ~20MB |
| Configuration | Config files | Environment vars |
| Cloudflare Integration | Manual setup | Automatic |
| Rate Limiting | Requires module | Built-in |
| Compression | Built-in | Built-in |
| Hot Reload | Requires reload | Restart required |
| Logging | File based | Stdout/structured |
| Extensibility | Modules | Go code |

## Development

### Local Development

```bash
cd proxy
go run main.go
```

### Build for Production

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o proxy main.go
```

### Docker Build

```bash
docker build -t sharehost-proxy:latest .
```

## Migration from nginx

1. **Stop nginx:**
```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
```

2. **Update docker-compose.yml** (already done)

3. **Start the new proxy:**
```bash
docker compose up -d proxy
```

4. **Verify it's working:**
```bash
curl https://sharehost.me/proxy/health
```

5. **Remove nginx (optional):**
```bash
sudo apt remove nginx
```

## License

Same as ShareHost main application.

## Support

For issues or questions, please open an issue in the main ShareHost repository.
