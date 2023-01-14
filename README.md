# REST API for ERP.AERO
Rest api with bearer token, with express and mysql
## Endpoints
- _/signin_ [POST] - request bearer and refresh token by id and password;
- _/signin/new_token_ [POST] - refreshing bearer token by refresh token;
- _/signup_ [POST] - new user registration;
- _/file/upload_ [POST] - adding a new file to the system and recording
                        file parameters to the database
- _/file/list_ [GET] - displays a list of files and their parameters from the database with
                    using pagination;
- _/file/delete/:id_ [DELETE] - deletes document from database and local
                              storage;
- _/file/:id_ [GET] - displaying information about the selected file;
- _/file/download/:id_ [GET] - download the selected file;
- _/file/update/:id_ [PUT] - updating the current document to a new in the database and
                             local storage;
- _/info_ [GET]  - display user id;
- _/logout_ [GET]  - logout from system  update tokens;
## Default config
```
{
   "DB_CONFIG": {
     "host": HOST || LOCALHOST,
     "port": PORT,
     "password": PASSWORD,
     "username": USERNAME,
     "baseName": DATABASE_NAME,
     "dialect": "mysql"
   },
   "JWT_SECRET": "very secret string",
   "JWT_REFRESH_SECRET": "very secret refresh string"
 }
```
## Work flow
### Token: 
Bearer token is passed in the “Authorization” field in the Header:
### Refresh Token:
Refresh token is automatically recorded in the “refresh_token” field in Cookies, and is also transmitted to the client side
