import prisma from '$lib/prisma';
const verifyCode = import.meta.env.VITE_APP_API_KEY;
export async function POST({ request }) {
    let requestIn = await request.json();
    let { userid, type, value, verify } = requestIn;
    if (verify != verifyCode) {
        return new Response(JSON.stringify({
            status: 500,
        }));
    }
    let response = await prisma.User.update({        
        where: {
            id: userid,
        },
        data: {
            [type]: value,
        },
        include: {
            games: {
                include: {
                    parentgame: true,
                    subgames: true, 
                },
            },    
        },
    });
    return new Response(JSON.stringify({
        user: response,
        status: 200,
    }));
}