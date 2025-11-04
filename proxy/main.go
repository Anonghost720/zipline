package main

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

// Cloudflare IP ranges for real IP extraction
var cloudflareIPRanges = []string{
	"103.21.244.0/22",
	"103.22.200.0/22",
	"103.31.4.0/22",
	"104.16.0.0/13",
	"104.24.0.0/14",
	"108.162.192.0/18",
	"131.0.72.0/22",
	"141.101.64.0/18",
	"162.158.0.0/15",
	"172.64.0.0/13",
	"173.245.48.0/20",
	"188.114.96.0/20",
	"190.93.240.0/20",
	"197.234.240.0/22",
	"198.41.128.0/17",
	"2400:cb00::/32",
	"2606:4700::/32",
	"2803:f800::/32",
	"2405:b500::/32",
	"2405:8100::/32",
	"2a06:98c0::/29",
	"2c0f:f248::/32",
}

func main() {
	// Get configuration from environment
	backendURL := getEnv("BACKEND_URL", "http://localhost:3000")
	httpsEnabled := getEnv("HTTPS_ENABLED", "true") == "true"
	httpPort := getEnv("HTTP_PORT", "80")
	httpsPort := getEnv("HTTPS_PORT", "443")
	sslCertPath := getEnv("SSL_CERT_PATH", "/etc/nginx/ssl/sharehost.me.crt")
	sslKeyPath := getEnv("SSL_KEY_PATH", "/etc/nginx/ssl/sharehost.me.key")
	domain := getEnv("DOMAIN", "sharehost.me")

	// Create Fiber app with custom config
	app := fiber.New(fiber.Config{
		ServerHeader:          "ShareHost",
		AppName:               "ShareHost Proxy v1.0.0",
		DisableStartupMessage: false,
		BodyLimit:             100 * 1024 * 1024, // 100MB max body size
		ReadTimeout:           60 * time.Second,
		WriteTimeout:          60 * time.Second,
		IdleTimeout:           120 * time.Second,
		ProxyHeader:           fiber.HeaderXForwardedFor,
		EnableTrustedProxyCheck: true,
		TrustedProxies:        cloudflareIPRanges,
	})

	// Middleware setup
	app.Use(recover.New())

	// Logger middleware
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${method} ${path} - ${ip} - ${latency}\n",
		TimeFormat: "2006-01-02 15:04:05",
		TimeZone: "UTC",
	}))

	// CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization,X-Requested-With",
	}))

	// Compression middleware
	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))

	// Rate limiting middleware - DISABLED
	// app.Use(limiter.New(limiter.Config{
	// 	Max:        100,
	// 	Expiration: 1 * time.Minute,
	// 	KeyGenerator: func(c *fiber.Ctx) string {
	// 		return c.IP()
	// 	},
	// 	LimitReached: func(c *fiber.Ctx) error {
	// 		return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
	// 			"error": "Too many requests",
	// 		})
	// 	},
	// }))

	// Extract real IP from Cloudflare headers
	app.Use(func(c *fiber.Ctx) error {
		// Check for Cloudflare headers
		if cfIP := c.Get("CF-Connecting-IP"); cfIP != "" {
			c.Request().Header.Set("X-Real-IP", cfIP)
			c.Request().Header.Set("X-Forwarded-For", cfIP)
		}

		// Set other Cloudflare headers
		if cfCountry := c.Get("CF-IPCountry"); cfCountry != "" {
			c.Request().Header.Set("X-Country-Code", cfCountry)
		}

		return c.Next()
	})

	// Health check endpoint
	app.Get("/proxy/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"proxy": "fiber",
			"backend": backendURL,
		})
	})

	// Proxy all requests to backend
	app.Use(func(c *fiber.Ctx) error {
		url := backendURL + c.OriginalURL()

		// Preserve the original Host header for proper URL generation
		originalHost := string(c.Request().Host())

		// Set X-Forwarded headers BEFORE proxying
		c.Request().Header.Set("X-Forwarded-Host", originalHost)
		c.Request().Header.Set("X-Forwarded-Proto", c.Protocol())
		c.Request().Header.Set("X-Forwarded-For", c.IP())

		// Forward request to backend
		if err := proxy.Do(c, url); err != nil {
			log.Printf("Proxy error: %v", err)
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
				"error": "Backend service unavailable",
			})
		}

		// Modify response headers
		c.Response().Header.Del(fiber.HeaderServer)
		c.Response().Header.Set(fiber.HeaderServer, "ShareHost")

		return nil
	})

	// Start HTTP server (for redirect or standalone)
	if httpsEnabled {
		// Start HTTP redirect server
		go func() {
			httpApp := fiber.New(fiber.Config{
				DisableStartupMessage: true,
			})

			httpApp.Use(func(c *fiber.Ctx) error {
				return c.Redirect("https://"+domain+c.OriginalURL(), fiber.StatusMovedPermanently)
			})

			log.Printf("Starting HTTP redirect server on port %s", httpPort)
			if err := httpApp.Listen(":" + httpPort); err != nil {
				log.Fatalf("Failed to start HTTP server: %v", err)
			}
		}()

		// Start HTTPS server
		log.Printf("Starting HTTPS server on port %s", httpsPort)
		log.Printf("Proxying to backend: %s", backendURL)
		log.Printf("Domain: %s", domain)
		log.Printf("SSL Certificate: %s", sslCertPath)
		log.Printf("SSL Key: %s", sslKeyPath)

		if err := app.ListenTLS(":"+httpsPort, sslCertPath, sslKeyPath); err != nil {
			log.Fatalf("Failed to start HTTPS server: %v", err)
		}
	} else {
		// Start HTTP only server
		log.Printf("Starting HTTP server on port %s", httpPort)
		log.Printf("Proxying to backend: %s", backendURL)

		if err := app.Listen(":" + httpPort); err != nil {
			log.Fatalf("Failed to start HTTP server: %v", err)
		}
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return strings.TrimSpace(value)
	}
	return defaultValue
}
