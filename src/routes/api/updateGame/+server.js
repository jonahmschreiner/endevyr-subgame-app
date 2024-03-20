import prisma from '$lib/prisma';
export async function POST({ request }) {
    let requestIn = await request.json();
    let { gameid, type, value } = requestIn;
    let response = await prisma.Game.update({        
        where: {
            id: gameid,
        },
        data: {
            [type]: value,
        },
        include: {
            parentgame: true,
            subgames: true,    
        },
    });
    return new Response(JSON.stringify({
        newgame: response,
        status: 200,
    }));
}