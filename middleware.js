import { NextResponse } from "next/server";

// const MAIN_DOMAIN = 'customwaitlist.com'

// export function middleware(req) {

// const hostname = req.headers.get('host') || ''
// const url = req.nextUrl.clone()

// if (host === MAIN_DOMAIN || host.endsWith(`.${MAIN_DOMAIN}`)) {
//   const subdomain = host.replace(`.${MAIN_DOMAIN}`, "");
//   url.pathname = `/_sites/${subdomain}${url.pathname}`;
//   return NextResponse.rewrite(url);
// }

// const currentHost = hostname.replace(`.${MAIN_DOMAIN}`, '')

// if (
//   hostname === MAIN_DOMAIN ||
//   hostname === `www.${MAIN_DOMAIN}`
// ) {
//   return NextResponse.next()
// }

// url.pathname = `/_sites/${currentHost}${url.pathname}`
// return NextResponse.rewrite(url)
// }


// export function middleware(req) {
//   const url = req.nextUrl.clone();
//   const host = req.headers.get('host') || '';

//   if (host === MAIN_DOMAIN || host.endsWith(`.${MAIN_DOMAIN}`)) {
//     const sub = host.replace(`.${MAIN_DOMAIN}`, '').split(':')[0];
//     if (sub && sub !== 'www') {
//       url.pathname = `/_sites/${sub}${url.pathname}`;
//       return NextResponse.rewrite(url);
//     }
//   }

//   if (
//     host === MAIN_DOMAIN ||
//     host === `www.${MAIN_DOMAIN}`
//   ) {
//     return NextResponse.next()
//   }

//   const domain = host.split(':')[0]; // remove port
//   url.pathname = `/_sites/${domain}${url.pathname}`;
//   return NextResponse.rewrite(url);
// }


const MAIN_DOMAIN = 'customwaitlist.com'; // 👈 update this to your domain

// export function middleware(req) {
//   const url = req.nextUrl.clone();
//   const host = req.headers.get('host') || '';
//   const isLocalhost = host.includes('localhost');

//   const hostname = host.split(':')[0]; // removes port

//   if (
//     url.pathname.startsWith('/_next') ||
//     url.pathname.startsWith('/api') ||
//     url.pathname === '/favicon.ico' ||
//     url.pathname === '/robots.txt'
//   ) {
//     return NextResponse.next();
//   }

//   // Handle subdomain rewrites: sub.customwaitlist.com → /_sites/sub/...
//   if (!isLocalhost && hostname !== MAIN_DOMAIN && hostname.endsWith(`.${MAIN_DOMAIN}`)) {
//     const sub = hostname.replace(`.${MAIN_DOMAIN}`, '');
//     url.pathname = `/_sites/${sub}${url.pathname}`;
//     return NextResponse.rewrite(url);
//   }

//   // Handle full custom domains: myclientdomain.com → /_sites/myclientdomain.com/...
//   if (hostname !== MAIN_DOMAIN && hostname !== `www.${MAIN_DOMAIN}`) {
//     url.pathname = `/_sites/${hostname}${url.pathname}`;
//     return NextResponse.rewrite(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!_next|favicon.ico|robots.txt|api).*)'], // exclude static assets
// };


export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const isLocalhost = host.includes('localhost');

  const hostname = host.split(':')[0]; // remove port

  // Skip static and API routes
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname === '/favicon.ico' ||
    url.pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // ✅ 1. Handle root domain and www → do NOT rewrite
  if (
    hostname === MAIN_DOMAIN ||
    hostname === `www.${MAIN_DOMAIN}` ||
    isLocalhost
  ) {
    return NextResponse.next();
  }

  // ✅ 2. Handle subdomains like sub.customwaitlist.com → /_sites/sub/...
  if (hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    const sub = hostname.replace(`.${MAIN_DOMAIN}`, '');
    url.pathname = `/_sites/${sub}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // ✅ 3. Handle full custom domains like clientsite.com → /_sites/clientsite.com/...
  url.pathname = `/_sites/${hostname}${url.pathname}`;
  return NextResponse.rewrite(url);
}