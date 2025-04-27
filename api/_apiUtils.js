import * as Sentry from '@sentry/node';

// Initialize Sentry
Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export async function authenticateUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    
    // For IndexedDB implementation, we'll validate the token differently
    // Since this is a serverless function and can't directly access the client's IndexedDB,
    // we'll need to validate the token here using your preferred method
    
    // This is a simplified example - in a real app, you might verify a JWT token
    // or check against a database of valid sessions
    
    // For demo purposes, we'll accept any token and return a mock user
    // In production, implement proper token validation
    const user = {
      id: '123',
      email: 'user@example.com'
    };

    return user;
  } catch (error) {
    console.error('Authentication error:', error.message);
    Sentry.captureException(error);
    throw error;
  }
}

export function handleApiError(error, res, customMessage = 'Internal Server Error') {
  console.error('API Error:', error);
  Sentry.captureException(error);
  
  return res.status(500).json({
    error: customMessage,
    message: error.message
  });
}