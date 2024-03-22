// src/routes/stripe-webhook.js
import Stripe from 'stripe';
import prisma from '$lib/prisma';
const stripesecretkey = import.meta.env.VITE_STRIPE_SECRET_KEY;
const baseURL = import.meta.env.VITE_APP_BASE_URL;
let endpointsecret;
if (baseURL == 'http://localhost:5173'){
    endpointsecret = import.meta.env.VITE_STRIPE_TEST_ENDPOINT_KEY;
} else {
    endpointsecret = import.meta.env.VITE_STRIPE_PRODUCTION_ENDPOINT_KEY;
}
export async function POST(event) {
    const rawBody = await event.request.arrayBuffer();
    const buffer = Buffer.alloc(rawBody.byteLength);
	const view = new Uint8Array(rawBody);
	for (let i = 0; i < buffer.length; i++) {
		buffer[i] = view[i];
	}
    const payload = buffer;
    const stripe = new Stripe(stripesecretkey, {
        apiVersion: "2023-10-16",
    });
    const sig = String(event.request.headers.get('stripe-signature'));
    let newevent = stripe.webhooks.constructEvent(payload, sig, endpointsecret);

    let subscription;
    if (newevent.type == 'customer.subscription.created' || newevent.type == 'customer.subscription.updated' || newevent.type == 'customer.subscription.deleted' || newevent.type == 'customer.subscription.paused' || newevent.type == 'customer.subscription.resumed'){
        subscription = newevent.data.object;
        let status = subscription.status;
        //find user in db with stripeconnectedaccountid matching event
        let response = await prisma.User.findFirst({
            where: {
                stripecustomerid: subscription.customer,
            },
        });

        //then update the other stripe values with the values from this event
        if (status == "active"){
            await prisma.User.update({
                where: {
                    id: response.id,
                },
                data: {
                    premiumsubscriber: 1,
                },
            });
        } else {
            await prisma.User.update({
                where: {
                    id: response.id,
                },
                data: {
                    premiumsubscriberexpirationdate: subscription.current_period_end,
                },
            });
        }
        
    }

    return new Response(JSON.stringify({status: 200}));
  };
  