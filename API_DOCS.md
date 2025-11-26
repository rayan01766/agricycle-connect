# AgriCycle Connect API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://your-render-app.onrender.com
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### 1. Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "password": "password123",
  "name": "John Farmer",
  "role": "farmer"  // Options: "farmer", "company", "admin"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "farmer@example.com",
    "name": "John Farmer",
    "role": "farmer"
  }
}
```

**Error Responses:**
- `400` - Validation error or user already exists
- `500` - Server error

---

### 2. Login
**POST** `/api/auth/login`

Authenticate a user and get access token.

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "farmer@example.com",
    "name": "John Farmer",
    "role": "farmer"
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `500` - Server error

---

## Waste Listing Endpoints

### 3. Create Waste Listing
**POST** `/api/waste`

Create a new waste listing (Farmer only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
type: "Corn Stalks"
quantity: "500"
price: "150"
location: "Iowa, USA"
description: "Fresh corn stalks from recent harvest"
image: <file>  // Optional
```

**Response (201):**
```json
{
  "message": "Waste listing created successfully",
  "listing": {
    "id": 1,
    "farmer_id": 1,
    "type": "Corn Stalks",
    "quantity": 500,
    "price": 150,
    "location": "Iowa, USA",
    "description": "Fresh corn stalks from recent harvest",
    "image": "image.jpg",
    "status": "pending",
    "created_at": "2025-11-23T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (not a farmer)
- `500` - Server error

---

### 4. Get All Waste Listings
**GET** `/api/waste`

Get all waste listings with optional filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status ("pending", "approved", "rejected")
- `type` (optional): Filter by waste type

**Note:** Companies automatically see only approved listings.

**Response (200):**
```json
{
  "listings": [
    {
      "id": 1,
      "farmer_id": 1,
      "type": "Corn Stalks",
      "quantity": 500,
      "price": 150,
      "location": "Iowa, USA",
      "description": "Fresh corn stalks",
      "image": "image.jpg",
      "status": "approved",
      "farmer_name": "John Farmer",
      "farmer_email": "farmer@example.com",
      "created_at": "2025-11-23T12:00:00.000Z",
      "updated_at": "2025-11-23T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Server error

---

### 5. Get Specific Waste Listing
**GET** `/api/waste/:id`

Get details of a specific waste listing.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "listing": {
    "id": 1,
    "farmer_id": 1,
    "type": "Corn Stalks",
    "quantity": 500,
    "price": 150,
    "location": "Iowa, USA",
    "description": "Fresh corn stalks",
    "image": "image.jpg",
    "status": "approved",
    "farmer_name": "John Farmer",
    "farmer_email": "farmer@example.com",
    "created_at": "2025-11-23T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (companies can only view approved)
- `404` - Listing not found
- `500` - Server error

---

### 6. Get My Listings
**GET** `/api/waste/my/listings`

Get all listings created by the authenticated farmer.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "listings": [
    {
      "id": 1,
      "farmer_id": 1,
      "type": "Corn Stalks",
      "quantity": 500,
      "price": 150,
      "location": "Iowa, USA",
      "status": "pending",
      "created_at": "2025-11-23T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (farmers only)
- `500` - Server error

---

### 7. Update Listing Status
**PATCH** `/api/waste/:id/status`

Update the status of a waste listing (Admin only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "approved"  // Options: "approved", "rejected", "pending"
}
```

**Response (200):**
```json
{
  "message": "Listing approved successfully",
  "listing": {
    "id": 1,
    "status": "approved",
    "approved_by": 3,
    "updated_at": "2025-11-23T12:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (admins only)
- `404` - Listing not found
- `500` - Server error

---

### 8. Delete Listing
**DELETE** `/api/waste/:id`

Delete a waste listing.

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:**
- Farmers can delete their own listings
- Admins can delete any listing

**Response (200):**
```json
{
  "message": "Listing deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (not authorized to delete)
- `404` - Listing not found
- `500` - Server error

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Error Response Format

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

For validation errors:
```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding rate limiting middleware.

---

## CORS

The API supports CORS. Configure allowed origins in the backend `.env` file:
```
CORS_ORIGIN=http://localhost:3000
```

---

## Sample Usage with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123",
    "name": "John Farmer",
    "role": "farmer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123"
  }'
```

### Create Listing
```bash
curl -X POST http://localhost:5000/api/waste \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "type=Corn Stalks" \
  -F "quantity=500" \
  -F "price=150" \
  -F "location=Iowa, USA" \
  -F "description=Fresh corn stalks" \
  -F "image=@/path/to/image.jpg"
```

### Get Listings
```bash
curl -X GET http://localhost:5000/api/waste \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Status (Admin)
```bash
curl -X PATCH http://localhost:5000/api/waste/1/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```
