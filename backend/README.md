# Store Rating System API Documentation

## Base URL
`http://localhost:3001/`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```Bearer <your_token>```

## Endpoints

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/signin` | Login user | No |
| GET | `/auth/verify` | Verify auth token | Yes |

### Admin Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/add-store` | Add a new store | Yes |
| POST | `/admin/user` | Create new user | Yes |
| GET | `/admin/stats` | Get dashboard statistics | Yes |
| GET | `/admin/stores` | Get stores with filters | Yes |
| GET | `/admin/users` | Get users with filters | Yes |
| GET | `/admin/store-owners` | Get store owners with ratings | Yes |

### User Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/users` | Get list of all users | Yes |
| GET | `/users/stores` | Get list of all stores with search | Yes |
| GET | `/users/stores/:id` | Get store details | Yes |
| POST | `/users/rating` | Submit a rating | Yes |
| POST | `/users/rating/:id` | Update existing rating | Yes |

### Store Owner Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/owner/update-password` | Update password | Yes |
| GET | `/owner/ratings` | Get ratings for owned store | Yes |
| GET | `/owner/average-ratings` | Get average ratings of the stores of owner | Yes |

## API Response Format

All API endpoints return responses in the following format:

```json
{
  "status": "success" | "error",
  "data": any | null,
  "message": string | null
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is obtained upon successful signin and should be included in subsequent requests to protected endpoints.

## Store Filters

### Query Parameters
| Parameter | Description | Required |
|-----------|-------------|-----------|
| name | Filter stores by name | No |
| address | Filter stores by address | No |
| sortBy | Field to sort results by | No |
| sortOrder | Sort direction ("ASC" or "DESC") | No |

## Input Validation

### User Data
- Name: 20-60 characters
- Address: Maximum 400 characters
- Password: 8-16 characters, must include at least one uppercase letter and one special character
- Email: Must follow standard email format (example@domain.com)

### Rating Data
- Rating Value: Must be a number between 1 and 5


## Success Responses
{
  "status": "success",
  "data": <response_data>
}

## Error Responses
{
  "status": "error",
  "message": "Error description"
}
