// src/routes/api/topics/top

import { connectToDb } from '../../../../db.js';

export async function GET() {
    try {
        const db = await connectToDb();

        // Fetch the topics and their vote count
        const topics = await db.collection('topics').find().toArray();
        const popularTopics = [];

        for (let topic of topics) {
            const agreeCount = await db.collection('votes').countDocuments({ topicId: topic._id, vote: "agree" });
            const disagreeCount = await db.collection('votes').countDocuments({ topicId: topic._id, vote: "disagree" });
            const totalVotes = agreeCount + disagreeCount;

            popularTopics.push({
                topic: topic,
                agreeCount,
                disagreeCount,
                totalVotes
            });
        }

        // Sort by totalVotes in descending order and get top 10
        const top10Topics = popularTopics.sort((a, b) => b.totalVotes - a.totalVotes).slice(0, 10);

        return new Response(JSON.stringify(top10Topics), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error("Error fetching popular topics:", err);
        return new Response('Internal Server Error', { status: 500 });
    }
}

