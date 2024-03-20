import prisma from '$lib/prisma';
export async function POST({ request }) {
    let requestIn = await request.json();
    let { gameid } = requestIn;

    let response = await prisma.Game.findUnique({
        where: {
            id: gameid,
        },
    });
    deleteChildren(response);
    try {
        await prisma.Game.delete({        
            where: {
                id: gameid,
            },
        });
    } catch (e) {

    }
    return new Response(JSON.stringify({
        status: 200,
    }));
}

async function deleteChildren(node) {
    let response = await prisma.Game.findMany({
        where: {
            parentgameid: node.id,
        },
    });

    for (const child of response) {
        await deleteChildren(child);
    }
    try {
        await prisma.Game.delete({
            where: {
                id: node.id,
            },
        });
    } catch (e) {

    }
}