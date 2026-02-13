import { collection, deleteDoc, doc, getDocs, limit, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import SEO from "../../components/SEO";
import Image from "next/image";
import JoinWL2 from "../../components/Forms/JoinWL2";
import ContactForm2 from "../../components/Forms/ContactForm2";
import { avatars, themeTextColor, tweetPostContent, tweetPostContent2 } from "../../components/Welcome";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import EditWaitlist from "../../components/Edit";
import { AvatarCircles } from "components/magicui/avatar-circles";
import { SparklesText } from "components/magicui/sparkles-text";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import QRCodeGenerator from "components/QRgen";
import { IoShareSocialOutline } from "react-icons/io5";
import { SpinningText } from "components/magicui/spinning-text";
import { Tweet } from "react-tweet";
import LoginPageForm from "components/Forms/LoginPage";
import ListWaitlist from "components/List";
// import ListMembers from "../../components/ListMembers";


export default function SitePage({ siteData, waitlistData, slug, pagePath }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);  

if (!siteData) return <p className="text-white w-full p-8 text-center">Site not found</p>
const vars = siteData;

const rt = Math.floor(Math.random() * tweetPostContent.length) //random tweet
const tweetText = tweetPostContent(vars?.title)[rt]
const tweetUrl = `https://${vars?.domain || `${vars?.subdomain}.customwaitlist.com`}` ?? 'https://customwaitlist.com'

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": `https://${vars?.subdomain ? vars.subdomain + '.customwaitlist.com' : vars?.domain}`,
    "name": vars?.title,
    "description": vars?.text3,
    "logo": vars?.logo
}

const login = async (e) => {
  e.preventDefault();
  setError("");
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    console.error(err)
    setError("Invalid credentials", err);
  }
};

if (slug.includes('list')) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  return (user && user.uid === waitlistData?.userId) ? (
    <ListWaitlist siteData={siteData} waitlistData={waitlistData}/>
  ) : (
    <LoginPageForm login={login} email={email} setEmail={setEmail} error={error} pass={pass} setPass={setPass}/>
  )
}

if (slug.includes('edit')) {

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);
  
  return (user && user.uid === waitlistData?.userId) ? (
    <EditWaitlist siteData={siteData}/>
  ) : (
    <LoginPageForm login={login} email={email} setEmail={setEmail} error={error} pass={pass} setPass={setPass}/>
  )
}

if (vars.status === "draft") {
  return <p className="text-white w-full p-8 text-center">This site is in draft mode and is not public yet.</p>
}

