
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../../firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Missing domain or site ID' });
  }

  try {
    const response = await fetch(`https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Vercel API error:', data);
      return res.status(400).json({ error: data });
    }

    // Save mapping in Firestore
    // await addDoc(collection(db, 'sites'), {
    //   domain: domain,
    //   siteId,
    //   createdAt: new Date(),
    // });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to add domain:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
