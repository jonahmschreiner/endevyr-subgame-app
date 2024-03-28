import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import { WorkOS } from '@workos-inc/node';
import { SignJWT, jwtVerify } from 'jose';
import Stripe from 'stripe';
const stripesecretkey = import.meta.env.VITE_STRIPE_SECRET_KEY;
const workosapikey = import.meta.env.VITE_WORKOS_API_KEY;
const workosclientid = import.meta.env.VITE_WORKOS_CLIENT_ID;
const workossecretkey = import.meta.env.VITE_WORKOS_SECRET_KEY;
const workosredirecturi = import.meta.env.VITE_WORKOS_REDIRECT_URI;
const secret = new Uint8Array(Buffer.from(workossecretkey, 'base64'),);
export const load = async ({ url, cookies }) => {
//start auth
  //check if the user is logging out
  const logout = url.searchParams.get('logout');
  if (logout != null){
    cookies.delete('token', { path: '/' });
  }
  //check if valid cookie exists
  let verifiedToken = null;
  try {
    const inittoken = cookies.get('token');
    verifiedToken = await jwtVerify(inittoken, secret);
  } catch {
    verifiedToken = null;
  }

  let userObj;
  //if not. if code exists in url do the following, else do the logic that is currently in the /test page.server.js
  if (verifiedToken == null){
    const workos = new WorkOS(workosapikey);
    const clientId = workosclientid;
    const code = url.searchParams.get('code');
    try {
      const { user } = await workos.userManagement.authenticateWithCode({code, clientId});
      userObj = user;
    } catch (e) {
      const authorizationUrl = workos.userManagement.getAuthorizationUrl({
        provider: 'authkit',
        clientId: workosclientid,
        redirectUri: workosredirecturi
      });
      throw redirect(307, authorizationUrl);
    }
  
    //create new user object in db if necessary
    let existsresponse = await prisma.User.findUnique({
      where: {
        email: userObj.email,
      },
    });
    if (existsresponse == null || existsresponse == undefined){
      let today = new Date();
      today.setHours(3);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      existsresponse = await prisma.User.create({
        data: {
          email: userObj.email,
          name: userObj.firstName + " " + userObj.lastName,
          lastfinitegamebehaviorcountreset: today,
        },
      });
    }
    const token = await new SignJWT({
      userid: existsresponse.id,
      userObj,
    })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT'})
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  
    cookies.set(`token=${token}; Path=/;`);
    const baseURL = import.meta.env.VITE_APP_BASE_URL;
    throw redirect(307, baseURL);
  } else {
    userObj = verifiedToken.payload.userObj;
  }
  
  //end auth

    //handle successful checkout
    const paymentsessionid = url.searchParams.get('session_id');
    if (paymentsessionid != null && paymentsessionid != undefined){
      const stripe = new Stripe(stripesecretkey, {
        apiVersion: "2023-10-16",
      });
      const session = await stripe.checkout.sessions.retrieve(paymentsessionid);
      const customer = await stripe.customers.retrieve(session.customer);
      if (session.payment_status == "paid"){
        let customerResponse = await prisma.User.findFirst({
          where: {
            email: customer.email,
          },
        });
        if (customerResponse.stripecustomerid == null){
          await prisma.User.update({
            where: {
              id: customerResponse.id,
            },
            data: {
              premiumsubscriber: 1,
              stripecustomerid: session.customer,
              premiumsubscriberexpirationdate: null,
            },
          });
        } else {
          await prisma.User.update({
            where: {
              id: customerResponse.id,
            },
            data: {
              premiumsubscriber: 1,
              premiumsubscriberexpirationdate: null,
            },
          });
        }
      }
    }
  
    //

    let response = await prisma.User.findUnique({
        where: {
            email: userObj.email,
        },
        include: {
            games: {
                include: {
                    parentgame: true,
                    subgames: true,
                },
                orderBy: {
                  lastaccessed: 'desc',
                },
            },
        },
    });
    
    let drillsdue = await prisma.Game.findMany({
        where: {
            AND: [
                {userid: response.id},
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
    let today = new Date();
    today.setHours(8);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    let next = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    let finitegameadditionsremaining = drillsdue.length;
    if (finitegameadditionsremaining > 3) {
      finitegameadditionsremaining = 3;
    }
    if (response.lastfinitegamebehaviorcountreset <= next) {
      await prisma.User.update({
        where: {
          id: response.id,
        },
        data: {
          lastfinitegamebehaviorcountreset: today,
          todaynewfinitegamebehaviorcount: finitegameadditionsremaining,
        },
      });
      response.lastfinitegamebehaviorcountreset = today;
      response.todaynewfinitegamebehaviorcount = 0;
    }

    return {
        user: response,
        drillsdue,
    };
};