return (
    <>
        <SEO title={`${vars?.title} ✌️ ${vars?.text2}`} host={vars?.subdomain ? vars.subdomain + '.customwaitlist.com' : vars?.domain} description={vars?.text2} image={vars?.img} jsonLd={jsonLd}/>
        <div className={`relative overflow-y-auto h-full min-h-screen no-scrollbar transform transition-all duration-1000 ${vars?.light_dark === "dark" ? "bg-black" : "bg-white"}`}>
            <div id="share-card" className={`absolute bottom-4 right-4 z-[100] transform transition-all duration-700`}>
              <div className={`bg-opacity-20 backdrop-blur-md border-2 border-white/30 w-fit h-fit rounded-3xl shadow-md flex flex-col items-center relative ${vars.light_dark === "dark" ? themeTextColor[vars.theme]?.[8] : themeTextColor[vars.theme]?.[7]}`}>
              {!showShare && (<button onClick={() => setShowShare(true)} className={`px-4 flex gap-1 items-center py-1 ${vars.light_dark === "dark" ? "text-zinc-200" : "text-zinc-800"} `}><span>Share</span><IoShareSocialOutline /></button>)}
                <div className={`flex justify-between gap-2 items-center absolute top-0 right-0 px-2 pt-1.5 w-full ${!showShare && "hidden"}`}>
                  <p className="text-white font-sens pl-2">Share!</p>
                  <button onClick={() => setShowShare(false)} className={`bg-white text-red-800 rounded-full px-3 py-0.5 text-xs font-semibold`}>Close</button>
                </div>
                {showShare && (
                  <div className={`w-40 mt-2 mx-2`}>
                      <QRCodeGenerator thx={true} qrText={`https://${vars?.domain || `${vars?.subdomain}.customwaitlist.com`}`} img={vars?.img || "https://www.customwaitlist.com/bg3.webp"} btnColor={vars.light_dark === "dark" ? themeTextColor[vars.theme]?.[8] : themeTextColor[vars.theme]?.[7]} previewSrc={previewSrc} setPreviewSrc={setPreviewSrc}/>  
                  </div>  
                )}
                <div className={`w-full p-2 ${!showShare && "hidden"}`}>
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(tweetUrl)}&hashtags=${encodeURIComponent("Innovation,CustomWaitlist,Startups,ComingSoon,Trending")}&related=${encodeURIComponent("cris_update")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 h-fit w-full rounded-full transition font-semibold inline-flex justify-center items-center gap-1 shrink-0 ${vars.light_dark === "dark" ? "bg-white text-black hover:bg-white/80" : "bg-black text-white hover:bg-black/80"}`}
                    >
                    <span>Share on </span>
                    <FaXTwitter size={20}/>
                  </a>     
                </div>
              </div>
            </div>
            <div className={`grid grid-cols-1 h-full min-h-screen md:grid-cols-3 xl:grid-cols-2`}>                  
                <div className={`absolute top-0 right-[25%] translate-y-[-80%] h-1/2 w-1/2 opacity-25 rounded-full blur-3xl z-[-10] ${vars?.light_dark === "dark" ? themeTextColor[vars.theme]?.[8] : themeTextColor[vars.theme]?.[7]}`} ></div>
                <div className={`w-full relative max-w-2xl mx-auto h-full overflow-y-clip pt-12 pb-8 px-8 ${vars?.light_dark === "dark" ? "text-zinc-200" : "text-zinc-800"} md:col-span-2 xl:col-span-1`}>
                    <div className={`absolute bottom-0 left-[-30%] translate-y-[30%] h-1/2 w-1/2 opacity-25 rounded-full blur-3xl z-[-10] ${vars?.light_dark === "dark" ? themeTextColor[vars.theme]?.[8] : themeTextColor[vars.theme]?.[7]}`} ></div>
                    <div className="w-fit mb-8">   
                        <Image
                            src={vars.logo || "https://customwaitlist.com/assets/2x/icon.png"}
                            className="h-16 w-auto object-contain"
                            alt={vars?.title}
                            height={500}
                            width={500}
                            unoptimized
                        />    
                    </div>
                    {/* <div className={`p-2 rounded-md text-xs font-semibold tracking-wide w-fit mb-8 ${vars?.light_dark === "dark" ? themeTextColor[vars?.text1_bg]?.[9] : themeTextColor[vars?.text1_bg]?.[10]}`}>{vars?.text1}</div>
                    <h1 className="text-3xl font-bold w-full mb-8">
                        {vars?.text2}
                    </h1> */}
                    <AvatarCircles text={vars?.text1} avatarUrls={avatars} />
                    <SparklesText sparklesCount={10} className={"mb-6"}>
                      {vars?.text2}
                    </SparklesText>
                    <div className="mb-12">
                      <pre className="whitespace-pre-wrap font-sans font-medium text-zinc-500">{vars?.text3}</pre>
                    </div>
                    <JoinWL2 theme={vars?.theme} light_dark={vars?.light_dark} message={vars?.message} pc={true} demo={false} waitlist_ref={vars?.waitlist_ref} isClient={true}/> 
                    {/* <div className="mt-8">
                        <pre className="whitespace-pre-wrap font-sans font-medium">{vars?.text3}</pre>
                        <pre className="italic mt-4 whitespace-pre-wrap font-sans font-normal">                      
                            {vars?.text4}
                        </pre>
                    </div> */}
                    <div className="mt-16 mb-20 sm:mb-8 flex gap-4 items-center">
                      {/* <ContactForm2 theme={vars?.theme} light_dark={vars?.light_dark}/>    */}
                      <div className="flex gap-2 items-center">
                        {vars?.social_x && (
                            <Link href={vars.social_x} target="_blank" className={`h-9 w-9 flex justify-center items-center text-sm rounded-full shadow-md transform transition-all shrink-0 ${vars.light_dark === "dark" ? `${themeTextColor[vars.text1_bg]?.[9]}/0 text-white hover:text-black hover:bg-white` : `${themeTextColor[vars.text1_bg]?.[10]}/0 text-black hover:text-white hover:bg-black`}`}>
                                <FaXTwitter size={20}/>
                            </Link>     
                        )}  
                        {vars?.social_linkedin && (
                            <Link href={vars.social_linkedin} target="_blank" className={`h-9 w-9 flex justify-center items-center text-sm rounded-full shadow-md transform transition-all shrink-0 ${vars.light_dark === "dark" ? `${themeTextColor[vars.text1_bg]?.[9]}/0 text-white hover:text-black hover:bg-white` : `${themeTextColor[vars.text1_bg]?.[10]}/0 text-black hover:text-white hover:bg-black`}`}>
                                <FaLinkedinIn size={20}/>
                            </Link>     
                        )}  
                        {vars?.social_instagram && (
                            <Link href={vars.social_instagram} target="_blank" className={`h-9 w-9 flex justify-center items-center text-sm rounded-full shadow-md transform transition-all shrink-0 ${vars.light_dark === "dark" ? `${themeTextColor[vars.text1_bg]?.[9]}/0 text-white hover:text-black hover:bg-white` : `${themeTextColor[vars.text1_bg]?.[10]}/0 text-black hover:text-white hover:bg-black`}`}>
                                <FaInstagram size={20}/>
                            </Link>     
                        )}  
                        {vars?.social_facebook && (
                            <Link href={vars.social_facebook} target="_blank" className={`h-9 w-9 flex justify-center items-center text-sm rounded-full shadow-md transform transition-all shrink-0 ${vars.light_dark === "dark" ? `${themeTextColor[vars.text1_bg]?.[9]}/0 text-white hover:text-black hover:bg-white` : `${themeTextColor[vars.text1_bg]?.[10]}/0 text-black hover:text-white hover:bg-black`}`}>
                                <FaFacebookF size={20}/>
                            </Link>     
                        )}  
                      </div>  
                    </div>

                    <div className="absolute bottom-4 left-0 w-fit h-fit">
                      <div className={`transition-all transform duration-500 px-8 flex flex-wrap gap-x-2 items-center text-xs text-zinc-500 opacity-100`}>
                        <span>All Rights Reserved.</span>
                        <span>Copyright © 2025.</span>
                        <Link href={"https://www.customwaitlist.com/"} target="_blank" title="Visit customwaitlist.com to create a landing page for your project!" className={`py-2 hover:text-orange-400`}>Powered by CustomWaitlist.com</Link>
                        {/* <BrandBadge/>
                        <SpinningText reverse className="text-sm" duration={10} radius={7}>
                            Built with Custom Waitlist . com
                        </SpinningText>     */}
                      </div> 
                    </div>
                </div>
                <div className={`relative h-full w-full sm:h-screen sm:overflow-clip`}>   
                  <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t h-[20vh] z-50 flex justify-end ${vars.light_dark === "dark" ? "from-black" : "from-white"} ${!vars.tweetId && !vars.text4 && "hidden"}`}>
                      <Link href={"https://www.customwaitlist.com/"} target="_blank" title="Visit customwaitlist.com to create a landing page for your project!" className="group translate-y-[114px] -translate-x-6 cursor-pointer relative">
                          <SpinningText reverse className={`text-sm opacity-30 group-hover:opacity-100 transform transition-all ${vars.light_dark === "dark" ? "text-white" : "text-black"}`} duration={220} radius={7}>
                              Built with Custom Waitlist . com {" "}
                          </SpinningText>     
                      </Link>
                        
                  </div>
                  {/* <div className={`w-full h-full md:w-1/3 xl:w-1/2`}> */}
                      <Image
                          src={vars.img ?? "https:/customwaitlist.com/bg3.webp"}
                          alt={vars.title}
                          className={`h-full w-full object-cover`}
                          fill
                          quality={100}
                          sizes="(max-width: 640px) 100vw, (min-width: 640px) 50vw"
                          priority
                          unoptimized
                      />
                  {/* </div> */}
                  <div className={`relative bottom-0 right-0 w-full h-full sm:overflow-y-scroll no-scrollbar transition-all transform p-8 flex flex-col gap-8 items-center bg-gradient-to-b ${vars.light_dark === "dark" ? "from-black/20 via-balck/20 to-black" : "from-white/0 via-white/20 to-white"} ${!vars.tweetId && "justify-end"}`}>
                      {/* <TweetCard id="1678577280489234432" className="shadow-2xl" /> */}
                      {/* <MorphingText texts={texts} /> */}
                      {vars.tweetId && (
                          <div className={`${vars.light_dark} scale-90 md:scale-75 transform transition-all duration-700`}>
                              <Tweet id={vars.tweetId}/>    
                          </div>    
                      )}
                      {vars.text4 && (
                        <div className={`mb-[20vh] w-full h-fit rounded-3xl backdrop-blur-md sm:text-sm ${vars.light_dark === "dark" ? "bg-black/30 text-white border-white/5" : "bg-white/80 text-black border-black/5"} border-4 p-4 shadow-perfect ${themeTextColor[vars.theme]?.[11]}`}>
                            <pre className="whitespace-pre-wrap font-sans">                      
                                {vars?.text4}
                            </pre>
                        </div>
                      )}
                  </div>
                  
              </div>
            </div>
            
        </div>  
    </>
    
);
}

