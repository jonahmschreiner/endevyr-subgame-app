import prisma from '$lib/prisma';
const verifyCode = import.meta.env.VITE_APP_API_KEY;
export async function POST({ request }) {
    let requestIn = await request.json();
    let { gameid, verify } = requestIn;
    if (verify != verifyCode) {
        return new Response(JSON.stringify({
            status: 500,
        }));
    }
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