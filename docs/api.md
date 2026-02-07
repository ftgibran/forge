# API Documentation

Base URL: `http://localhost:3000/api`

All responses are wrapped in `{ "data": ... }` format.

## Authentication

All endpoints except `/auth/register` and `/auth/login` require a JWT Bearer token.

Include the header: `Authorization: Bearer <token>`

---

## Auth Endpoints

### POST /auth/register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### POST /auth/login

Login with existing credentials.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (201):**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "name": "Admin User"
    }
  }
}
```

### GET /auth/me

Get current user's profile. **Requires auth.**

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "userRoles": [
      {
        "roleId": "uuid",
        "assignedAt": "2024-01-01T00:00:00.000Z",
        "role": { "id": "uuid", "name": "admin", "description": "Administrator" }
      }
    ],
    "userPermissions": []
  }
}
```

---

## Users Endpoints

All user endpoints require auth and appropriate permissions.

### POST /users

Create a new user. **Permission:** `create:user`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "name": "New User",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /users

List users with pagination. **Permission:** `read:user`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10, max: 100)

**Response (200):**
```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "User",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### GET /users/:id

Get user by ID with roles and permissions. **Permission:** `read:user`

### PATCH /users/:id

Update a user. **Permission:** `update:user`

**Request Body (all fields optional):**
```json
{
  "email": "updated@example.com",
  "name": "Updated Name",
  "password": "newpassword123"
}
```

### DELETE /users/:id

Delete a user. **Permission:** `delete:user`

### POST /users/:id/roles

Assign a role to a user. **Permission:** `update:user`

**Request Body:**
```json
{
  "roleId": "uuid"
}
```

### DELETE /users/:id/roles/:roleId

Remove a role from a user. **Permission:** `update:user`

### POST /users/:id/permissions

Assign a direct permission to a user. **Permission:** `update:user`

**Request Body:**
```json
{
  "permissionId": "uuid"
}
```

### DELETE /users/:id/permissions/:permissionId

Remove a direct permission from a user. **Permission:** `update:user`

---

## Roles Endpoints

### POST /roles

Create a new role. **Permission:** `create:role`

**Request Body:**
```json
{
  "name": "editor",
  "description": "Can edit content"
}
```

### GET /roles

List roles with pagination. **Permission:** `read:role`

### GET /roles/:id

Get role by ID with permissions and assigned users. **Permission:** `read:role`

### PATCH /roles/:id

Update a role. **Permission:** `update:role`

**Request Body:**
```json
{
  "name": "updated-role",
  "description": "Updated description"
}
```

### DELETE /roles/:id

Delete a role. **Permission:** `delete:role`

### POST /roles/:id/permissions

Assign a permission to a role. **Permission:** `update:role`

**Request Body:**
```json
{
  "permissionId": "uuid"
}
```

### DELETE /roles/:id/permissions/:permissionId

Remove a permission from a role. **Permission:** `update:role`

---

## Permissions Endpoints

### POST /permissions

Create a new permission. **Permission:** `create:permission`

**Request Body:**
```json
{
  "action": "read",
  "resource": "dashboard",
  "description": "Can view dashboard"
}
```

### GET /permissions

List permissions with pagination. **Permission:** `read:permission`

### GET /permissions/:id

Get permission by ID. **Permission:** `read:permission`

### PATCH /permissions/:id

Update a permission. **Permission:** `update:permission`

### DELETE /permissions/:id

Delete a permission. **Permission:** `delete:permission`

---

## Seed Data

After running `pnpm run prisma:seed`, the following data is available:

### Users
| Email | Password | Role |
|---|---|---|
| admin@example.com | admin123 | admin (all permissions) |
| user@example.com | user1234 | user (read-only) + direct create:user |

### Roles
- **admin** - Full CRUD on all resources (12 permissions)
- **user** - Read-only on all resources (3 permissions)

### Permissions
CRUD permissions for each resource: `user`, `role`, `permission`
- Format: `action:resource` (e.g., `create:user`, `read:role`, `delete:permission`)

---

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

Common status codes:
- `400` - Validation error
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `409` - Conflict (duplicate resource)
