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

    try {
        const db = await connectToDb();

        // Validate input data
        const { username, profilePicture } = request.body;
        if (!username || !profilePicture) {
            throw new Error('Invalid input data');
        }
        
        // Ensure that username is unique
        const existingUser = await db.collection('users').findOne({ username });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Username already exists' }), {
                status: 409,  // Conflict
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create a new user
        const newUser = {
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
            throw new Error('Failed to create user');
        }
    } catch (err) {
        console.error("Error handling user data:", err);
        return new Response(err.message, {
            status: 500,  // Internal Server Error
            headers: { 'Content-Type': 'application/json' }
        });
    }
}



