import prisma from '$lib/prisma';
const verifyCode = import.meta.env.VITE_APP_API_KEY;
export async function POST({ request }) {
    let requestIn = await request.json();
    let { userid, verify } = requestIn;
    if (verify != verifyCode) {
        return new Response(JSON.stringify({
            status: 500,
        }));
    }
    let r
    let response = await prisma.Game.findMany({
        where: {
            AND: [
                {userid: userid},
                {basecaselastcompleted: {
                    lt: prisma.game.fields.basecasenextcompletiondate,
                }},
                {basecasenextcompletiondate: {
                    lte: new Date(),
                }},
                {basecasedrillactivated: 1},
            ],
        },
        include: {
            superparentgame: true,
        },
    });
    return new Response(JSON.stringify({
        drillsdue: response,
        status: 200,
    }));
};