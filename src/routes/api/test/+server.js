import { connectToDb } from '../../../db.js';

export async function GET() {
    let db;
    
    try {
        db = await connectToDb();
    } catch (error) {
        return new Response(JSON.stringify({
            message: "Failed to connect to MongoDB",
            error: error.message
        }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
    
    try {
        const topics = await db.collection('topics').find().toArray();

        // If topics is empty, return mock data
        if (topics.length === 0) {
            return new Response(JSON.stringify({
                message: "Returning mock data since topics from MongoDB was empty",
                data: [{ _id: "1", topicname: "Test Topic", profilePicture: "test.jpg" }]
            }), { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            message: "Successfully fetched topics from MongoDB",
            data: topics
        }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: "Failed to fetch topics from MongoDB",
            error: error.message
        }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
