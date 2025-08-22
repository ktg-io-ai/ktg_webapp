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