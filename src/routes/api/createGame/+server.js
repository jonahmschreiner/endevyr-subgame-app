import prisma from '$lib/prisma';
export async function POST({ request }) {
    let requestIn = await request.json();
    let { userid, name = null, parentgamesubgameslength, parentgameid = null, superparentgameidin } = requestIn;
    let response;
    if (parentgameid == null){
        if (name == null) {
            response = await prisma.Game.create({        
                data: {
                    userid,
                },
            });
        } else {
            response = await prisma.Game.create({        
                data: {
                    userid,
                    name,
                },
            });
        }
    } else {
        if (name == null) {
            response = await prisma.Game.create({        
                data: {
                    userid,
                    parentgamesubgamesindex: parentgamesubgameslength,
                    parentgameid,
                    superparentgameid: superparentgameidin,
                },
                include: {
                    parentgame: true,
                    subgames: true,
                },
            });
        } else {
            response = await prisma.Game.create({        
                data: {
                    userid,
                    parentgamesubgamesindex: parentgamesubgameslength,
                    parentgameid,
                    superparentgameid: superparentgameidin,
                    name,
                },
                include: {
                    parentgame: true,
                    subgames: true,
                },
            });
        }
    }

    return new Response(JSON.stringify({
        newgame: response,
        status: 200,
    }));
}