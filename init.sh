#!/bin/bash

#GENERAL
NETWORK_NAME=drive-nt
DOMAIN=ledainalexis.com
EMAIL=ledain.alexis@gmail.com
PROTOCOL=http

#DB
MONGO_DB_PASSWORD=`openssl rand 30 | base64 -w 0`
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=`openssl rand 30 | base64 -w 0`
DB_CONTAINER_NAME=db
DB_NAME=drive-clone
DB_PORT=27019

#BACK
SERVER_PORT=8080
USERNAME=alex6
PWD=`openssl rand 30 | base64 -w 0`

#FRONT
FRONTEND_PORT=3000



echo NETWORK_NAME=${NETWORK_NAME} >> .env
echo DOMAIN=${DOMAIN} >> .env
echo EMAIL=${EMAIL} >> .env


echo MONGO_DB_PASSWORD=${MONGO_DB_PASSWORD} >> .env
echo MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME} >> .env
echo MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD} >> .env
echo DB_NAME=${DB_NAME} >> .env
echo USERNAME=${USERNAME} >> .env
echo PWD=${PWD} >> .env

echo ALLOWED_HOST=${PROTOCOL}://${DOMAIN}:${FRONTEND_PORT} >> .env
echo MONGODB_URI=mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${DB_CONTAINER_NAME}:${DB_PORT} >> .env
echo REACT_APP_BACKEND_URL=${PROTOCOL}://${DOMAIN}:${SERVER_PORT}/api >> .env


# Phase 1
# docker compose up -d frontend
# docker compose up certbot
# docker compose down
 
# # some configurations for let's encrypt
# curl -L --create-dirs -o etc/letsencrypt/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
# openssl dhparam -out etc/letsencrypt/ssl-dhparams.pem 2048
 
# # Phase 2
# crontab ./etc/crontab
# docker compose -d up
