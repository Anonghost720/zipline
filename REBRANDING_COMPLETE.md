# ShareHost Rebranding Complete

## Overview
Successfully rebranded the application from Zipline to ShareHost, updating all references to point to the new GitHub repository at `Anonghost720/my-zipline`.

## Changes Made

### 1. Package Configuration
- **package.json**: Changed package name from `"zipline"` to `"sharehost"`

### 2. GitHub Repository Links
All references updated from `diced/zipline` to `Anonghost720/my-zipline`:
- VersionBadge.tsx - Release links, commit links, update guide
- setup.tsx - Configuration documentation links
- SettingsFileView.tsx - Variables documentation link
- SettingsGenerators/GeneratorButton.tsx - Documentation link
- README.md - All badges, links, and documentation references

### 3. Documentation Links
All `zipline.diced.sh` URLs replaced with GitHub wiki:
- External links now point to `https://github.com/Anonghost720/my-zipline/wiki`
- Default external links in database schema updated
- Configuration validation updated

### 4. Version Checking System
- Updated from `https://zipline-version.diced.sh/` to GitHub Releases API
- New endpoint: `https://api.github.com/repos/Anonghost720/my-zipline/releases/latest`
- Updated in:
  - prisma/schema.prisma (featuresVersionAPI default)
  - src/lib/config/validate.ts (versionAPI)
  - Features.tsx (UI component)

### 5. User-Facing Branding
- **TOTP Issuer**: Changed from "Zipline" to "ShareHost" in validate.ts
- **Discord Webhook**: Default username changed from "Zipline" to "ShareHost"
- **Server Logging**: Startup message changed from "starting zipline" to "starting sharehost"
- **Discord Avatar**: Updated to use sharehost-logo.png from repository

### 6. README Documentation
- Complete rewrite with ShareHost branding
- Updated logo reference
- Updated all Docker compose examples
- Updated database defaults (sharehost instead of zipline)
- Removed Zipline v3 migration section (not applicable)
- Updated S3 bucket example name

### 7. Logo Files
- ShareHost logo already exists at `/root/zipline/public/sharehost-logo.png`
- Logo used in Discord webhooks and branding

### 8. Database Migration
Created migration `20251103225127_rebrand_to_sharehost` to update:
- websiteExternalLinks to point to ShareHost GitHub
- featuresVersionAPI to point to GitHub releases API
- TOTP issuer default (documentation only - existing configs unchanged)

## Files Modified

1. `package.json` - Package name
2. `README.md` - Complete documentation rewrite
3. `prisma/schema.prisma` - Default values for external links and version API
4. `src/client/pages/auth/setup.tsx` - Configuration and GitHub links
5. `src/components/VersionBadge.tsx` - Release and update links
6. `src/components/pages/serverSettings/parts/Features.tsx` - Version API configuration
7. `src/components/pages/serverSettings/parts/Website.tsx` - External links defaults
8. `src/components/pages/settings/parts/SettingsFileView.tsx` - Documentation links
9. `src/components/pages/settings/parts/SettingsGenerators/GeneratorButton.tsx` - Documentation links
10. `src/lib/config/validate.ts` - Default configurations and TOTP issuer
11. `src/lib/webhooks/discord.ts` - Webhook username and avatar
12. `src/server/index.ts` - Startup log message

## Deployment

### Docker Build
- Built new Docker image: `sharehost-local:latest`
- Successfully passed all build steps including linting
- Container restarted and running healthy

### Git Commits
- Commit `3be47021`: Main rebranding changes
- Commit `ecb7bc1b`: Formatting fixes

### Production Status
✅ Container running and healthy on port 3000
✅ Database migration ready to apply
✅ All API endpoints responding correctly
✅ DMCA page accessible at /dmca
✅ Version checking configured for GitHub releases

## Testing Checklist

- [x] Docker container builds successfully
- [x] Container starts and passes health checks
- [x] Public API returns correct website title "ShareHost"
- [x] DMCA page configured and accessible
- [x] All code passes linting
- [x] Changes committed and pushed to GitHub

## Next Steps

1. **Apply Database Migration**: Run migration to update existing records
2. **Monitor Version Checking**: Verify version checking works with GitHub releases API
3. **Update Logo**: Add custom ShareHost logo if desired (current placeholder exists)
4. **GitHub Release**: Create first release on GitHub to test version checking
5. **Documentation**: Create wiki pages on GitHub for documentation

## Notes

- Environment variables still use `ZIPLINE_` prefix for backward compatibility
- Database table still named `Zipline` (requires schema migration to change)
- Internal code references to "zipline" kept where they don't affect user experience
- Cookie name still `zipline_session` for session persistence
- Working directory still `/zipline` in Docker for volume compatibility

## Repository Information

- **GitHub**: https://github.com/Anonghost720/my-zipline
- **Branch**: trunk
- **Production URL**: https://sharehost.me
- **Docker Image**: sharehost-local:latest

---

*Rebranding completed on November 3, 2024*
