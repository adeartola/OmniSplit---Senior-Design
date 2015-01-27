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
Now, install the test database by (FIGURE THAT OUT LATER).
