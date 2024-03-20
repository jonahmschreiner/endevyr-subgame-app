import prisma from '$lib/prisma';
export async function POST({ request }) {
    let requestIn = await request.json();
    let { userid } = requestIn;
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