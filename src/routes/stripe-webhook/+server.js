// src/routes/stripe-webhook.js
import Stripe from 'stripe';
import prisma from '$lib/prisma';
const baseURL = import.meta.env.VITE_APP_BASE_URL;
let stripesecretkey;
if (baseURL == 'http://localhost:5173'){
    stripesecretkey = import.meta.env.VITE_STRIPE_TEST_SECRET_KEY;
} else {
    stripesecretkey = import.meta.env.VITE_STRIPE_SECRET_KEY;
}
const conversionapitoken = import.meta.env.VITE_APP_META_CONVERSIONS_API_ACCESS_TOKEN;
import crypto from 'crypto';
let endpointsecret;
if (baseURL == 'http://localhost:5173'){
    endpointsecret = import.meta.env.VITE_STRIPE_TEST_ENDPOINT_KEY;
} else {
    endpointsecret = import.meta.env.VITE_STRIPE_PRODUCTION_ENDPOINT_KEY;
}
export async function POST(event) {
    const {request} = event;
    const clientIP = event.getClientAddress();
    const userAgent = request.headers.get('user-agent');
    const payload = await event.request.text();
    const stripe = new Stripe(stripesecretkey, {
        apiVersion: "2023-10-16",
    });
    const sig = String(event.request.headers.get('stripe-signature'));
    let newevent = stripe.webhooks.constructEvent(payload, sig, endpointsecret);

    let subscription;
    if (newevent.type == 'customer.subscription.created' || newevent.type == 'customer.subscription.updated' || newevent.type == 'customer.subscription.deleted' || newevent.type == 'customer.subscription.paused' || newevent.type == 'customer.subscription.resumed'){
        subscription = newevent.data.object;
        let canceledat = subscription.canceled_at;
        let stripecustomerdata = await stripe.customers.retrieve(subscription.customer);
        let response = await prisma.User.findFirst({
            where: {
                email: stripecustomerdata.email,
            },
        });

        //then update the other stripe values with the values from this event
        if (canceledat == null && (response.stripelastpaidperiodenddate == null || (new Date (subscription.current_period_end * 1000) > response.stripelastpaidperiodenddate))){
            let lifetimespend = parseFloat(response.lifetimespend) + 15;
            await prisma.User.update({
                where: {
                    id: response.id,
                },
                data: {
                    premiumsubscriber: 1,
                    lifetimespend: lifetimespend,
                    premiumsubscriberexpirationdate: null,
                    stripelastpaidperiodenddate: new Date (subscription.current_period_end * 1000),
                },
            });

            if (response.firstpurchasedate == null) {
                await prisma.User.update({
                    where: {
                        id: response.id,
                    },
                    data: {
                        firstpurchasedate: new Date(),
                    },
                });
            }

            if (newevent.type == 'customer.subscription.created'){
                const email = response.email;
                const emailHashAlgo = crypto.createHash('sha256');
                emailHashAlgo.update(email);
                const emailHash = emailHashAlgo.digest('hex');

                const [firstName, lastName] = response.name.split(" "); 
                const firstNameHashAlgo = crypto.createHash('sha256');
                firstNameHashAlgo.update(firstName);
                const firstNameHash = firstNameHashAlgo.digest('hex');
                
                const lastNameHashAlgo = crypto.createHash('sha256');
                lastNameHashAlgo.update(lastName);
                const lastNameHash = lastNameHashAlgo.digest('hex');

                const userid = response.id.toString();
                const userIdHashAlgo = crypto.createHash('sha256');
                userIdHashAlgo.update(userid);
                const userIdHash = userIdHashAlgo.digest('hex');

                let now = Math.floor(Date.now() / 1000);
                let payload = [
                    {
                        "event_name": "Subscribe",
                        "event_time": now,
                        "action_source": "website",
                        "event_source_url": baseURL,
                        "user_data": {
                            "em": [
                                emailHash
                            ],
                            "fn": [
                                firstNameHash
                            ],
                            "ln": [
                                lastNameHash
                            ],
                            "external_id": [
                                userIdHash
                            ],
                            "client_ip_address": clientIP,
                            "client_user_agent": userAgent,
                        },
                        "custom_data": {
                            "currency": "USD",
                            "value": "5.00",
                            subscription_id: response.id,
                        }
                    }
                ];
                await fetch(`https://graph.facebook.com/v19.0/1390799851611000/events?access_token=${conversionapitoken}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: "cors",
                    body: JSON.stringify({data: payload}),
                });
            }
        } else if (canceledat == null){
            await prisma.User.update({
                where: {
                    id: response.id,
                },
                data: {
                    premiumsubscriber: 1,
                    lifetimespend: response.lifetimespend,
                    premiumsubscriberexpirationdate: null,
                    stripelastpaidperiodenddate: new Date (subscription.current_period_end * 1000),
                },
            });
        } else {
            let subscriptionend = new Date(subscription.current_period_end * 1000);
            await prisma.User.update({
                where: {
                    id: response.id,
                },
                data: {
                    premiumsubscriberexpirationdate: subscriptionend,
                },
            });

            let monthlyreport = await prisma.MonthlyReport.findFirst({
                orderBy: {
                  id: 'desc'
                },
                include: {
                    activeusers: true,
                    newusers: true,
                },
            });

            //make sure monthly report is current period, create a new one if not
            if (monthlyreport == undefined || monthlyreport == null || monthlyreport.periodend < new Date()) {
                if (monthlyreport) {
                    //totalpremiumsubscribercount metric calculation
                    let premiumsubscribercount = await prisma.User.count({
                        where: {
                        premiumsubscriber: 1
                        }
                    });

                    // averagelifetimevalue  Int?
                    const ltvqueryresult = await prisma.$queryRaw`
                        SELECT AVG(lifetimespend) AS average_lifetime_value
                        FROM User
                        WHERE lifetimespend > 0;
                    `;
                    let currentltv = Number(ltvqueryresult[0].average_lifetime_value);
                    if (currentltv == null) {
                        currentltv = 0;
                    } else {
                        currentltv = Math.round(currentltv);
                    }
                    // averagepaybackperiod  Int?
                    const paybackperiodresult = await prisma.$queryRaw`
                        SELECT AVG(TIMESTAMPDIFF(SECOND, joindate, firstpurchasedate)) AS average_difference
                        FROM User
                        WHERE firstpurchasedate IS NOT NULL;
                    `;
                    let currentaveragepaybackperiod = paybackperiodresult[0].average_difference;
                    if (currentaveragepaybackperiod == null || currentaveragepaybackperiod == undefined) {
                        currentaveragepaybackperiod = -1;
                    } else {
                        currentaveragepaybackperiod = Math.round(Number(currentaveragepaybackperiod) / (60 * 60 * 24));
                    }
                    // breakevencostpernewuser  Int?
                    let newuserswhosubscribed;
                    let newuserslength = monthlyreport.newusers.length;
                    if (newuserslength > 0) {
                        newuserswhosubscribed = monthlyreport.newusers.filter(obj => obj.firstpurchasedate != null).length;
                    } else {
                        newuserswhosubscribed = 0;
                    }
                    
                    let percentofnewuserswhopurchased = newuserswhosubscribed / newuserslength;
                    let breakevenmetacostperlead;
                    if (newuserslength > 0) {
                        breakevenmetacostperlead = Math.round(currentltv * percentofnewuserswhopurchased);
                    } else {
                        breakevenmetacostperlead = 0;
                    }
                    // onboardingcompletionpercentage  Int?
                    let newuserswhofinishedonboarding = monthlyreport.newusers.filter(obj => obj.onboardingcomplete == 1).length;
                    let newuserswhofinishedonboardingpercentage;
                    if (newuserslength > 0) {
                        newuserswhofinishedonboardingpercentage = Math.round((newuserswhofinishedonboarding / newuserslength) * 100);
                    } else {
                        newuserswhofinishedonboardingpercentage = 0;
                    }
                    // freeusagelimitereachedpercentage  Int?
                    let newuserswhoreachedfreeusagelimit = monthlyreport.newusers.filter(obj => obj.freeusagelimitreached == 1);
                    let newuserswhoreachedfreeusagelimitlength = newuserswhoreachedfreeusagelimit.length;
                    let newuserswhoreachedfreeusagelimitpercentage;
                    if (newuserslength > 0) {
                        newuserswhoreachedfreeusagelimitpercentage = Math.round((newuserswhoreachedfreeusagelimitlength / newuserslength) * 100);
                    } else {
                        newuserswhoreachedfreeusagelimitpercentage = 0;
                    }
                    // conversionpercentage  Int?
                    let newuserswhosubscribedpercentage;
                    if (newuserslength > 0) {
                        newuserswhosubscribedpercentage = Math.round((newuserswhosubscribed / newuserslength) * 100);
                    } else {
                        newuserswhosubscribedpercentage = 0;
                    }
                    // upgradeafterfreelimitreachedpercentage  Int?
                    let newuserswhoreachedfreelimitandsubscribedpercentage;
                    if (newuserswhoreachedfreeusagelimitlength > 0) {
                        let newuserswhoreachedfreelimitandsubscribed = newuserswhoreachedfreeusagelimit.filter(obj => obj.firstpurchasedate != null).length;
                        newuserswhoreachedfreelimitandsubscribedpercentage = Math.round((newuserswhoreachedfreelimitandsubscribed / newuserswhoreachedfreeusagelimitlength) * 100);
                    } else {
                        newuserswhoreachedfreelimitandsubscribedpercentage = 0;
                    }
                    //send metrics to db
                    await prisma.MonthlyReport.update({
                        where: {
                        id: monthlyreport.id,
                        },
                        data: {
                        totalpremiumsubscriberscount: premiumsubscribercount,
                        activeusercount: monthlyreport.activeusers.length,
                        newusercount: monthlyreport.newusers.length,
                        averagelifetimevalue: currentltv,
                        averagepaybackperiod: currentaveragepaybackperiod,
                        breakevencostpernewuser: breakevenmetacostperlead,
                        onboardingcompletionpercentage: newuserswhofinishedonboardingpercentage,
                        freeusagelimitereachedpercentage: newuserswhoreachedfreeusagelimitpercentage,
                        conversionpercentage: newuserswhosubscribedpercentage,
                        upgradeafterfreelimitreachedpercentage: newuserswhoreachedfreelimitandsubscribedpercentage,
                        }
                    });
                }
                const currentDate = new Date();
                const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                const startOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
                if (monthlyreport != null && monthlyreport != undefined) {
                    let newmonthlyreport = await prisma.MonthlyReport.create({
                        data: {
                          periodend: startOfNextMonth,
                          totalpremiumsubscriberscount: monthlyreport.totalpremiumsubscriberscount,
                        },
                    });
                    monthlyreport = newmonthlyreport;
                } else {
                    monthlyreport = await prisma.MonthlyReport.create({
                        data: {
                          periodend: startOfNextMonth,
                          totalpremiumsubscriberscount: 0,
                        },
                    });
                }
              }
            //

            //increment cancellations metric
            await prisma.MonthlyReport.update({
                where: {
                    id: monthlyreport.id,
                },
                data: {
                    cancellations: monthlyreport.cancellations + 1,
                }
            });
        }
        
    }

    return new Response(JSON.stringify({status: 200}));
  };
  