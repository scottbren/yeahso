import { connectToDb } from '../../../../../db.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ params }) {
    try {
        const db = await connectToDb();
        
        // Get the userId from the parameters
        const userId = params.id;
        if (!userId) {
            return new Response('UserId is required', { status: 400 });
        }

        // Fetch votes for the given userId
        const votes = await db.collection('votes').find({ userId }).toArray();
        
        // Fetch user details for the given userId
        const user = await db.collection('users').findOne({ _id: userId });

        // If no user found, return an error
        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        // Map user details to each vote
        const enrichedVotes = votes.map(vote => ({
            ...vote,
            user
        }));

        // Return the enriched votes using the Response object
        return new Response(JSON.stringify(enrichedVotes), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error("Error fetching votes:", err);
        return new Response('Internal Server Error', { status: 500 });
    }
}
