import { connectToDb } from '../../../db.js';
import { error } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
    try {
        const db = await connectToDb();
        const votes = await db.collection('Votes').find().toArray();
        
        return new Response(JSON.stringify(votes), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.error("Error fetching votes:", err);
        throw error(500, 'Internal Server Error');
    }
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(request) {
    try {
        const db = await connectToDb();
        
        const { userId, topicId, vote } = request.body;

        // Basic validation
        if (!userId || !topicId || !vote || (vote !== 'agree' && vote !== 'disagree')) {
            throw error(400, 'Invalid request data');
        }

        const newVote = { userId, topicId, vote };

        const result = await db.collection('Votes').insertOne(newVote);

        if (result.insertedCount === 1) {
            return new Response(JSON.stringify(result.ops[0]), {
                status: 201,  // Created
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            throw error(500, 'Failed to create vote');
        }
    } catch (err) {
        console.error("Error creating vote:", err);
        throw error(500, 'Internal Server Error');
    }
}
