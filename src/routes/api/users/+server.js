import { connectToDb } from '../../../db.js';
import { error } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
    try {
        const db = await connectToDb();
        const users = await db.collection('users').find().toArray();
        
        return new Response(JSON.stringify(users), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.error("Error fetching users:", err);
        throw error(500, 'Internal Server Error');
    }
}

export async function POST(request) {
    console.log("POST /users hit with data:", request.body);  // Log incoming data

    try {
        const db = await connectToDb();

        const { twitterId, username, profilePicture } = request.body;

        // Check if user with the given twitterId exists
        const existingUser = await db.collection('users').findOne({ twitterId });
        console.log("Existing user check result:", existingUser);  // Log check result

        if (existingUser) {
            // Return the existing user's data
            return new Response(JSON.stringify(existingUser), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            // Create a new user if it doesn't exist
            const newUser = {
                twitterId,
                username,
                profilePicture
            };

            const result = await db.collection('users').insertOne(newUser);
            console.log("New user creation result:", result);  // Log creation result

            if (result.insertedCount === 1) {
                return new Response(JSON.stringify(result.ops[0]), {
                    status: 201,  // Created
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                throw error(500, 'Failed to create user');
            }
        }
    } catch (err) {
        console.error("Error handling user data:", err);
        throw error(500, 'Internal Server Error');
    }
}

