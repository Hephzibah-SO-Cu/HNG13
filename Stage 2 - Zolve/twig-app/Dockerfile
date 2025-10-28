# Stage 0: base php + apache
FROM php:8.2-apache AS base

# Install system deps we need for building extensions and composer packages
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo pdo_mysql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache rewrite (for pretty URLs if needed)
RUN a2enmod rewrite

# Copy composer (multi-stage from official composer image)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy only composer files first so layer caching can help builds
COPY composer.json composer.lock ./

# Install PHP dependencies (run in this layer so vendor is created here)
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-progress || composer install --no-interaction

# Now copy the rest of the app
COPY . .

# Ensure autoload is optimized (safe to run again after copy)
RUN composer dump-autoload --optimize

# Fix permissions for runtime (simple, for Render)
RUN chown -R www-data:www-data /var/www/html || true

EXPOSE 80
CMD ["apache2-foreground"]
