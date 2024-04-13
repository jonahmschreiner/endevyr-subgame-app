import prisma from '$lib/prisma';
const verifyCode = import.meta.env.VITE_APP_API_KEY;
export async function POST({ request }) {
    let requestIn = await request.json();
    let { gameid, type, value, verify } = requestIn;
    if (verify != verifyCode) {
        return new Response(JSON.stringify({
            status: 500,
        }));
    }
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