# hashicorp

## Generate keys

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj "/CN=localhost"

docker-compose up -d

## Exec into the vault container

docker exec -it vault-new /bin/sh

## Once logged into the vault container

vault operator init

## Gradle

### Generate gRPC classes from proto files

To generate the gRPC service stubs and message classes (equivalent to `mvn compile`):

```bash
.\gradlew generateProto
```

### Compile Java source code

```bash
.\gradlew compileJava
```

### Full build

```bash
.\gradlew build
```

### List all available tasks

```bash
.\gradlew tasks
```
