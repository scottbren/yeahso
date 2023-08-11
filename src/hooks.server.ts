import { SvelteKitAuth } from "@auth/sveltekit"
import Twitter from "@auth/core/providers/twitter";
import { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from "$env/static/private"

export const handle = SvelteKitAuth({
  providers: [
    Twitter({ 
      clientId: TWITTER_CLIENT_ID, 
      clientSecret: TWITTER_CLIENT_SECRET, 
      checks: ["pkce", "state"]
    })
  ],
})
