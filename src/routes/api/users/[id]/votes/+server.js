import { ObjectId } from 'mongodb'; 
import { connectToDb } from '../../../../../db.js';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ params }) {
    try {
        const db = await connectToDb();
        
        const userId = params.id;
        console.log('Received userId:', userId);

        if (!userId) {
            return new Response('UserId is required', { status: 400 });
        }

        let user = null;
        
        if (ObjectId.isValid(userId)) {
            console.log('Querying by _id');
            user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        }

        if (!user) {
            console.log('Querying by twitterId');
            user = await db.collection('users').findOne({ twitterId: userId });
        }

        console.log('Fetched user:', user);

        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        // Fetch the votes for the given userId
        console.log("userId: ", userId)
        const votes = await db.collection('votes').find({ userId: userId }).toArray()
        .catch(err => {
            console.error("Error querying for votes:", err);
        });
        console.log('Fetched votes:', votes);
        
        const enrichedVotes = votes.map(vote => ({ ...vote, user }));
        
        // Return user details and the (possibly empty) enriched votes array
        return new Response(JSON.stringify({ user, votes: enrichedVotes }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        

    } catch (err) {
        console.error("Error fetching votes:", err);
        return new Response('Internal Server Error', { status: 500 });
    }
}


