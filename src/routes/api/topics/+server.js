import { connectToDb } from '../../../db.js';
import { error } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
    try {
        const db = await connectToDb();
        console.log("Attempting to fetch topics...");
        const topics = await db.collection('topics').find().toArray();
        //console.log("Fetched topics:", topics);
        const count = await db.collection('topics').countDocuments();
        console.log("Number of topics:", count);

        
        return new Response(JSON.stringify(topics), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.error("Error fetching topics:", err);
        throw error(500, 'Internal Server Error');
    }
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(request) {
    try {
        const db = await connectToDb();
        const { topicname, profilePicture } = request.body;

        const newTopic = {
            topicname,
            profilePicture
        };

        const result = await db.collection('topics').insertOne(newTopic);

        if (result.insertedCount === 1) {
            return new Response(JSON.stringify(result.ops[0]), {
                status: 201,  // Created
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            throw error(500, 'Failed to create topic');
        }
    } catch (err) {
        console.error("Error creating topic:", err);
        throw error(500, 'Internal Server Error');
    }
}
