# Store Rating System API Documentation

## Base URL
`http://localhost:3001/`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```Bearer <your_token>```

## Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| PUT | `/auth/password` | Update password | Yes |

### User Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/stores` | Get all stores with filters | Yes |
| GET | `/users/stores/:id` | Get store details | Yes |
| GET | `/users/ratings/store/:storeId` | Get all ratings for a store | Yes |
| GET | `/users/ratings/user/:userId` | Get all ratings by a user | Yes |
| POST | `/users/rating` | Submit a rating | Yes |
| PATCH | `/users/rating/:id` | Update existing rating | Yes |

### Store Owner Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/owner/ratings` | Get ratings for owned store | Yes |
| GET | `/owner/average-rating` | Get store's average rating | Yes |

### Admin Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/dashboard` | Get dashboard statistics | Yes |
| GET | `/admin/users` | Get all users with filters | Yes |
| GET | `/admin/stores` | Get all stores with filters | Yes |
| POST | `/admin/stores` | Create new store | Yes |
| POST | `/admin/users` | Create new user | Yes |
| PUT | `/admin/users/:email` | Update user role | Yes |
| DELETE | `/admin/users/:email` | Delete user | Yes |


## Store Filters

### Query Parameters
| Parameter | Description | Required |
|-----------|-------------|-----------|
| name | Filter stores by name | No |
| address | Filter stores by address | No |
| sortBy | Field to sort results by | No |
| sortOrder | Sort direction ("ASC" or "DESC") | No |

### Example Request



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
