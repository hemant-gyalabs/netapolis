# Neopolis Dashboard Deployment Guide

This guide provides step-by-step instructions for deploying the Neopolis Dashboard application.

## Prerequisites

- Node.js 16.x or later
- npm 8.x or later
- Nginx web server
- Ubuntu 20.04 LTS or later
- A domain name (for production deployment)
- SSL certificate (for production deployment)

## Deployment Options

### 1. Automated Deployment

The easiest way to deploy is using the provided deployment script:

```bash
# Make the script executable
chmod +x deploy.sh

# Deploy to production
sudo ./deploy.sh production

# Or deploy to staging
sudo ./deploy.sh staging
```

### 2. Manual Deployment

If you prefer to deploy manually, follow these steps:

#### Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

#### Configure Nginx

1. Copy the provided Nginx configuration file:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/dashboard.neopolisinfra.com
```

2. Create a symbolic link to enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/dashboard.neopolisinfra.com /etc/nginx/sites-enabled/
```

3. Test the Nginx configuration:

```bash
sudo nginx -t
```

4. Restart Nginx:

```bash
sudo systemctl restart nginx
```

#### Deploy the Application

1. Create the deployment directory:

```bash
sudo mkdir -p /var/www/neopolisinfra.com/dashboard
```

2. Copy the build files:

```bash
sudo cp -r build/* /var/www/neopolisinfra.com/dashboard/
```

3. Set appropriate permissions:

```bash
sudo chown -R www-data:www-data /var/www/neopolisinfra.com/dashboard
sudo chmod -R 755 /var/www/neopolisinfra.com/dashboard
```

## SSL Certificate Setup

For a production environment, you'll need to set up SSL certificates. The recommended approach is using Let's Encrypt:

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d dashboard.neopolisinfra.com
```

Follow the prompts to complete the certificate setup. Certbot will automatically update the Nginx configuration.

## Environment Configuration

The application uses environment-specific configuration. You can modify these settings in the `deploy-config.json` file:

- `development`: For local development
- `staging`: For testing environment
- `production`: For live environment

Ensure the API URLs and other settings are correctly configured for your environment.

## Continuous Integration/Continuous Deployment (CI/CD)

For automated deployments, consider setting up a CI/CD pipeline using GitHub Actions or similar tools. A basic GitHub workflow file is provided in `.github/workflows/deploy.yml`.

## Testing the Deployment

After deployment, verify that everything is working correctly:

1. Visit the dashboard URL in a browser
2. Check for any console errors
3. Test the integration with other systems
4. Verify all features are functioning correctly

## Backup and Restore

The deployment script automatically creates backups before each deployment. To restore from a backup:

```bash
# List available backups
ls -la /var/www/backups/dashboard/

# Extract a backup
sudo tar -xzf /var/www/backups/dashboard/dashboard_backup_TIMESTAMP.tar.gz -C /tmp/

# Restore from the backup
sudo cp -r /tmp/var/www/neopolisinfra.com/dashboard/* /var/www/neopolisinfra.com/dashboard/
```

## Troubleshooting

### Common Issues

1. **404 errors for routes**: Make sure the Nginx configuration correctly handles React Router paths
2. **API connection failed**: Check the API URL configuration in `deploy-config.json`
3. **Permission issues**: Verify the file permissions and ownership
4. **SSL certificate errors**: Ensure the certificate is properly installed and not expired

### Logs

Check the following logs for troubleshooting:

```bash
# Nginx error logs
sudo tail -f /var/nginx/error.log

# Application logs (if configured)
sudo tail -f /var/log/neopolis/dashboard.log
```

## Security Considerations

1. **Access Control**: The dashboard should only be accessible to authorized users
2. **API Keys**: Ensure all API keys are kept secure and not exposed in client-side code
3. **Regular Updates**: Keep all dependencies updated to address security vulnerabilities
4. **Firewall**: Configure a firewall to restrict access to necessary ports only
5. **SSL**: Always use HTTPS for production deployments

## Additional Configuration

### Apache (Alternative to Nginx)

If you're using Apache instead of Nginx, a `.htaccess` file is provided in the `public` directory. Ensure that `mod_rewrite` is enabled:

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### Reverse Proxy Configuration

If your API is on a different server, make sure the reverse proxy settings in Nginx are correctly configured to forward requests to the API server.

## Support

For additional support or questions, contact the development team or refer to the internal documentation.