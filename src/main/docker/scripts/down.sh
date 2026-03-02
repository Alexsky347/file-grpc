#!/usr/bin/env bash

echo "🛑 Stopping all services..."
echo ""

# Stop all services
docker compose -p doc-manager-keycloak -f docker-compose.keycloak.yml down
docker compose -p doc-manager-minio    -f docker-compose.minio.yml down
docker compose -p doc-manager-vault    -f docker-compose.hashicorp.yml down

echo ""
echo "✓ All services stopped"
echo ""
echo "💡 To remove volumes and data, run:"
echo "   docker compose -p doc-manager-keycloak -f docker-compose.keycloak.yml down -v"
echo "   docker compose -p doc-manager-minio    -f docker-compose.minio.yml down -v"
echo "   docker compose -p doc-manager-vault    -f docker-compose.hashicorp.yml down -v"
echo ""
