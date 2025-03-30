# Testing Documentation

## Overview
This document outlines the tests performed on the Store Rating System API, frontend, and database to ensure functionality, reliability, and security.

## API Testing
### **Authentication Tests**
| Test Case | Endpoint | Expected Outcome | Status |
|-----------|----------|------------------|--------|
| Register a new user | `/auth/signup` | User is created successfully | ✅ |
| Login with valid credentials | `/auth/signin` | JWT token is returned | ✅ |
| Verify authentication token | `/auth/verify` | Valid token returns success | ✅ |
| Logout | `/auth/logout` | User Loggedout  successfully | ✅ |

### **Admin API Tests**
| Test Case | Endpoint | Expected Outcome | Status |
|-----------|----------|------------------|--------|
| Add a new store | `/admin/add-store` | Store is created successfully | ✅ |
| Get list of users | `/admin/users` | Users list is returned | ✅ |
| Fetch store owners | `/admin/store-owners` | Store owners data is returned | ✅ |
| Retrieve store list with filters | `/admin/stores?name=XYZ` | Filtered store list is returned | ✅ |

### **User API Tests**
| Test Case | Endpoint | Expected Outcome | Status |
|-----------|----------|------------------|--------|
| Fetch stores | `/users/stores` | List of stores is returned | ✅ |
| Get store details | `/users/stores/:id` | Store details are returned | ✅ |
| Submit a rating | `/users/rating` | Rating is stored successfully | ✅ |
| Update rating | `/users/rating/:id` | Rating is updated successfully | ✅ |

### **Store Owner API Tests**
| Test Case | Endpoint | Expected Outcome | Status |
|-----------|----------|------------------|--------|
| Get ratings for owned store | `/owner/ratings` | List of ratings is returned | ✅ |
| Get average store rating | `/owner/average-ratings` | Average rating is returned | ✅ |
| Update password | `/owner/update-password` | Password updated successfully | ✅ |

## Frontend Testing
### **Login Page Tests**
- ✅ Login page loads correctly.
- ✅ Error messages display for invalid input.
- ✅ Redirection works after successful login.
- ✅ Loading state is visible while signing in.

### **Signup Page Tests**
- ✅ Registration form validates user input.
- ✅ Successful registration redirects to login page.

### **Dashboard Tests**
- ✅ Admin dashboard displays correct statistics.
- ✅ Store listing updates dynamically based on filters.
- ✅ User rating submission updates store ratings in real-time.

## Database Validation
### **Users Table**
- ✅ Ensured password hashing is implemented.
- ✅ Role-based access control is enforced.
- ✅ Duplicate email registration is prevented.

### **Stores Table**
- ✅ Store data integrity is maintained.
- ✅ No duplicate store entries with same name and address.

### **Ratings Table**
- ✅ Only valid ratings (1-5) are accepted.
- ✅ Users can update their own ratings.

## Conclusion
All major functionalities have been tested and verified. The system meets authentication, performance, and security expectations. Ongoing monitoring will ensure stability and scalability.

