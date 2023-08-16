import { connectToDb } from '../../../db.js';
import { error } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(request) {
    try {
        const db = await connectToDb();
        const session = await request.locals.getSession(request);
        const userId = session?.user.id;

        console.log("userId from getSession", userId);
        
        // Get the userId from the request query
        console.log("request.locals:", request.locals);

        console.log("request.locals:", request.locals);

        console.log("userId from params", userId)
        // If no userId is provided, return all topics (you might want to handle this differently)
        if (!userId) {
            const topics = await db.collection('topics').find().toArray();
            return new Response(JSON.stringify(topics), { headers: { 'Content-Type': 'application/json' } });
        }

        // Fetch all topics the user has voted on
        const votedTopics = await db.collection('votes').find({ userId }).toArray();
        const votedTopicIds = votedTopics.map(vote => vote.topicId);
        console.log(votedTopicIds)
        // Fetch topics the user hasn't voted on
        const topics = await db.collection('topics').find({ _id: { $nin: votedTopicIds } }).toArray();
        
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
