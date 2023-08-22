import { connectToDb } from '../../../../db.js';
import { ObjectId } from 'mongodb';

// Helper function to check if a string is a valid ObjectId
function isValidObjectId(id) {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(request) {
    try {
        const db = await connectToDb();

        if (!isValidObjectId(request.params.id)) {
            return new Response(JSON.stringify({
                message: 'Invalid vote ID'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const vote = await db.collection('Votes').findOne({ _id: ObjectId(request.params.id) });

        if (!vote) {
            return new Response(JSON.stringify({
                message: 'Vote not found'
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify(vote), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
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
export async function PUT(event) {
    try {
        const db = await connectToDb();

        if (!isValidObjectId(event.params.id)) {
            return new Response(JSON.stringify({
                message: 'Invalid vote ID'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Read the content of the stream and parse it as JSON
        const rawData = [];
        const reader = event.request.body.getReader();
        let readResult;
        while (!(readResult = await reader.read()).done) {
            rawData.push(...readResult.value);
        }
        const jsonString = new TextDecoder().decode(new Uint8Array(rawData));
        const { vote } = JSON.parse(jsonString);
        

        // Continue with your existing logic
        const updatedVote = {
            vote
        };

        const result = await db.collection('votes').updateOne(
            { _id: new ObjectId(event.params.id) },
            { $set: updatedVote }
        );

        if (result.modifiedCount === 1) {
            return new Response(JSON.stringify({
                message: 'Vote updated successfully'
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({
                message: 'Failed to update vote'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (err) {
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
export async function DELETE(request) {
    try {
        const db = await connectToDb();

        if (!isValidObjectId(request.params.id)) {
            return new Response(JSON.stringify({
                message: 'Invalid vote ID'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const result = await db.collection('Votes').deleteOne({ _id: ObjectId(request.params.id) });

        if (result.deletedCount === 1) {
            return new Response(JSON.stringify({
                message: 'Vote deleted successfully'
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({
                message: 'Failed to delete vote'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (err) {
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
