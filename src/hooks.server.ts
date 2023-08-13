import { SvelteKitAuth } from "@auth/sveltekit";
import Twitter from "@auth/core/providers/twitter";
import { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from "$env/static/private";

export const handle = SvelteKitAuth({
  providers: [
    Twitter({ 
      clientId: TWITTER_CLIENT_ID, 
      clientSecret: TWITTER_CLIENT_SECRET, 
      checks: ["pkce", "state"],
    })
  ],
  callbacks: {
    async signIn({ profile }) {
      // Check if profile is undefined before proceeding
      if (!profile) {
        console.error("Profile is undefined");
        return false;
      }
      console.log("profile: ", profile.data)
      // Prepare the user data.
      const userData = {
        id: profile.data.id,
        name: profile.data.name,
        username: profile.data.username,
        image: profile.data.profile_image_url,
        // any other necessary attributes
      };
      console.log("userData: ", userData)

      // Make an API call to save the user data in the DB using global `fetch`.
      // Ensure the URL is absolute.
      let id = userData.id;
      const response = await fetch(`http://172.24.128.1:5173/api/users/twitter/${id}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      console.log("response: ", await response.json())

      // Check if the response is successful.
      if (!response.ok) {
        console.log(response)
        console.error("Failed to save user data in our database.");
        return false;  // Indicate an error occurred during sign-in.
      }

      return true;  // Indicate a successful sign-in.
    }
  }
});
