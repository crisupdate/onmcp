import Image from "next/image";
import BrandBadge from "./brandBadge";
// import JoinWL2 from "./Forms/JoinWL2";
// import ContactForm2 from "./Forms/ContactForm2";
import { useEffect, useRef, useState } from "react";
import { IoContract, IoExpand, IoPhonePortraitOutline, IoTvOutline, IoDiamondOutline, IoCloudUploadOutline, IoReaderOutline, IoCheckmark, IoCheckmarkSharp, IoPersonCircleOutline, IoPersonCircle, IoExitOutline, IoGridOutline, IoChevronUp, IoCreateOutline, IoEye, IoEyeOutline, IoBanOutline } from "react-icons/io5";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import QRCodeGenerator from "./QRgen";
import { FaFacebookF, FaInstagram, FaLinkedin, FaLinkedinIn, FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter, FaXTwitter } from "react-icons/fa6";
import { SpinningText } from "./magicui/spinning-text";
import { AvatarCircles } from "./magicui/avatar-circles";
import { SparklesText } from "./magicui/sparkles-text";
import { Tweet } from "react-tweet";
import { IoShareSocialOutline } from "react-icons/io5";
import { avatars, bgImages, premiumImages, tailwindColors, themeTextColor, tweetPostContent, tweetPostContent2 } from "./Welcome";


export default function ListWaitlist({siteData, waitlistData}) {   

    const variables = {
        title: siteData?.title || "",
        logo: siteData?.logo || "https://www.customwaitlist.com/assets/2x/logo.png",
        text1: siteData?.text1 || "",
        text2: siteData?.text2 || "Build Beautiful, Branded Waitlists - Your Way",
        text3: siteData?.text3 || "Join the waitlist for Custom Waitlist, the easiest way to design and launch fully customizable waitlist landing pages with no code needed.",
        text4: siteData?.text4 || ``,
        img: siteData?.img || bgImages[rn],
        text1_bg: siteData?.text1_bg || tailwindColors[rc],
        theme: siteData?.theme || tailwindColors[rc],
        light_dark: siteData?.light_dark || "dark",
        message: siteData?.message || "Thank You for Signing Up!",
        subdomain: siteData?.subdomain || generateSafeUniqueSubdomain("myproject"),
        domain: siteData?.domain || "",
        waitlist_ref: siteData?.waitlist_ref || "",
        social_x: siteData?.social_x || "",
        social_linkedin: siteData?.social_linkedin || "",
        social_instagram: siteData?.social_instagram || "",
        social_facebook: siteData?.social_facebook || "",
        tweetId: siteData?.tweetId || "1957920596391854134",
        premium: siteData?.premium || false
    }

    const [vars, setVars] = useState(variables)
    const [user, setUser] = useState(auth.currentUser);
    const [showShare, setShowShare] = useState(false)
    const [previewSrc, setPreviewSrc] = useState(null);
    const [members, setMembers] = useState([]);
    const [websites, setWebsites] = useState([]);


    const logOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
            console.log("User signed out successfully.");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const PremiumBadge = ({ lg = false, className }) => {
        // console.log(lg)
        return (
            <div className={`w-fit group absolute -top-2 -right-2 rounded-full bg-orange-500 text-white font-sans text-[10px] tracking-tight shadow-sm flex gap-1 items-center px-1 h-5 z-10 transform transition-all duration-1000 cursor-pointer ${className}`}>
                <div className="group-hover:opacity-100 opacity-0 text-[9px] p-1 rounded bg-zinc-600/30 drop-shadow backdrop-blur-lg absolute bottom-2 group-hover:-bottom-11 leading-[10px] h-0 overflow-hidden w-16 right-0 group-hover:h-10">Get Premium to use this element</div>
                <span className={lg ? "" : "hidden"}>Premium</span>
                <IoDiamondOutline size={12}/>
            </div>
        )
    }
    
    const goBilling = async () => {
        // const customerId = "cus_SuALB4wWhrZ2Cd"
        const res = await fetch("/api/userPortal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId }),
        });
        const { url } = await res.json();
        // return url
        window.open(url, "_blank");
    }



