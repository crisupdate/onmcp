import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subdomain } = req.body;

  if (!subdomain) {
    return res.status(400).json({ error: 'Subdomain is required' });
  }

  try {
    const sitesRef = collection(db, 'sites');
    const q = query(sitesRef, where('subdomain', '==', subdomain));
    const snapshot = await getDocs(q);

    const exists = !snapshot.empty;

    return res.status(200).json({ exists });
  } catch (error) {
    console.error('Subdomain validation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}