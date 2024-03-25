import prisma from '$lib/prisma';
export async function POST({ request }) {
    let requestIn = await request.json();
    let { gameids, type, value } = requestIn;
    await prisma.Game.updateMany({        
        where: {
            id: {
                in: gameids,
            },
        },
        data: {
            [type]: value,
        },
    });
    return new Response(JSON.stringify({
        status: 200,
    }));
}