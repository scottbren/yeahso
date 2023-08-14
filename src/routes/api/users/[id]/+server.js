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
            return new Response(JSON.stringify({ error: 'Invalid user ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const user = await db.collection('users').findOne({ _id: request.params.id });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function PUT(request) {
    try {
        const db = await connectToDb();

        if (!isValidObjectId(request.params.id)) {
            throw error(400, 'Invalid user ID');
        }

        const { username, profilePicture } = request.body;
        const updatedUser = {
            username,
            profilePicture
        };

        const result = await db.collection('users').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: updatedUser }
        );

        if (result.modifiedCount === 1) {
            return new Response(JSON.stringify({ message: 'User updated successfully' }), { headers: { 'Content-Type': 'application/json' } });
        } else {
            throw error(500, 'Failed to update user');
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
            throw error(400, 'Invalid user ID');
        }

        const result = await db.collection('users').deleteOne({ _id: ObjectId(request.params.id) });

        if (result.deletedCount === 1) {
            return new Response(JSON.stringify({ message: 'User deleted successfully' }), { headers: { 'Content-Type': 'application/json' } });
        } else {
            throw error(500, 'Failed to delete user');
        }
    } catch (err) {
        return err;
    }
}
