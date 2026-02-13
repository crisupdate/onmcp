import { useEffect } from 'react';
import '../styles/globals.css';
// import 'react-tweet/dist/twitter-theme.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("SW registered"))
      .catch(err => console.error("SW registration failed:", err));
  }
}, []);
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     // const swUrl = `/sw-template.js`; // always serve the same SW file
  //     navigator.serviceWorker.register('/sw-template.js', { type: 'module', scope: '/' });

  //     // navigator.serviceWorker
  //     //   .register(swUrl, { scope: '/' })
  //     //   .then(reg => console.log('SW registered for', window.location.hostname, reg))
  //     //   .catch(err => console.error('SW registration failed:', err));
  //   }
  // }, []);
  return <Component {...pageProps} />
}
