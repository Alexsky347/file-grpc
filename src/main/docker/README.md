# Keycloak Configuration Guide for gRPC Service

## Step 1: Create or Select a Realm

1. Log into Keycloak Admin Console
2. Create a new realm or select an existing one (e.g., "drive-realm")
3. Note the realm name for your configuration

## Step 2: Create a Client for Your Backend Service

1. Go to **Clients** → **Create Client**
2. Configure the client:
    - **Client ID**: `drive-backend-service` (or your preferred name)
    - **Client Type**: `OpenID Connect`
    - **Client authentication**: `ON` (this is important for backend services)

3. Click **Next**, then configure:
    - **Standard flow**: `OFF` (not needed for backend)
    - **Direct access grants**: `ON`
    - **Service accounts roles**: `ON` (if you need machine-to-machine auth)
    - **Authorization**: `OFF` (unless you need fine-grained authorization)

4. Click **Save**

## Step 3: Get Client Credentials

1. Go to the **Credentials** tab of your client
2. Copy the **Client Secret** - you'll need this for your application.properties

## Step 4: Create Roles

1. Go to **Realm Roles** → **Create Role**
2. Create these roles:
    - **user** (for regular users)
    - **admin** (for administrators)

## Step 5: Create Users

1. Go to **Users** → **Create User**
2. Fill in user details:
    - **Username**: testuser
    - **Email**: testuser@example.com
    - **Email verified**: `ON`
    - **Enabled**: `ON`

3. Click **Create**

## Step 6: Set User Password

1. Go to the user you just created
2. Click **Credentials** tab
3. Click **Set Password**
4. Enter a password
5. Set **Temporary**: `OFF` (so user doesn't need to change it)
6. Click **Save**

## Step 7: Assign Roles to Users

1. Still in the user view, go to **Role Mapping** tab
2. Click **Assign Role**
3. Select **user** role (and **admin** if needed)
4. Click **Assign**

## Step 8: Configure Token Settings (Optional but Recommended)

1. Go back to your client configuration
2. Click on **Advanced** tab (or **Advanced Settings**)
3. Configure token lifespans:
    - **Access Token Lifespan**: 5 minutes (default)
    - **Client Session Idle**: 30 minutes
    - **Client Session Max**: 10 hours

## Step 9: Update Your Quarkus application.properties

```properties
# Keycloak OIDC Configuration
quarkus.oidc.auth-server-url=http://localhost:8180/realms/drive-realm
quarkus.oidc.client-id=drive-backend-service
quarkus.oidc.credentials.secret=YOUR_CLIENT_SECRET_FROM_STEP_3
# Token verification
quarkus.oidc.token.issuer=http://localhost:8180/realms/drive-realm
# gRPC Security
quarkus.grpc.server.use-separate-server=false
quarkus.grpc.server.plain-text=true
# Security policies
quarkus.http.auth.permission.authenticated.paths=/*
quarkus.http.auth.permission.authenticated.policy=authenticated
```

## Step 10: Testing the Configuration

### Get an Access Token (for testing):

```bash
curl -X POST 'http://localhost:8180/realms/drive-realm/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password' \
  -d 'client_id=drive-backend-service' \
  -d 'client_secret=YOUR_CLIENT_SECRET' \
  -d 'username=testuser' \
  -d 'password=testpassword'
```

This will return a JSON with an `access_token` field.

### Use the Token with gRPC:

Add the token to your gRPC metadata:

```java
Metadata metadata = new Metadata();
Metadata.Key<String> key = Metadata.Key.of("Authorization", Metadata.ASCII_STRING_MARSHALLER);
metadata.

put(key, "Bearer "+accessToken);

// Attach to your gRPC stub
FileServiceGrpc.FileServiceBlockingStub stub = FileServiceGrpc.newBlockingStub(channel)
        .withInterceptors(MetadataUtils.newAttachHeadersInterceptor(metadata));
```

## Common Issues and Solutions

### Issue 1: "User not authenticated"

- Check if the token is being sent correctly in the Authorization header
- Verify the token hasn't expired
- Check if the realm name matches in both Keycloak and application.properties

### Issue 2: "Invalid token"

- Verify the client secret is correct
- Check if `quarkus.oidc.auth-server-url` matches your Keycloak server URL
- Ensure the realm name is correct

### Issue 3: "Access denied" / 403 Forbidden

- Verify the user has the correct roles assigned
- Check if `@RolesAllowed({"user", "admin"})` matches the roles in Keycloak
- Verify role mapping in Keycloak for the user

### Issue 4: Connection refused to Keycloak

- Ensure Keycloak is running
- Verify the URL and port are correct
- Check firewall settings

## Production Recommendations

1. **Use HTTPS** for both Keycloak and your service
2. **Enable SSL/TLS** for gRPC in production:
   ```properties
   quarkus.grpc.server.ssl.enabled=true
   quarkus.grpc.server.ssl.certificate=path/to/cert.pem
   quarkus.grpc.server.ssl.key=path/to/key.pem
   ```
3. **Use environment variables** for sensitive data:
   ```properties
   quarkus.oidc.credentials.secret=${KEYCLOAK_CLIENT_SECRET}
   ```
4. **Set appropriate token lifespans** based on your security requirements
5. **Enable token refresh** if needed for long-running operations
6. **Use client certificate authentication** for service-to-service communication

# Getting Keycloak Token with Postman

## Method 1: Manual Token Request (Recommended for Testing)

### Step 1: Create a New Request in Postman

1. Open Postman
2. Create a new **POST** request
3. URL: `http://localhost:8180/realms/YOUR_REALM_NAME/protocol/openid-connect/token`
    - Replace `YOUR_REALM_NAME` with your actual realm (e.g., `drive-realm`)
    - Replace `localhost:8180` with your Keycloak server address

### Step 2: Configure Headers

Add this header:

- **Key**: `Content-Type`
- **Value**: `application/x-www-form-urlencoded`

### Step 3: Configure Body

1. Select **Body** tab
2. Select **x-www-form-urlencoded**
3. Add these key-value pairs:

| Key             | Value                                |
|-----------------|--------------------------------------|
| `grant_type`    | `password`                           |
| `client_id`     | `drive-backend-service`              |
| `client_secret` | `YOUR_CLIENT_SECRET` (from Keycloak) |
| `username`      | `testuser`                           |
| `password`      | `testpassword`                       |

### Step 4: Send Request

Click **Send**

### Step 5: Response

You'll get a JSON response like:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "abc123...",
  "scope": "profile email"
}
```

**Copy the `access_token` value** - this is what you'll use!

---

## Method 2: Using Postman's OAuth 2.0 (Easier for Multiple Requests)

### Step 1: Create Your gRPC Request

1. Create a new gRPC request in Postman
2. Enter your service URL (e.g., `localhost:9000`)

### Step 2: Configure Authorization

1. Go to the **Authorization** tab
2. **Type**: Select `OAuth 2.0`
3. Click **Get New Access Token**

### Step 3: Configure Token Settings

Fill in these details:

| Field                     | Value                                                                    |
|---------------------------|--------------------------------------------------------------------------|
| **Token Name**            | `Keycloak Token`                                                         |
| **Grant Type**            | `Password Credentials`                                                   |
| **Access Token URL**      | `http://localhost:8180/realms/drive-realm/protocol/openid-connect/token` |
| **Client ID**             | `drive-backend-service`                                                  |
| **Client Secret**         | `YOUR_CLIENT_SECRET`                                                     |
| **Username**              | `testuser`                                                               |
| **Password**              | `testpassword`                                                           |
| **Scope**                 | (leave empty or add `openid profile email`)                              |
| **Client Authentication** | `Send as Basic Auth header`                                              |

