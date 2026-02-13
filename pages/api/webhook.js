import Stripe from "stripe";
import { buffer } from "micro";
import admin from "firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

// Disable body parsing so we can verify Stripe signatures
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // Allow HEAD requests (Stripe sometimes sends HEAD to check endpoint)
  if (req.method === "HEAD") {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook received:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const waitlistRef = session.metadata?.waitlist_ref;

    if (!waitlistRef) {
      console.warn("⚠️ No waitlist_ref found in session metadata");
    } else {
      try {
        const sitesRef = db.collection("sites");
        const snapshot = await sitesRef
          .where("waitlist_ref", "==", waitlistRef)
          .limit(1)
          .get();

        if (snapshot.empty) {
          console.warn(`⚠️ No site found for waitlist_ref: ${waitlistRef}`);
        } else {
          const doc = snapshot.docs[0];
          await doc.ref.update({ premium: true });
          console.log(`🔥 Updated site ${doc.id} with premium: true`);
        }
      } catch (err) {
        console.error("❌ Firestore update failed:", err);
        return res.status(500).send("Internal Server Error");
      }
    }
  }

  // Respond to Stripe to acknowledge receipt
  res.status(200).json({ received: true });
}
