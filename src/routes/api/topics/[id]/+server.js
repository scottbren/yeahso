import { connectToDb } from '../../../../db.js';
import { ObjectId } from 'mongodb';
import { error } from '@sveltejs/kit';

// Helper function to check if a string is a valid ObjectId


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(request) {
    try {
        const db = await connectToDb();

        const topic = await db.collection('topics').findOne({ _id: request.params.id });

        if (!topic) {
            throw error(404, 'Topic not found');
        }

        return new Response(JSON.stringify(topic), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        return err;
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
