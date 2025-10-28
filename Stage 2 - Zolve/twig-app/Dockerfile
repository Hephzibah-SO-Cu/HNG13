# Use official PHP Apache image
FROM php:8.2-apache

# Install necessary extensions (if you ever need more, add here)
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy all files to web root
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html/

# Expose default HTTP port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
