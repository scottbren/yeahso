import { connectToDb } from '../../../../db.js';
import { ObjectId } from 'mongodb';
import { error } from '@sveltejs/kit';

// Helper function to check if a string is a valid ObjectId
function isValidObjectId(id) {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(request) {
    try {
        const db = await connectToDb();
        
        // Check if the provided ID is a valid ObjectId
        if (!isValidObjectId(request.params.id)) {
            return new Response(JSON.stringify({
                message: 'Invalid topic ID'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        console.log(request)
        const topic = await db.collection('topics').findOne({ _id: request.params.id });
        
        if (!topic) {
            return new Response(JSON.stringify({
                message: 'Topic not found'
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify(topic), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        console.error("Error fetching topic:", err);
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
export async function PUT(request) {
    try {
        const db = await connectToDb();

        if (!isValidObjectId(request.params.id)) {
            throw error(400, 'Invalid topic ID');
        }

        const { topicname, profilePicture } = request.body;
        const updatedTopic = {
            topicname,
            profilePicture
        };

        const result = await db.collection('topics').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: updatedTopic }
        );

        if (result.modifiedCount === 1) {
            return new Response(JSON.stringify({ message: 'Topic updated successfully' }), { headers: { 'Content-Type': 'application/json' } });
        } else {
            throw error(500, 'Failed to update topic');
        }
    } catch (err) {
        return err;
    }
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function DELETE(request) {
    try {
        const db = await connectToDb();

        if (!isValidObjectId(request.params.id)) {
            throw error(400, 'Invalid topic ID');
        }

        const result = await db.collection('topics').deleteOne({ _id: ObjectId(request.params.id) });

        if (result.deletedCount === 1) {
            return new Response(JSON.stringify({ message: 'Topic deleted successfully' }), { headers: { 'Content-Type': 'application/json' } });
        } else {
            throw error(500, 'Failed to delete topic');
        }
    } catch (err) {
        return err;
    }
}
