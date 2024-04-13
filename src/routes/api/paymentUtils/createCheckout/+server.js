import Stripe from 'stripe';
let stripesecretkey;
const baseURL = import.meta.env.VITE_APP_BASE_URL;
const verifyCode = import.meta.env.VITE_APP_API_KEY;
if (baseURL == 'http://localhost:5173'){
    stripesecretkey = import.meta.env.VITE_STRIPE_TEST_SECRET_KEY;
} else {
    stripesecretkey = import.meta.env.VITE_STRIPE_SECRET_KEY;
}
export async function POST({ request }) {
    const data = await request.json();
    let { userid, verify } = data;
    if (verify != verifyCode) {
      return new Response(JSON.stringify({
          status: 500,
      }));
    }
    let response = await fetch(`${baseURL}/api/getUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userid, verify}),
    });
    let responseJSON = await response.json();
    
    const stripe = new Stripe(stripesecretkey, {
        apiVersion: "2023-10-16",
    });

    let sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          // price: '{{PRICE_ID}}',
          price_data: {
            currency: "USD",
            product_data: {
                name: "Endevyr Standard Plan",
                images: ['https://app.endevyr.com/favicon.png'], //put publically-accessable endevyr logo here
            },
            unit_amount: 1500,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: baseURL + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: baseURL,
    };
    if (responseJSON.user.stripecustomerid != null) {
      sessionParams.customer = responseJSON.user.stripecustomerid;
    } else {
      sessionParams.customer_email = responseJSON.user.email;
    }
    
    const session = await stripe.checkout.sessions.create(sessionParams);
    return new Response(JSON.stringify({url: session.url, status: 200}));
};