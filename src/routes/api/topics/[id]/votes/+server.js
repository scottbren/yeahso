import { ObjectId } from 'mongodb';
import { connectToDb } from '../../../../../db.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(request) {
    try {
        const db = await connectToDb();

        // Convert string ID to MongoDB ObjectID
        const topicId = request.params.id;

        // Fetch all votes for the specific topic ID from the votes collection
        const votes = await db.collection('votes').find({ topicId: topicId }).toArray();

        if (votes.length === 0) {
            return new Response(JSON.stringify({
                message: 'No votes found for this topic'
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify(votes), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({
            message: 'Internal Server Error',
            error: err.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
