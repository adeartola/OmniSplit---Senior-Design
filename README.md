OmniSplit
=========
*Created by JORDAN BUSCHMAN, ANDRES DE ARTOLA, and ASHLEY SEHATTI (SCU Class of 2015).*

Server for the OmniSplit mobile ordering app and web app.

## Database
OmniSplit uses MongoDB for login, receipts, and analytics. To develop locally, install MongoDB and create the following user:
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
OmniSplit uses HTTPS site wide and redirects all requests from HTTP to HTTPS. This is handled with Nginx. The Nginx configuration we used is as follows:
```
server {
    listen 80;
    return 301 https://$host$request_uri;
}

server {
    listen       443 ssl;
    server_name  <SERVER_URL>;

    ssl on;

    ssl_ciphers "AES128+EECDH:AES128+EDH";
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; prelo    ad";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    ssl_stapling on; # Requires nginx >= 1.3.7
    ssl_stapling_verify on; # Requires nginx => 1.3.7

    ssl_certificate /path/to/omnisplit.ca-bundle;
    ssl_certificate_key /path/to/omnisplit.key;

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

## Socket.io events
OmniSplit uses socket.io to handle events and synchronization between different iOS clients. The events that are emitted by / used by the client are as follows:

**'create or join'** (SEND *roomName, callback(err, newroom)*): Client sends a string roomName to the server. On receiving the event, the server will either (1) create a new ordering group with the name roomName and add the client to it, or (2) add the client to the existing ordering group with name roomName. On completion, the new room is passed in the callback.

**'leave room'** (SEND *callback(err)*): Client sends this message if they want to voluntarily leave the ordering group.

**'update people'** (RECEIVE *newPeople*): Received by the client when the list of people in their ordering group is updated. The new list of people is newPeople.

**'update order'** (RECEIVE *newOrder*): Received by the client when the list of orders in their ordering group is updated. The new list of orders is newOrder.

## API Functions
**/api/restaurants** (GET): Get all restaurants listed

**/api/restaurant/:id** (GET): Get restaurant with a certain ID

**/api/menu/:id** (GET): Get a specific restaurant location 

**/api/loggedin** (GET, POST): Returns 1 if a user is logged in, 0 if not

**/api/login** (POST *email, password*): Check and authenticate a user NOT DONE YET, SEE TODO MESSAGE

**/api/logout** (POST): If logged in, log a user out

**/api/register** (POST *email, password*): Add person to users
