#!/usr/bin/env bash

echo "📊 Service Status Check"
echo "=========================================="
echo ""

# Check Docker daemon
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    exit 1
fi

echo "Container Status:"
echo ""

# Check each service
KEYCLOAK_STATUS=$(docker inspect -f '{{.State.Status}}' keycloak_web 2>/dev/null || echo "not found")
POSTGRES_STATUS=$(docker inspect -f '{{.State.Status}}' docker-keycloak_db-1 2>/dev/null || echo "not found")
MINIO_STATUS=$(docker inspect -f '{{.State.Status}}' minio-server 2>/dev/null || echo "not found")
VAULT_STATUS=$(docker inspect -f '{{.State.Status}}' vault-service 2>/dev/null || echo "not found")

# Display status with icons
if [ "$KEYCLOAK_STATUS" = "running" ]; then
    echo "✓ Keycloak:   Running"
else
    echo "✗ Keycloak:   $KEYCLOAK_STATUS"
fi

if [ "$POSTGRES_STATUS" = "running" ]; then
    echo "✓ PostgreSQL: Running"
else
    echo "✗ PostgreSQL: $POSTGRES_STATUS"
fi

if [ "$MINIO_STATUS" = "running" ]; then
    echo "✓ MinIO:      Running"
else
    echo "✗ MinIO:      $MINIO_STATUS"
fi

if [ "$VAULT_STATUS" = "running" ]; then
    echo "✓ Vault:      Running"
else
    echo "✗ Vault:      $VAULT_STATUS"
fi

echo ""
echo "Health Status:"
echo ""

# Check health endpoints
if curl -sf http://localhost:8090/health/ready > /dev/null 2>&1; then
    echo "✓ Keycloak:   Healthy"
else
    echo "✗ Keycloak:   Not responding"
fi

if docker exec minio-server curl -sf http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    echo "✓ MinIO:      Healthy"
else
    echo "✗ MinIO:      Not responding"
fi

VAULT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8200/v1/sys/health 2>/dev/null)
if [ "$VAULT_STATUS" = "200" ]; then
    echo "✓ Vault:      Healthy (unsealed)"
elif [ "$VAULT_STATUS" = "503" ]; then
    echo "⚠️  Vault:      Sealed"
elif [ "$VAULT_STATUS" = "501" ]; then
    echo "⚠️  Vault:      Not initialized"
elif [ ! -z "$VAULT_STATUS" ]; then
    echo "✓ Vault:      Running (HTTP $VAULT_STATUS)"
else
    echo "✗ Vault:      Not responding"
fi

echo ""
echo "=========================================="
echo "Service URLs:"
echo "  Keycloak:  http://localhost:8090"
echo "  MinIO:     http://localhost:9011"
echo "  Vault:     http://localhost:8200"
echo "=========================================="

