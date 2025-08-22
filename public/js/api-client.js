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

function displayError(error, formElement) {
  const errorDiv = formElement.querySelector('.error-message') || 
                   document.createElement('div');
  
  errorDiv.className = 'error-message';
  errorDiv.textContent = error.message;
  
  if (!formElement.querySelector('.error-message')) {
    formElement.appendChild(errorDiv);
  }
}

function showSuccess(message, formElement) {
  const successDiv = formElement.querySelector('.success-message') || 
                     document.createElement('div');
  
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  
  if (!formElement.querySelector('.success-message')) {
    formElement.appendChild(successDiv);
  }
}