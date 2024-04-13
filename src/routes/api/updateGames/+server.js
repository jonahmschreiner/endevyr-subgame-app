import prisma from '$lib/prisma';
const verifyCode = import.meta.env.VITE_APP_API_KEY;
export async function POST({ request }) {
    let requestIn = await request.json();
    let { gameids, type, value, verify } = requestIn;
    if (verify != verifyCode) {
        return new Response(JSON.stringify({
            status: 500,
        }));
    }
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