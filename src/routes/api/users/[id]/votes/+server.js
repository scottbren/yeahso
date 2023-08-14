import { connectToDb } from '../../../../../db.js';
import { error } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ params }) {
    try {
        const db = await connectToDb();
        
        // Get the userId from the parameters
        const userId = params.id;
        if (!userId) {
            return error(400, 'UserId is required');
        }

        // Fetch votes for the given userId
        const votes = await db.collection('votes').find({ userId }).toArray();

        // Return the votes using the Response object
        return new Response(JSON.stringify(votes), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error("Error fetching votes:", err);
        return error(500, 'Internal Server Error');
    }
}
