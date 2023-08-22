import { SvelteKitAuth } from "@auth/sveltekit";
import Twitter from "@auth/core/providers/twitter";
import { connectToDb } from './db.js';  // Assuming you have this method to connect to the database
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
      if (!profile) {
        console.error("Profile is undefined");
        return false;
      }
    
      const response = await fetch(`http://172.30.0.1:5173/api/users/twitter/${profile.data.id}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile.data),
      });
    
      if (!response.ok) {
        console.error("Failed to save user data in our database.");
        return false;
      }

      // Once the user data is saved, fetch the complete user profile from your database
      const db = await connectToDb();
      const user = await db.collection("users").findOne({ twitterId: profile.data.id });

      if (!user) {
        console.error("User not found in database after signIn.");
        return false;
      }

      // Convert the _id to a string for easier handling
      user._id = user._id.toString();
      console.log("customData in signIn:", { userProfile: user });
      profile.customData = { userProfile: user };
      return {
        ...profile,
        customData: { userProfile: user }
      };
      
    },
    
    async session({ session, token, user }) {
      console.log(session);
      console.log("Token in session callback:", token);

      const db = await connectToDb();
      const userData = await db.collection("users").findOne({ twitterId: token.sub });
      if (userData) {
        // Merge userData with existing session user object
        session.user = {
          ...session.user, // spread existing user data
          ...userData // spread the new userData
        };
    } else {
        console.error("Token is undefined or missing sub property");
      }
      return session;
    }
    
  }
});
