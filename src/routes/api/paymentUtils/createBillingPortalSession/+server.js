import Stripe from 'stripe';
let stripesecretkey;
const baseURL = import.meta.env.VITE_APP_BASE_URL;
if (baseURL == 'http://localhost:5173'){
    stripesecretkey = import.meta.env.VITE_STRIPE_TEST_SECRET_KEY;
} else {
    stripesecretkey = import.meta.env.VITE_STRIPE_SECRET_KEY;
}
export async function POST({ request }) {
    const data = await request.json();
    let { userid } = data;
    let response = await fetch(`${baseURL}/api/getUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userid }),
    });
    let responseJSON = await response.json();

    const stripe = new Stripe(stripesecretkey, {
        apiVersion: "2023-10-16",
    });
    const session = await stripe.billingPortal.sessions.create({
        customer: responseJSON.user.stripecustomerid,
        return_url: 'https://app.endevyr.com',
    });
    return new Response(JSON.stringify({url: session.url, status: 200}));
};