### Step 4: Get Token

1. Click **Get New Access Token**
2. Postman will request the token
3. Click **Use Token**

Now the token will be automatically added to your requests!

---

## Method 3: Testing gRPC with Token in Postman

### For gRPC Requests:

1. Select **gRPC** request type
2. Enter server URL: `localhost:9000`
3. Go to **Metadata** tab
4. Add metadata:
    - **Key**: `authorization`
    - **Value**: `Bearer YOUR_ACCESS_TOKEN`

### Example gRPC Request:

**Service**: `FileService`  
**Method**: `listUserFiles`

**Metadata**:

```
authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Message** (JSON):

```json
{}
```

---

## Method 4: Using Postman Pre-request Script (Advanced)

If you want to automatically refresh tokens, add this to your Collection's **Pre-request Script**:

```javascript
// Check if token exists and is not expired
const tokenExpiry = pm.environment.get("token_expiry");
const currentTime = Date.now();

if (!tokenExpiry || currentTime >= tokenExpiry) {
    // Request new token
    pm.sendRequest({
        url: 'http://localhost:8180/realms/drive-realm/protocol/openid-connect/token',
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
            mode: 'urlencoded',
            urlencoded: [
                {key: 'grant_type', value: 'password'},
                {key: 'client_id', value: 'drive-backend-service'},
                {key: 'client_secret', value: 'YOUR_CLIENT_SECRET'},
                {key: 'username', value: 'testuser'},
                {key: 'password', value: 'testpassword'}
            ]
        }
    }, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            const jsonResponse = response.json();
            pm.environment.set("access_token", jsonResponse.access_token);

            // Set expiry time (current time + expires_in seconds - 30 seconds buffer)
            const expiryTime = Date.now() + ((jsonResponse.expires_in - 30) * 1000);
            pm.environment.set("token_expiry", expiryTime);
        }
    });
}
```

Then in your requests, use:

- **Metadata key**: `authorization`
- **Metadata value**: `Bearer {{access_token}}`

---

## Troubleshooting

### Error: "Invalid client credentials"

- Double-check your `client_secret` in Keycloak (Clients → Your Client → Credentials tab)
- Ensure `Client Authentication` is **ON** in Keycloak

### Error: "Invalid user credentials"

- Verify username and password are correct
- Check if user is **Enabled** in Keycloak
- Verify user has a password set

### Error: "Client not found"

- Check that `client_id` matches exactly (case-sensitive)
- Verify the realm name in the URL is correct

### Token expires quickly

- In Keycloak: Clients → Your Client → Advanced → Access Token Lifespan
- Increase the value (default is 5 minutes)

---

## Quick Reference

**Token Endpoint Format**:

```
http://{KEYCLOAK_HOST}:{PORT}/realms/{REALM_NAME}/protocol/openid-connect/token
```

**Required Parameters**:

- `grant_type`: `password`
- `client_id`: Your client ID
- `client_secret`: Your client secret
- `username`: User's username
- `password`: User's password

**Using the Token**:

```
authorization: Bearer {ACCESS_TOKEN}
```