import prisma from '$lib/prisma';
export async function POST({ request }) {
    let requestIn = await request.json();
    let { userid, type, value } = requestIn;
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