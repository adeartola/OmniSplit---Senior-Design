orderly-comms
=============
*Created by JORDAN BUSCHMAN, ANDRES DE ARTOLA, and ASHLEY SEHATTI (SCU Class of 2015).*

Communication server for the Orderly mobile ordering app.

## Database
Orderly uses MongoDB for login, receipts, and analytics. To develop locally, install MongoDB and create the following user:
```
user: "orderly_test",
pwd: "test",
roles: [{
    role: "readWrite",
    db: "orderly_db"
}]
```
The test database can be installed by going to <URL>/api/populate and pressing the "Reset" button.

## Nginx Setup
Orderly uses HTTPS site wide and redirects all requests from HTTP to HTTPS. This is handled with Nginx. The Nginx configuration we used is as follows:
```
server {
    listen 80;
    return 301 https://$host$request_uri;
}

server {
    listen       443 ssl;
    server_name  <SERVER_URL>;

    ssl on;
    ssl_certificate /path/to/orderly.crt;
    ssl_certificate_key /path/to/orderly.key;

    location / {
        proxy_pass http://<SERVER_URL>:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /public {
        root /path/to/bin/www;
    }

    location /socket.io/ {
        proxy_pass http://<SERVER_URL>:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```
