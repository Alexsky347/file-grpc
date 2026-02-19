# gRPC File Management Backend

A Java/Quarkus backend for secure file management using gRPC and MinIO. Supports file upload, download, listing, search, filtering, pagination, and statistics. Designed for integration with modern web or mobile frontends.

## Features
- User-based file storage (MinIO/S3 compatible)
- gRPC API for file operations:
  - Upload, download, delete, rename
  - List files with search, filter, pagination, and cursor
  - File statistics (counts by type, search-aware)
- Docker Compose for local development (MinIO, Keycloak, Vault)
- Production-ready Quarkus configuration
- Error handling and security roles

## Prerequisites
- Java 21+
- Docker & Docker Compose
- [Quarkus CLI](https://quarkus.io/guides/cli-tooling) (optional, for dev)
- [grpcurl](https://github.com/fullstorydev/grpcurl) or compatible gRPC client for testing

## Setup & Running

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd grpc
```

### 2. Start dependencies (MinIO, Keycloak, Vault)
```sh
cd src/main/docker
# Start MinIO, Keycloak, Vault (edit compose files as needed)
docker-compose -f docker-compose.minio.yml up -d
```

### 3. Build the backend
```sh
./gradlew clean build
```

### 4. Run the backend
```sh
./gradlew quarkusDev
# or
java -jar build/document-manager-backend-dev.jar
```

### 5. Test the API
Use [grpcurl](https://github.com/fullstorydev/grpcurl) or your frontend:
```sh
grpcurl -plaintext -d '{"filename":"test.txt","content":"...base64..."}' localhost:9000 com.drive.backend.grpc.file_info.FileService/UploadFile
```
#### Generate base64 from file with Linux
```sh
base64 -w 0 toTest.png > encoded.txt
```

## gRPC API Overview

See `src/main/proto/fileinfo.proto` for full details. Main endpoints:

- `UploadFile(FileUploadRequest)`: Upload a file (base64-encoded content)
- `DeleteFile(FileDeleteRequest)`: Delete by UUID
- `RenameFile(FileRenameRequest)`: Rename by UUID
- `ListUserFiles(ListUserFilesRequest)`: List files with search, filter, pagination, and has_more
- `GetFileCounts(GetFileCountsRequest)`: Get file counts by type, with optional search

### Example: ListUserFilesRequest
```protobuf
message ListUserFilesRequest {
  string search = 2;   // Filename search
  string filter = 3;   // "all", "images", "documents"
  string last_uuid = 4; // Cursor for pagination
  int32 limit = 5;     // Page size (default: 20)
}
```

### Example: GetFileCountsRequest
```protobuf
message GetFileCountsRequest {
  string search = 1; // Optional search filter
}
```

## Development & Testing
- Proto files: `src/main/proto/`
- Java code: `src/main/java/com/drive/backend/grpc/`
- To regenerate gRPC stubs after proto changes:
  ```sh
  ./gradlew clean build
  ```
- Run tests (if available):
  ```sh
  ./gradlew test
  ```
- Docker scripts: `src/main/docker/scripts/`

## License
MIT
