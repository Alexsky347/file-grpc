#!/usr/bin/env bash

# Ensure vault data directory exists with correct permissions
VAULT_DATA_DIR="../vault/data"

if [ ! -d "$VAULT_DATA_DIR" ]; then
    echo "Creating Vault data directory..."
    mkdir -p "$VAULT_DATA_DIR"
fi

echo "Setting Vault directory permissions..."
# Use current user ownership instead of 777
sudo chown -R $(id -u):$(id -g) "$VAULT_DATA_DIR"
chmod -R 755 "$VAULT_DATA_DIR"

# Start services
echo "Starting Docker services..."
docker compose -f docker-compose.hashicorp.yml up -d --remove-orphans
docker compose -f docker-compose.keycloak.yml up -d --remove-orphans
docker compose -f docker-compose.minio.yml up -d --remove-orphans

echo "Development environment started!"


echo ""
echo "⏳ Waiting for containers to initialize..."
sleep 5

echo ""
echo "📊 Checking container status..."
echo ""

# Check Keycloak services (use service names from compose files)
if [ "$(docker compose -f docker-compose.keycloak.yml ps -q keycloak_web)" ]; then
    echo "✓ Keycloak container is running"
else
    echo "✗ Keycloak container failed to start"
fi

if [ "$(docker compose -f docker-compose.keycloak.yml ps -q keycloak_db)" ]; then
    echo "✓ PostgreSQL container is running"
else
    echo "✗ PostgreSQL container failed to start"
fi

# Check MinIO
if [ "$(docker compose -f docker-compose.minio.yml ps -q minio)" ]; then
    echo "✓ MinIO container is running"
else
    echo "✗ MinIO container failed to start"
fi

# Check Vault
if [ "$(docker compose -f docker-compose.hashicorp.yml ps -q vault)" ]; then
    echo "✓ Vault container is running"
else
    echo "✗ Vault container failed to start"
fi

## Health checks with retries
#echo ""
#echo "🏥 Performing health checks (this may take 30-60 seconds)..."
#echo ""
#
## Keycloak health check (can take 20-30 seconds to fully start)
#echo -n "Keycloak: "
#KEYCLOAK_READY=false
#for i in {1..30}; do
#    if curl -sf http://localhost:8080/health/ready > /dev/null 2>&1; then
#        echo "✓ Healthy (took $((i*2))s)"
#        KEYCLOAK_READY=true
#        break
#    elif [ $i -eq 30 ]; then
#        echo "✗ Not responding after 60s"
#        echo "  💡 Check logs: docker compose -f docker-compose.keycloak.yml logs keycloak_web"
#    else
#        echo -n "."
#        sleep 2
#    fi
#done
#
## MinIO health check (internal healthcheck on port 9000)
#echo -n "MinIO: "
#MINIO_READY=false
#for i in {1..10}; do
#    # Check MinIO health using the internal port (9000) which is exposed as 9010
#    if docker exec minio-server curl -sf http://localhost:9000/minio/health/live > /dev/null 2>&1; then
#        echo "✓ Healthy"
#        MINIO_READY=true
#        break
#    elif [ $i -eq 10 ]; then
#        echo "✗ Not responding"
#        echo "  💡 Check logs: docker compose -f docker-compose.minio.yml logs minio"
#    else
#        sleep 1
#    fi
#done
#
## Vault health check (sealed vault is normal on first start)
#echo -n "Vault: "
#VAULT_READY=false
#for i in {1..10}; do
#    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8200/v1/sys/health 2>/dev/null)
#    if [ ! -z "$status" ]; then
#        if [ "$status" = "200" ]; then
#            echo "✓ Healthy and unsealed"
#            VAULT_READY=true
#        elif [ "$status" = "503" ]; then
#            echo "⚠️  Running but sealed (expected on first start)"
#            VAULT_READY=true
#        elif [ "$status" = "501" ]; then
#            echo "⚠️  Running but not initialized"
#            VAULT_READY=true
#        else
#            echo "✓ Running (HTTP $status)"
#            VAULT_READY=true
#        fi
#        break
#    elif [ $i -eq 10 ]; then
#        echo "✗ Not responding"
#        echo "  💡 Check logs: docker compose -f docker-compose.hashicorp.yml logs vault"
#    else
#        sleep 1
#    fi
#done
#
#echo ""
#echo "=========================================="
#echo "🎯 Service Access URLs:"
#echo "=========================================="
#echo "  Keycloak:   http://localhost:8090"
#echo "              Login: admin/admin"
#echo ""
#echo "  MinIO:      http://localhost:9011 (Console)"
#echo "              http://localhost:9010 (API)"
#echo "              Login: minioadmin/minioadmin"
#echo ""
#echo "  Vault:      http://localhost:8200"
#echo "=========================================="
#echo ""
#
## Summary
#if [ "$KEYCLOAK_READY" = true ] && [ "$MINIO_READY" = true ] && [ "$VAULT_READY" = true ]; then
#    echo "✨ All services are healthy and ready!"
#else
#    echo "⚠️  Some services are not ready. Check the logs above for details."
#fi
#
#echo ""