export async function getServerSideProps(context) {
  const { req, params } = context;
  const host = req.headers.host || "";

  const isLocal = host === "localhost:3000";
  const isSub = host.endsWith(".customwaitlist.com") || host.endsWith("localhost:3000");
  const domainKey = isSub ? "subdomain" : "domain";
  const domainValue = isSub ? host.split(".")[0] : host;

  const slug = params.slug || [];
  const path = "/" + slug.join("/");

  let waitlistData = null;
  let vars = null;

  try {
    // Safe handling: use a default value if slug[0] is undefined
    const lookupValue = isLocal ? slug[0] || "www" : domainValue || "www";

    const q = query(
      collection(db, "sites"),
      where(domainKey, "==", lookupValue),
      limit(1)
    );
    const siteSnap = await getDocs(q);
    if (!siteSnap.empty) {
      const siteDoc = siteSnap.docs[0];
      vars = {
        docId: siteDoc.id,
        ...JSON.parse(JSON.stringify(siteDoc.data())),
      };
    }

    const q2 = query(
      collection(db, "waitlist"),
      where(domainKey, "==", lookupValue),
      limit(1)
    );
    const waitlistSnap = await getDocs(q2);
    if (!waitlistSnap.empty) {
      const waitlistDoc = waitlistSnap.docs[0];
      waitlistData = {
        docId: waitlistDoc.id,
        ...JSON.parse(JSON.stringify(waitlistDoc.data())),
      };
    }
  } catch (err) {
    console.error("Error fetching site:", err);
    // Optional: fail gracefully by returning empty props
    vars = null;
    waitlistData = null;
  }

  // If no site exists, optionally return 404, redirect to main site
  if (!vars) {
    return {
      // notFound: true,
      redirect: {
      destination: "https://www.customwaitlist.com",
      permanent: false, // use true if this should be cached as a permanent redirect
    },
    };
  }

  return {
    props: {
      siteData: vars,
      waitlistData,
      slug,
      pagePath: path,
    },
  };
}
