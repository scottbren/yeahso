export async function handleRequest({ request, resolve }) {
    const response = await resolve(request);
  
    // Check if the user ID exists, then set the cookie
    if (response.userData) {
      response.headers['set-cookie'] = `userID=${response.userData._id}; HttpOnly=false; secure=false; Path=/; SameSite=Lax`;
    }
  
    return response;
  }