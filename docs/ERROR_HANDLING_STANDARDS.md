# KTG Error Handling Standards

## Overview
Standardized error handling patterns for consistent API responses and improved debugging across the KTG platform.

## Error Response Format

### Standard Error Structure
```javascript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": "Technical details for debugging",
    "timestamp": "2025-01-17T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### Success Response Structure
```javascript
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Optional success message"
}
```

## Error Codes

### Authentication Errors (AUTH_*)
- `AUTH_INVALID_CREDENTIALS` - Invalid email/password
- `AUTH_TOKEN_EXPIRED` - JWT token expired
- `AUTH_UNAUTHORIZED` - Missing or invalid authorization
- `AUTH_ACCOUNT_SUSPENDED` - Account suspended/banned

### Validation Errors (VALIDATION_*)
- `VALIDATION_REQUIRED_FIELD` - Required field missing
- `VALIDATION_INVALID_FORMAT` - Invalid data format
- `VALIDATION_DUPLICATE_ENTRY` - Duplicate data (email, username)
- `VALIDATION_FILE_TOO_LARGE` - File exceeds size limit

### Database Errors (DB_*)
- `DB_CONNECTION_ERROR` - Database connection failed
- `DB_QUERY_ERROR` - SQL query failed
- `DB_CONSTRAINT_VIOLATION` - Foreign key/constraint violation
- `DB_RECORD_NOT_FOUND` - Requested record doesn't exist

### Business Logic Errors (BUSINESS_*)
- `BUSINESS_INSUFFICIENT_TOKENS` - Not enough tokens for operation
- `BUSINESS_CREATOR_NOT_APPROVED` - Creator account not approved
- `BUSINESS_LISTING_UNAVAILABLE` - Listing not available for booking

## Implementation

### Express Error Middleware
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  
  // Log error for debugging
  console.error(`[${requestId}] Error:`, {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Determine error type and response
  let errorResponse = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      requestId: requestId
    }
  };

  // Add details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.details = err.stack;
  }

  // Set appropriate status code
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
```

### Custom Error Classes
```javascript
// utils/errors.js
class KTGError extends Error {
  constructor(code, message, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'KTGError';
  }
}

class ValidationError extends KTGError {
  constructor(message, field = null) {
    super('VALIDATION_ERROR', message, 400);
    this.field = field;
  }
}

class AuthenticationError extends KTGError {
  constructor(message) {
    super('AUTH_UNAUTHORIZED', message, 401);
  }
}

class DatabaseError extends KTGError {
  constructor(message) {
    super('DB_ERROR', message, 500);
  }
}

module.exports = {
  KTGError,
  ValidationError,
  AuthenticationError,
  DatabaseError
};
```

### Route Implementation Example
```javascript
// routes/creators.js
const { ValidationError, DatabaseError } = require('../utils/errors');

app.post('/api/creators/register', async (req, res, next) => {
  try {
    // Validation
    if (!req.body.email) {
      throw new ValidationError('Email is required', 'email');
    }
    
    if (!req.body.password) {
      throw new ValidationError('Password is required', 'password');
    }

    // Business logic
    const result = await Database.createCreator(req.body);
    
    res.json({
      success: true,
      data: { creatorId: result.insertId },
      message: 'Creator registered successfully'
    });
    
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
});
```

## Frontend Error Handling

### API Client Wrapper
```javascript
// public/js/api-client.js
class APIClient {
  static async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new APIError(data.error);
      }
      
      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError({
        code: 'NETWORK_ERROR',
        message: 'Network request failed'
      });
    }
  }
}

class APIError extends Error {
  constructor(errorData) {
    super(errorData.message);
    this.code = errorData.code;
    this.details = errorData.details;
    this.timestamp = errorData.timestamp;
  }
}
```

### Form Error Display
```javascript
// Display errors in forms
function displayError(error, formElement) {
  const errorDiv = formElement.querySelector('.error-message') || 
                   document.createElement('div');
  
  errorDiv.className = 'error-message';
  errorDiv.textContent = error.message;
  
  if (!formElement.querySelector('.error-message')) {
    formElement.appendChild(errorDiv);
  }
}

// Usage in forms
try {
  const result = await APIClient.request('/api/creators/register', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  
  // Handle success
  showSuccess('Registration successful!');
  
} catch (error) {
  displayError(error, document.getElementById('creatorForm'));
}
```

## Logging Strategy

### Development Logging
- Console output with full error details
- Request/response logging
- Stack traces for debugging

### Production Logging
- Structured JSON logs
- Error aggregation service integration
- User-friendly error messages only
- Security-sensitive data filtering

## Migration Plan

1. **Phase 1**: Implement error middleware and custom error classes
2. **Phase 2**: Update existing routes to use standardized errors
3. **Phase 3**: Update frontend to handle new error format
4. **Phase 4**: Add comprehensive logging and monitoring

## Testing Error Handling

```javascript
// Test error responses
describe('Error Handling', () => {
  test('should return validation error for missing email', async () => {
    const response = await request(app)
      .post('/api/creators/register')
      .send({ password: 'test123' });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```