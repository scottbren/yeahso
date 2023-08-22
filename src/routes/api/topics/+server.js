import { connectToDb } from '../../../db.js';
import { error } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(request) {
    try {
        const db = await connectToDb();
        const session = await request.locals.getSession(request);
        const userId = session?.user.id;

        // If no userId is provided, return all topics (be cautious with this behavior)
        if (!userId) {
            const topics = await db.collection('topics').find().toArray();
            return new Response(JSON.stringify(topics), { headers: { 'Content-Type': 'application/json' } });
        }

        // Fetch all topics the user has voted on
        const votedTopics = await db.collection('votes').find({ userId }).toArray();
        const votedTopicIds = votedTopics.map(vote => vote.topicId);
        
        // Fetch topics the user hasn't voted on
        const topics = await db.collection('topics').find({ _id: { $nin: votedTopicIds } }).toArray();
        
        return new Response(JSON.stringify(topics), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.error("Error fetching topics:", err);
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




/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(request) {
    try {
        console.log(request.request.body)
        const db = await connectToDb();

        // Parsing the body first
        const rawData = await request.request.body.getReader().read();
        const dataString = new TextDecoder().decode(rawData.value);
        const data = JSON.parse(dataString);
        
        // You should define newTopic first before using it
        const { description } = data;
        const newTopic = {
            title: description
        };

        // Inserting the data into the database
        const result = await db.collection('topics').insertOne(newTopic);

        // Update newTopic with the insertedId
        newTopic._id = result.insertedId;
        console.log("result", result)

        // Return the newTopic object using a Response object
        return new Response(JSON.stringify(newTopic), {
            status: 201,  // Created
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error("Error creating topic:", err);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


