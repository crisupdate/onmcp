// pages/api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  try {
    const { waitlistRef, email, domain, subdomain } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: process.env.STRIPE_PRICE_ID, quantity: 1 },
      ],
      customer_email: email,
      success_url: `https://${domain ? domain : subdomain + ".customwaitlist.com"}/edit?status=success`,
      cancel_url: `https://${domain ? domain : subdomain + ".customwaitlist.com"}/edit?status=canceled`,
      metadata: { waitlist_ref: waitlistRef },
      allow_promotion_codes: true,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
