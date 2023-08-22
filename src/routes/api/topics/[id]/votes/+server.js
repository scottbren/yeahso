import { ObjectId } from 'mongodb';
import { connectToDb } from '../../../../../db.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(request) {
    try {
        const db = await connectToDb();

        // Initialize the response structure
        let response = {
            message: '',
            votes: [],
            users: []
        };
        // Convert string ID to MongoDB ObjectID
        const topicId = request.params.id;

        if (!ObjectId.isValid(topicId)) {
            return new Response(JSON.stringify({
                message: 'Invalid topic ID provided',
                error: 'Topic ID must be a string of 12 bytes or a string of 24 hex characters',
                votes: [],
                users: []
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        console.log(topicId);

        // Fetch all votes for the specific topic ID from the votes collection
        const votes = await db.collection('votes').find({ topicId: topicId }).toArray();
        console.log(`Querying votes for topicId (type: ${typeof topicId}): ${topicId}`);

        console.log(votes)
        if (votes.length > 0) {
            response.votes = votes;
        
            // Extract user IDs from votes and fetch user details
            const validUserIds = votes.map(vote => vote.userId).filter(Boolean);
        
            // Separate ObjectID userIds and twitterId userIds
            const objectIdUserIds = validUserIds.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id));
            const twitterIds = validUserIds.filter(id => !ObjectId.isValid(id));
        
            const usersById = await db.collection('users').find({ _id: { $in: objectIdUserIds } }).toArray();
            const usersByTwitterId = await db.collection('users').find({ twitterId: { $in: twitterIds } }).toArray();
        
            response.users = [...usersById, ...usersByTwitterId];
        }  else {
            response.message = 'No votes found for this topic';
        }

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (err) {
        console.error("Error caught at:", err.stack);
        return new Response(JSON.stringify({
            message: 'Internal Server Error',
            error: err.message,
            votes: [],
            users: []
        }), {
            status: 500,
            body: {
                message: 'Internal Server Error',
                error: err.message
            }
        });
    }
}


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({request}) {
    try {
        const db = await connectToDb();

        const body = await request.json();
        console.log('request body:', body); 
        // Extract user and vote details from the request body
        const userId = body.userId;
        const topicId = body.topicId;
        const vote = body.vote; // 'agree' or 'disagree'
        const timestamp = body.timestamp;
        console.log(topicId, vote)

        function getCookies(cookieString) {
            return Object.fromEntries(cookieString.split('; ').map(c => {
                const [key, v] = c.split('=');
                return [key, decodeURIComponent(v)];
            }));
        }
        // You might want to check if the user has already voted on this topic
        const existingVote = await db.collection('votes').findOne({ userId, topicId });
        
        if (existingVote) {
            return new Response(JSON.stringify({
                message: 'User has already voted on this topic'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Save the vote
        await db.collection('votes').insertOne({
            userId,
            topicId,
            vote,
            timestamp
        });
        

        return new Response(JSON.stringify({
            message: 'Vote registered successfully'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
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




