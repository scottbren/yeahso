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
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile) {
        console.error("Profile is undefined");
        return false;
      }
    
      const response = await fetch(`http://172.28.64.1:5173/api/users/twitter/${profile.data.id}`, { 
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
    async jwt({ token, account, profile }) {
      console.log("Full profile in jwt:", profile);
      console.log("account:", account)
      if (account) {
          token.accessToken = account.access_token;
          token.id = profile.id;
          //token.customData = profile.customData;  // Ensure customData is added to token
      }
      //console.log("customData in jwt:", profile.customData);
      return token;
    },
  
    
    async session({ session, token, user }) {
      console.log(session);
      console.log("Token in session callback:", token);

      if (token) {
        session.user.twitterId = token.sub;
        session.user._id = token._id;
        console.log("user.customData", user);
    
        // Extract customData from token and add to session
        if (token.customData) {
          session.customData = token.customData;
        }
    
        // If you specifically want the userProfile
        if (token.customData && token.customData.userProfile) {
          session.userProfile = token.customData.userProfile;
        }
        //console.log("customData in session:", token.customData);
      } else {
        console.error("Token is undefined or missing sub property");
      }
      return session;
    }
    
  }
});
