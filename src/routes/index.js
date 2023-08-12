import { error } from '@sveltejs/kit';

// Import your API route handlers
import * as topics from './api/topics/+server.js';
import * as users from './api/users/+server.js';
import * as votes from './api/votes/+server.js';

// Define your API routes
export const apiRoutes = {
  '/api/topics': topics,
  '/api/users': users,
  '/api/votes': votes,
};

// Handle API routes and custom error pages
export async function handle({ request, resolve }) {
  const { pathname } = new URL(request.url);

  // Check if the requested path matches an API route
  if (pathname.startsWith('/api')) {
    const routeHandler = apiRoutes[pathname];

    // If a matching route handler is found, execute the corresponding API route function
    if (routeHandler) {
      try {
        return await routeHandler[request.method.toLowerCase()](request);
      } catch (error) {
        return error({ status: 500, body: { message: 'Internal Server Error' } });
      }
    }

    // If no matching route handler is found, return a 404 error
    return error({ status: 404 });
  }

  // For non-API routes, proceed with resolving the request
  return resolve(request);
}
