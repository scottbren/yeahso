// src/hooks.js

export function handle({ request, resolve }) {
  const session = request.locals.session;

  if (!session?.user && request.path !== '/' && !request.path.startsWith('/auth')) {
      return {
          status: 303,
          redirect: '/'
      };
  }

  return resolve(request);
}

// This function exposes session data to the client side
export function getSession(request) {
    const { user } = request.locals.session;
    return { user };
}
