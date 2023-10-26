#!/bin/bash

#GENERAL
NETWORK_NAME=drive-nt
DOMAIN=ledainalexis.com
EMAIL=ledain.alexis@gmail.com
PROTOCOL=http

#DB
DB_USER_USERNAME=admin
DB_USER_PASSWORD=admin
DB_CONTAINER_NAME=db
DB_NAME=drive-clone
DB_PORT=27017

#BACK
SERVER_PORT=8080
DRIVE_USER_USERNAME=alex6
DRIVE_USER_PWD=`openssl rand -hex 10`
# PWD=`openssl rand -hex 10`

#FRONT
FRONTEND_PORT=3000

#clear file
echo > .env
echo > frontend/.env

echo NETWORK_NAME=${NETWORK_NAME} >> .env
echo DOMAIN=${DOMAIN} >> .env
echo EMAIL=${EMAIL} >> .env


echo DB_USER_USERNAME=${DB_USER_USERNAME} >> .env
echo DB_USER_PASSWORD=${DB_USER_PASSWORD} >> .env
echo DB_NAME=${DB_NAME} >> .env
echo DB_PORT=${DB_PORT} >> .env
echo SERVER_PORT=${SERVER_PORT} >> .env
echo DRIVE_USER_USERNAME=${DRIVE_USER_USERNAME} >> .env
echo DRIVE_USER_PWD=${DRIVE_USER_PWD} >> .env

echo FRONTEND_PORT=${FRONTEND_PORT} >> .env

echo ALLOWED_HOST=${PROTOCOL}://${DOMAIN}:${FRONTEND_PORT} >> .env
echo MONGODB_URI=mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${DB_CONTAINER_NAME}:${DB_PORT} >> .env
echo REACT_APP_BACKEND_URL=http://localhost/api >> frontend/.env


# Phase 1
docker compose up -d frontend
docker compose up certbot
docker compose down
 
# # some configurations for let's encrypt
curl -L --create-dirs -o etc/letsencrypt/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
openssl dhparam -out etc/letsencrypt/ssl-dhparams.pem 2048
 
# # Phase 2
crontab ./etc/crontab
docker compose up -d
