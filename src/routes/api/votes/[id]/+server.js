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

        if (!isValidObjectId(request.params.id)) {
            throw error(400, 'Invalid vote ID');
        }

        const vote = await db.collection('Votes').findOne({ _id: ObjectId(request.params.id) });

        if (!vote) {
            throw error(404, 'Vote not found');
        }

        return new Response(JSON.stringify(vote), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        return err;
    }
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function PUT(request) {
    try {
        const db = await connectToDb();

        if (!isValidObjectId(request.params.id)) {
            throw error(400, 'Invalid vote ID');
        }

        const { votename, profilePicture } = request.body;
        const updatedVote = {
            votename,
            profilePicture
        };

        const result = await db.collection('Votes').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: updatedVote }
        );

        if (result.modifiedCount === 1) {
            return new Response(JSON.stringify({ message: 'Vote updated successfully' }), { headers: { 'Content-Type': 'application/json' } });
        } else {
            throw error(500, 'Failed to update vote');
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
            throw error(400, 'Invalid vote ID');
        }

        const result = await db.collection('Votes').deleteOne({ _id: ObjectId(request.params.id) });

        if (result.deletedCount === 1) {
            return new Response(JSON.stringify({ message: 'Vote deleted successfully' }), { headers: { 'Content-Type': 'application/json' } });
        } else {
            throw error(500, 'Failed to delete vote');
        }
    } catch (err) {
        return err;
    }
}
