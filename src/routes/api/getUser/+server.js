import prisma from '$lib/prisma';
const verifyCode = import.meta.env.VITE_APP_API_KEY;
export async function POST({ request }) {
    let data = await request.json();
    let { userid, verify } = data;
    if (verify != verifyCode) {
        return new Response(JSON.stringify({
            status: 500,
        }));
    }
    let response = await prisma.User.findUnique({
        where: {
            id: userid,
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
    if (response){
      return new Response(JSON.stringify({user: response, status: 200}));
    } else {
      return new Response(JSON.stringify({status: 404}));
    }
};