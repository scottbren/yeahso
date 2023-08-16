// @ts-nocheck
import { connectToDb } from '../../../../../db.js';

// Helper function to retrieve a user by their Twitter ID
async function getUserByTwitterId(db, twitterId) {
    console.log("Starting to find user by twitterId:", twitterId);
    const result = await db.collection('users').findOne({ twitterId });
    console.log("Finished finding user:", result);
    return result;
}


// Helper function to create a new user based on their Twitter profile
async function createUserFromTwitterProfile(db, profile) {
    // If user doesn't exist, create them.
    console.log("user doesn't exist, adding");
    const newUser = {
        _id: null,
        twitterId: profile.id,
        name: profile.name,
        username: profile.username,
        profileImageUrl: profile.image,
            // ... any other data you want to store
    };
    console.log("profilfe: ", profile)
    const response = await db.collection('users').insertOne(newUser);
    console.log("added.", response);


    return newUser; // Returning the newly created user
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event) {
    try {
        console.log("test2");
        const db = await connectToDb();
        // Convert the ReadableStream to text or JSON

        // Assume event.request.body is either parsed JSON or a string

        let data = '';
        for await (const chunk of event.request.body) {
            data += chunk;
        }
        const profile = JSON.parse(data);
        console.log("profile req: ", profile)
        console.log(event.request)

        console.log("checking if user exists");
        let user = await getUserByTwitterId(db, profile.id);


        if (!user) {
            console.log("user doesn't exist, adding now");
            user = await createUserFromTwitterProfile(db, profile);
        }

        // Return a new instance of the Response object
        return new Response(JSON.stringify(user), {
            status: 200,
            userId: user._id, // assuming MongoDB's unique ID is `_id`
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500, // Internal Server Error
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}