const loadMembers = async () => {
    // console.log(`waitlistData`, waitlistData)
    if (!waitlistData?.docId) return;
    const snap = await getDocs(collection(db, "waitlist", waitlistData.docId, "members"));
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMembers(list);
  };

  const loadWebsites = async () => {
    if (!user) return;
    const q = query(
      collection(db, "sites"),
      where("userId", "==", user.uid),
    );
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // console.log(projects)
    setWebsites(projects);
  };


  const deleteMember = async (memberId) => {
    await deleteDoc(doc(db, "waitlist", waitlistData.docId, "members", memberId));
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const deleteSite= async () => {
    await deleteDoc(doc(db, "waitlist", waitlistData.docId));
    await deleteDoc(doc(db, "sites", siteData.docId));
    setWebsites((prev) => prev.filter((s) => s.id !== siteData.docId));
  };

  useEffect(() => {
    if (user) {
      loadMembers();
      loadWebsites();
    }
  }, [user]);

  function formatDateDMY(date) {
    // console.log(date)
    if (!date) return "-";
    const d = new Date(date.seconds * 1000).toLocaleDateString("en-GB") ;
    return d;
    // return [
    //   String(d.getDate()).padStart(2, "0"),
    //   String(d.getMonth() + 1).padStart(2, "0"),
    //   d.getFullYear()
    // ].join("/");
  }


    return (  
    <>
        <div className={`w-screen relative overflow-hidden bg-[url(https://www.customwaitlist.com/bg3.webp)] bg-cover flex flex-col md:flex-row items-center transform transition-all duration-1000 h-full`}>
        <div className={`w-full h-full absolute inset-0 bg-black/80`}></div>
        <div className={`w-full h-16 md:h-8 fixed bottom-0 left-0 bg-gradient-to-t from-black z-20`}></div>
        <div className={`absolute bottom-4 xl:bottom-8 right-0 px-8 z-20 transform transition-all w-fit sm:justify-end items-end flex flex-wrap justify-between gap-x-8 gap-y-4`}>
            <p className="text-zinc-400 text-xs tracking-wide break-words text-right w-full sm:w-fit"><span>All Rights Reserved</span><br/>Copyright © 2025 customwaitlist.com</p>
            <Link href="https://x.com/intent/follow?screen_name=cris_update" target="_blank" rel="noopener noreferrer" data-show-count="false" className="bg-white hover:bg-black rounded-full py-1.5 px-3 text-sm inline-flex items-center gap-2 hover:text-white transition-all transform"><FaXTwitter size={20}/><span className="font-semibold">@cris_update</span></Link>
            <div className="w-fit"><BrandBadge/></div>
        </div> 

            <div className={`w-full sm:w-96 shrink-0 md:max-h-screen overflow-y-auto no-scrollbar scrollbar-hide text-left px-8 relative md:transform md:transition-all md:duration-1000 mb-24 md:mb-0 md:ml-0 h-full py-8`}>
                {/* <div className={`w-full h-full p-4 rounded-3xl shadow-md backdrop-blur-md bg-black/30 text-white relative mb-8`}>
                    <button onClick={() => setStep(2)} className="w-full px-4 py-1 rounded-xl bg-zinc-500 text-white hover:bg-zinc-300 transform transition-all hover:text-black"><span className="drop-shadow-sm">Login</span></button>       
                </div> */}

                <div className="text-white mb-20">
                    <div className="w-fit mb-8">   
                        <Image
                            src={"https://www.customwaitlist.com/assets/2x/logo.png"}
                            className="h-16 w-16 object-contain rounded-full shadow-md"
                            alt={"Custom Waitlist"}
                            height={500}
                            width={500}
                            unoptimized
                        />    
                    </div>
                     <h1 className="text-2xl font-bold w-full mb-6 text-left">
                        Check who signed up to your <span className="inline animate-gradient bg-gradient-to-r from-zinc-400 via-white to-zinc-400 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">Custom Waitlist</span> <span className="hidden md:block">→</span>
                    </h1>    
                    {/* <p className="text-zinc-300 mb-16">Launch faster and start building your audience from day one!</p> */}
 
                </div>
                {websites && websites.length > 1 ? (
                    <div className="mb-8 w-full">
                        <div className="w-full flex gap-4 items-center mb-6 justify-between">
                            <p className="text-zinc-500 text-sm">My projects:</p>
                            <Link 
                                href={"https://customwaitlist.com"}
                                className={`w-fit px-4 py-2 shadow-sm shadow-orange-200/30 backdrop-blur-md bg-black/30 text-orange-200 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600 rounded-full hover:bg-orange-600/50 text-sm`}
                            >
                                Create new waitlist
                            </Link>
                        </div>
                        {websites.map((site, index) => (
                            <Link 
                                key={index}
                                href={`https://${site.domain || `${site.subdomain}.customwaitlist.com`}/list`}
                                // target="_blank"
                                className="mb-3 block"
                            >
                                <div className={`w-full h-fit p-2 group rounded-3xl shadow-good shadow-orange-200 backdrop-blur-md bg-black/30 text-zinc-200 relative break-all overflow-x-auto flex gap-2 items-center hover:bg-white/5 transform transition-all`}>
                                    <Image
                                        src={site.logo || site.img || "https://www.customwaitlist.com/assets/2x/logo.png"}
                                        className="h-16 w-16 object-contain rounded-2xl shadow-md"
                                        alt={"Custom Waitlist"}
                                        height={100}
                                        width={100}
                                        unoptimized
                                    />
                                    <div className="w-full p-2">
                                        <p className="group-hover:text-orange-400">{site.title}</p>
                                        <p className="text-xs line-clamp-1 drop-shadow-sm">
                                            {site.domain || `${site.subdomain}.customwaitlist.com`}
                                        </p>       
                                    </div>
                                     
                                </div>
                            </Link>    
                        ))}
                    </div>
                ) : (
                    <p>No projects found.</p>
                )}
         
                
            </div>
            <div className={`w-full flex justify-center relative md:h-screen overflow-y-auto overflow-x-clip no-scrollbar transform transition-all duration-1000 pt-4 md:py-10`}>
                <div className={`absolute z-50 top-0 right-0 w-full h-fit justify-between md:justify-end gap-4 p-8 md:p-4 flex md:flex-row flex-row`}>
                    {/* {!vars.premium && checkoutUrl && user && (
                        <Link href={checkoutUrl} target={"_blank"} className={`py-2 px-[9px] md:px-4 rounded-full h-10 shadow-md border border-orange-400/50 bg-white/5 backdrop-blur-md text-orange-400 hover:bg-orange-500/5 text-center group w-10 md:w-[154px] overflow-hidden relative`}>
                            <div className="flex gap-2 items-center w-full group-hover:animate-slide-tl group-hover:px-48 group-hover:-ml-48">
                                <span className="hidden sm:block shrink-0">Get Premium</span>
                                <span><IoDiamondOutline size={20}/></span>
                                <span className="hidden group-hover:block shrink-0">50% OFF with Promocode <b className="text-white">"FIRST100"</b> for 100 first premium users!</span>
                            </div>
                        </Link>
                    )} */}
                    <Link href={'https://' + (vars.subdomain ? (vars.subdomain + '.customwaitlist.com') : vars.domain)} target="_blank" rel="noopener noreferrer" className={`py-2 md:px-4 rounded-full shadow-md flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md text-white hover:bg-green-600/30 text-center h-10 w-10 md:w-fit`}><span className="hidden md:block shrink-0">View Page</span><IoEyeOutline size={20}/></Link>
                    <Link href={'https://' + (vars.subdomain ? (vars.subdomain + '.customwaitlist.com') : vars.domain) + '/edit'} rel="noopener noreferrer" className={`py-2 md:px-4 rounded-full shadow-md flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md text-white hover:bg-yellow-600/30 text-center h-10 w-10 md:w-fit`}><span className="hidden md:block shrink-0">Edit Page</span><IoCreateOutline size={20}/></Link>
                    <button onClick={() => {
                        if (window.confirm("Are you sure you want to delete the landing page of this project, including all signed up members? This action cannot be undone.")) {
                            deleteSite();
                            logOut();
                        }
                    }} 
                    className={`py-2 md:px-4 rounded-full shadow-md flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md text-white hover:bg-red-600/30 text-center h-10 w-10 md:w-fit`}><span className="hidden md:block shrink-0">Delete Page</span><IoBanOutline size={20}/></button>
                    {/* <Link href={"https://billing.stripe.com/p/login/5kQ5kD2L76NngVC6Sya7C00"} target="_blank" className="py-1 px-4 rounded-full h-10 shadow-md flex items-center gap-2 backdrop-blur-md border border-white/10 text-zinc-300">Billing</Link> */}
                    {user ? (
                        <div className={`py-1 pl-2.5 md:pl-4 pr-2.5 h-10 rounded-full shadow-md flex items-center gap-2 backdrop-blur-md text-white overflow-hidden relative group`}>
                            <button onClick={logOut} className="absolute top-0 left-0 w-full translate-y-[-44px] group-hover:translate-y-0 transform transition-all h-full bg-white text-black text-sm flex items-center justify-center gap-2 duration-300">
                                <span className="hidden md:block shrink-0">Log Out</span>
                                <IoExitOutline size={20}/>
                            </button>
                            <div className="text-right hidden md:block pb-1.5">
                                <span className="shrink-0 text-xs">My account:</span>
                                <p className="-mt-0.5 text-[11px]">{user.email}</p>
                            </div>
                            <IoPersonCircleOutline size={20} className=""/>
                        </div>
                    ) : ( null
                        // <button onClick={() => goBilling()} className={`py-1 pl-2.5 md:pl-4 pr-2.5 rounded-full h-10 shadow-md flex items-center gap-2 bg-gradient-to-br from-zinc-400 via-white to-zinc-400 hover:from-white hover:to-white transform transition-all text-black`}>
                        //     <span className="hidden md:block shrink-0">{hiName ? hiName : "Log In"}</span>
                        //     <IoPersonCircle size={20}/>
                        // </button>
                    )}  
                </div>
                <div className={`relative h-fit md:h-full mt-24 mb-40 mx-4 md:mt-12 transform transition-all duration-1000 overflow-y-auto border-zinc-800 shadow-perfect ${themeTextColor[vars.theme]?.[11]} backdrop-blur-md bg-black/30 rounded-3xl border-4                 
                    w-full md:h-[calc(100vh-280px)] md:w-[calc(100vw-416px)] md:mr-8
                `}>  
                    <div className="h-full relative overflow-auto no-scrollbar">
                        {/* <div id="share-card" className={`absolute bottom-4 right-4 z-[100] transform transition-all duration-700`}>
                            <div className={`bg-opacity-20 backdrop-blur-md border-2 border-white/30 w-fit h-fit rounded-3xl shadow-md flex flex-col items-center relative ${themeTextColor[vars.theme]?.[8]}`}>
                            {!showShare && (<button onClick={() => setShowShare(true)} className={`px-4 flex gap-1 items-center py-1 text-zinc-200 `}><span>Share</span><IoShareSocialOutline /></button>)}
                            <div className={`flex justify-between gap-2 items-center absolute top-0 right-0 px-2 pt-1.5 w-full ${!showShare && "hidden"}`}>
                                <p className="text-white font-sens pl-2">Share!</p>
                                <button onClick={() => setShowShare(false)} className={`bg-white text-red-800 rounded-full px-3 py-0.5 text-xs font-semibold`}>Close</button>
                            </div>
                                <div className={`w-40 ${!showShare && "hidden"} mt-2 mx-2`}>
                                    <QRCodeGenerator thx={true} qrText={`https://${vars.domain || `${vars.subdomain}.customwaitlist.com`}`} img={vars.img || "https://www.customwaitlist.com/bg3.webp"} btnColor={themeTextColor[vars.theme]?.[8]} previewSrc={previewSrc} setPreviewSrc={setPreviewSrc}/>  
                                </div>
                            </div>
                        </div> */}
                        <div className={`w-full h-full rounded-[20px]`}>                  
                            <div className={`absolute top-0 right-[25%] translate-y-[-80%] h-1/2 w-1/2 opacity-25 rounded-full blur-3xl z-[-10] ${themeTextColor[vars.theme]?.[8]}`} ></div>
                            <div className={`w-full relative h-full p-8 text-zinc-200`}>
                                <div className={`absolute bottom-0 left-[-30%] translate-y-[30%] h-1/2 w-1/2 opacity-25 rounded-full blur-3xl z-[-10] ${themeTextColor[vars.theme]?.[8]}`}></div>
                                <div className="w-full flex gap-8 justify-between items-center">
                                    <div className="w-fit flex gap-4 items-center mb-8">   
                                        <Image
                                            src={vars.logo}
                                            className="h-12 w-auto object-contain"
                                            height={500}
                                            width={500}
                                            alt={`${vars.title} Logo`}
                                            unoptimized
                                        />    
                                        <SparklesText sparklesCount={7} className={"font-light text-2xl md:text-4xl"}>
                                            {vars.title}
                                        </SparklesText>
                                    </div>
                                    {members.length > 3 && (
                                        <AvatarCircles text={`45 Signed People!`} avatarUrls={avatars} />                                       
                                    )}
                                </div>
                                <div className="mb-8">
                                    <pre className="whitespace-pre-wrap font-sans font-medium text-zinc-500">List of people who signed up to your waitlist and are interested in your product:</pre>
                                </div> 
                                {members.length > 0 ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-zinc-800 text-zinc-500 text-xs md:text-sm">
                                                <th className="text-left p-2">Name</th>
                                                <th className="text-left p-2">Email</th>
                                                <th className="text-center p-2">Joined Date</th>
                                                <th className="text-right p-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {members.map((member) => (
                                            <tr key={member.id} className="border-b border-zinc-800 text-zinc-200 hover:bg-gradient-to-r hover:from-white/5 transition-all text-sm md:text-base">
                                                <td className="p-2">{member.name}</td>
                                                <td className="p-2">{member.email}</td>
                                                <td className="p-2 text-center">{formatDateDMY(member?.joinedAt)}</td>
                                                <td className="p-2 flex justify-end">
                                                    <button onClick={() => deleteMember(member.id)} className="text-red-500 hover:bg-red-500/20 translate-x-3 hover:translate-x-0 px-3 py-1 rounded-full transition-transform text-sm">Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No members found.</p>
                                )}                    
                            </div>
           
                        </div>
                    </div>
                    
                </div>     
            </div>
            
        </div>
    </>
    )
}