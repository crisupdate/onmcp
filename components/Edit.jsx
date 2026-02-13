import Image from "next/image";
import BrandBadge from "./brandBadge";
import JoinWL2 from "./Forms/JoinWL2";
// import ContactForm2 from "./Forms/ContactForm2";
import { useEffect, useRef, useState } from "react";
import { IoContract, IoExpand, IoPhonePortraitOutline, IoTvOutline, IoDiamondOutline, IoCloudUploadOutline, IoReaderOutline, IoCheckmark, IoCheckmarkSharp, IoPersonCircleOutline, IoPersonCircle, IoExitOutline, IoGridOutline, IoChevronUp } from "react-icons/io5";
import {
  collection,
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
import { signOut } from "firebase/auth";
import QRCodeGenerator from "./QRgen";
import { FaFacebookF, FaInstagram, FaLinkedin, FaLinkedinIn, FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter, FaXTwitter } from "react-icons/fa6";
import { SpinningText } from "./magicui/spinning-text";
import { AvatarCircles } from "./magicui/avatar-circles";
// import { useRouter } from "next/router";
import { SparklesText } from "./magicui/sparkles-text";
import { Tweet } from "react-tweet";
import { IoShareSocialOutline } from "react-icons/io5";
import { avatars, bgImages, premiumImages, tailwindColors, themeTextColor, tweetPostContent, tweetPostContent2 } from "./Welcome";


export default function EditWaitlist({siteData}) {   
    const rn = Math.floor(Math.random() * bgImages.length);
    const rc = Math.floor(Math.random() * tailwindColors.length);

    function generateSafeUniqueSubdomain(base) {
        const timePart = Date.now().toString().slice(-5);
        const randPart = Math.floor(100 + Math.random() * 900); // 3-digit random
        return `${base}${timePart}${randPart}`;
    }

    let tweetText = "";
    let tweetText2 = "";
    let tweetUrl = "";

    // console.log("siteData in EditWaitlist:", siteData)

    const variables = {
        title: siteData?.title || "",
        logo: siteData?.logo || "https://www.customwaitlist.com/assets/2x/logo.png",
        text1: siteData?.text1 || "",
        text2: siteData?.text2 || "",
        text3: siteData?.text3 || "",
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
        tweetId: siteData?.tweetId || "",
        premium: siteData?.premium || false,
        status: siteData?.status || "draft"
    }

    const [demo, setDemo] = useState(true);
    const [vars, setVars] = useState(variables)
    const [pc, setPc] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [step, setStep] = useState(1)
    const [errMsg, setErrMsg] = useState("")
    const [domainStatus, setDomainStatus] = useState("");
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [waitlistCreated, setWaitlistCreated] = useState(null);
    const [loadingProcess, setLoadingProcess] = useState(false);
    const [domainAddedToVercel, setDomainAddedToVercel] = useState(false);
    const [validatedSubdomain, setValidatedSubdomain] = useState("");
    const [validatedDomain, setValidatedDomain] = useState("");
    // const [subdomainNote, setSubdomainNote] = useState("");
    const [user, setUser] = useState(auth.currentUser);
    const [showShare, setShowShare] = useState(false)
    const [previewSrc, setPreviewSrc] = useState(null);
    const [checkoutUrl, setCheckoutUrl] = useState(null);

    const rt = Math.floor(Math.random() * tweetPostContent.length) //random tweet
    tweetText = tweetPostContent(vars.title)[rt]
    tweetUrl = `https://${vars.domain || `${vars.subdomain}.customwaitlist.com`}` ?? 'https://customwaitlist.com'
    tweetText2 = tweetPostContent2(vars.title)[rt]


    useEffect(() => {
        const largeScreen = window.innerWidth > 640;
        setIsLargeScreen(largeScreen);
        setPc(largeScreen);
    }, []);

    useEffect(() => {
        // console.log({ waitlistRef: vars.waitlist_ref })
        async function createSession() {
        const res = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ waitlistRef: vars.waitlist_ref, email: user.email || "", domain: vars.domain, subdomain: vars.subdomain }),
        });
        const data = await res.json();
        setCheckoutUrl(data.url);
        }
        if (vars.waitlist_ref) {
            createSession();
        }
        // console.log("checkoutUrl", checkoutUrl)
    }, [vars.waitlist_ref]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVars((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files?.[0]) {
            const file = files[0];
            const url = URL.createObjectURL(file); 
            setVars((prev) => ({
            ...prev,
            [`${name}File`]: file,     
            [`${name}Url`]: url,   
            [`${name}`]: url   
            }));
        }
    };

    const addVercelDomain = async () => {
        const res = await fetch('/api/addDomain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: vars.domain }),
        });

        const data = await res.json();
        console.log("Domain response:", data);
        if (res.ok) {
            setDomainStatus('✅ Domain added. Please configure your DNS and wait a few minutes.');
            setDomainAddedToVercel(true);
        } else {
            setDomainStatus('Error: ' + JSON.stringify(data.error.error.message));
            setDomainAddedToVercel(false);
        }
    }

    const validateSubdomain = async (subdomain) => {
        if (subdomain !== siteData?.subdomain) {
            if (validatedSubdomain !== subdomain) {
                try {
                    setValidatedSubdomain(subdomain);
                    const res = await fetch('/api/validateSubdomain', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ subdomain }),
                    });

                    const data = await res.json();

                    if (data.exists) {
                        // setSubdomainNote("✖ Subdomain already taken");
                        setErrMsg("Subdomain already taken. Please choose another.");
                        return false;
                    } else {
                        // setSubdomainNote("✔ Subdomain is available");
                        setStep(4); 
                        setDomainStatus(""); 
                        setCurrentStep(4);
                        setErrMsg("");
                        return true;
                    }
                } catch (error) {
                    setErrMsg('Error validating subdomain:', error);
                    return false;
                }    
            }
        }
        setStep(4); 
        setDomainStatus(""); 
        setCurrentStep(4);
        setErrMsg("");
        return true;
    };

    const validateDomain = async (domain) => {
        if (validatedDomain !== domain) {
            try {
                setValidatedDomain(domain);
                const res = await fetch('/api/validateDomain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ domain }),
                });

                const data = await res.json();
                console.log("Domain validation response:", data);

                if (data.exists) {
                    // setSubdomainNote("✖ Subdomain already taken");
                    setErrMsg("Domain already in use on other waitlist. Please choose another.");
                    return false;
                } else {
                    // setSubdomainNote("✔ Subdomain is available");
                    if (!domainAddedToVercel) {
                        addVercelDomain(); 
                    }

                    setStep(4); 
                    setCurrentStep(4)        
                    setDomainStatus(""); 
                    setErrMsg("");
                    return true;
                }
            } catch (error) {
                setErrMsg('Error validating domain:', error);
                return false;
            }
        }
        setStep(4); 
        setCurrentStep(4)        
        setDomainStatus(""); 
        setErrMsg("");
        return true;
    };

    const submitToSave = async () => {
        setLoadingProcess(true);
            
        if (vars.subdomain && vars.subdomain !== siteData?.subdomain) {
            const isSubdomainValid = validateSubdomain(vars.subdomain);
            if (!isSubdomainValid) return
        } else if (vars.domain && vars.domain !== siteData?.domain) {
            const isDomainValid = validateDomain(vars.domain);
            if (!isDomainValid) return
        }

        try {            
            let logoUrl = vars.logo;
            let imgUrl = vars.img;

            if (vars.logoFile) {
                const storageRef = ref(storage, `logos/${vars.logoFile.name}`);
                await uploadBytes(storageRef, vars.logoFile);
                logoUrl = await getDownloadURL(storageRef);
            }

            if (vars.imgFile) {
                const storageRef = ref(storage, `assets/${vars.imgFile.name}`);
                await uploadBytes(storageRef, vars.imgFile);
                imgUrl = await getDownloadURL(storageRef);
            }

            const { logoFile, imgFile, ...cleanVars } = vars;
            console.log(logoFile, imgFile)

            if (siteData.waitlist_ref && (vars.subdomain !== siteData?.subdomain || vars.domain !== siteData?.domain)) {
                const docRef = doc(db, "waitlist", siteData.waitlist_ref);

                await updateDoc(docRef, {
                    subdomain: vars.subdomain,
                    domain: vars.domain
                });
            }
            

            setVars(prev => ({ ...prev, img: imgUrl, logo: logoUrl }))
            // console.log("Document from sites written with ID:", docRef2.id);

                const q = query(
                    collection(db, "sites"),
                    where("waitlist_ref", "==", siteData.waitlist_ref)
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docRef = querySnapshot.docs[0].ref; // first (and only) match

                    await updateDoc(docRef, {
                        ...cleanVars,
                        logo: logoUrl || vars.logo,      
                        img: imgUrl || vars.img,   
                        status: "public",
                        lastEdit: serverTimestamp(),
                    });  

                    setWaitlistCreated(docRef.id)
                }

        } catch (error) {
            console.error("Error adding document: ", error);
        }
        setLoadingProcess(false);
        setIsSubmitted(true);
        setCurrentStep(4);
        setStep(4);

        setTimeout(() => {
            setIsSubmitted(false);
        }, 4000);
    };

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

    let includesPremiumelements = vars.domain || vars.light_dark === "dark" || vars.img.includes("/bg/premium/bg")
    
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

    return (  
    <>
        <div className={`w-screen relative overflow-hidden bg-[url(https://www.customwaitlist.com/bg3.webp)] bg-cover flex flex-col-reverse md:flex-row items-center transform transition-all duration-1000 h-full`}>
        <div className={`w-full h-full absolute inset-0 bg-black/80`}></div>
        <div className={`w-full h-16 md:h-8 fixed bottom-0 left-0 bg-gradient-to-t from-black z-20 transition-all transform duration-1000 ${!demo ? "opacity-0 translate-y-16" : "opacity-100 translate-y-0"}`}></div>
        <div className={`absolute bottom-4 xl:bottom-8 right-0 px-8 z-20 transform transition-all w-fit sm:justify-end items-end flex flex-wrap justify-between gap-x-8 gap-y-4 ${demo ? " translate-y-0 duration-1000" : "translate-y-20 duration-500"}`}>
            <p className="text-zinc-400 text-xs tracking-wide break-words text-right w-full sm:w-fit"><span>All Rights Reserved</span><br/>Copyright © 2025 customwaitlist.com</p>
            <Link href="https://x.com/intent/follow?screen_name=cris_update" target="_blank" rel="noopener noreferrer" data-show-count="false" className="bg-white hover:bg-black rounded-full py-1.5 px-3 text-sm inline-flex items-center gap-2 hover:text-white transition-all transform"><FaXTwitter size={20}/><span className="font-semibold">@cris_update</span></Link>
            <div className="w-fit"><BrandBadge/></div>
        </div> 

            <div className={`w-full sm:w-96 shrink-0 md:max-h-screen overflow-y-auto no-scrollbar scrollbar-hide text-left px-8 relative md:transform md:transition-all md:duration-1000 -translate-y-10 md:translate-y-0 mb-24 md:mb-0 ${demo ? "md:ml-0 h-full py-8" : "h-0 md:h-full py-0 md:py-8 sm:ml-[-384px]"}`}>
                {/* <div className={`w-full h-full p-4 rounded-3xl shadow-md backdrop-blur-md bg-black/30 text-white relative mb-8`}>
                    <button onClick={() => setStep(2)} className="w-full px-4 py-1 rounded-xl bg-zinc-500 text-white hover:bg-zinc-300 transform transition-all hover:text-black"><span className="drop-shadow-sm">Login</span></button>       
                </div> */}

                <div className="text-white mb-8">
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
                     <h1 className="text-2xl font-bold w-full mb-6 text-center">
                        Edit your <span className="inline animate-gradient bg-gradient-to-r from-zinc-400 via-white to-zinc-400 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">Custom Waitlist</span>
                    </h1>    
                    {/* <p className="text-zinc-300 mb-16">Launch faster and start building your audience from day one!</p> */}
                    <div className="w-full flex justify-between items-center px-8 font-mono">
                        <button disabled={currentStep < 1} onClick={() => {setStep(1); if (currentStep === 4) {setCurrentStep(3); setWaitlistCreated("")}}} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${step === 1 ? "bg-white text-black" : "bg-white/25"}`}>1</button>
                        <span className="border-t w-full border-white/10"/>
                        <button disabled={currentStep < 2} onClick={() => {setStep(2); if (currentStep === 4) {setCurrentStep(3); setWaitlistCreated("")}}} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${step === 2 ? "bg-white text-black" : "bg-white/25"}`}>2</button>
                        <span className="border-t w-full border-white/10"/>
                        <button disabled={currentStep < 3} onClick={() => {setStep(3); if (currentStep === 4) {setCurrentStep(3); setWaitlistCreated("")}}} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${step === 3 ? "bg-white text-black" : "bg-white/25"}`}>3</button>
                        {/* <span className="border-t w-full border-white/10"/>
                        <button disabled={currentStep < 4} onClick={() => {setStep(4); if (currentStep === 5) {setCurrentStep(4)}}} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${step === 4 ? "bg-white text-black" : "bg-white/25"}`}>4</button> */}
                        <span className={`border-t w-full border-white/10 ${currentStep !== 4 && 'hidden'}`}/>
                        {currentStep === 4 && (
                            <button onClick={() => setStep(4)} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${waitlistCreated ? "bg-green-600" : "bg-orange-600/25"}`}><IoCheckmarkSharp/></button>
                        )}
                    </div>
                </div>
                <div className={`w-full h-full py-4 mb-12 rounded-3xl shadow-good shadow-orange-200 backdrop-blur-md bg-black/30 text-white relative transform transition-all duration-1000 ${demo ? "translate-y-0" : "translate-y-[20%]"}`}>
                    {step === 1 && (
                        <>       
                            <div className="mb-3 px-4">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Title:</label>
                                <input
                                    name={"title"}
                                    value={vars.title}
                                    onChange={(e) => {handleInputChange(e); setVars(prev => ({ ...prev, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "")}))}}
                                    className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                />
                            </div>
                            <label className="block text-sm font-medium text-zinc-500 px-4">Background:</label>
                            <div className="w-full flex items-center gap-3 mb-4 md:text-sm mt-1 px-4">
                                <button onClick={() => setVars(prev => ({ ...prev, light_dark: "light" }))} className={`w-full text-xs rounded-xl py-1.5 font-semibold px-4 ${vars.light_dark === "dark" ? "bg-white/5 text-white" : "bg-white text-black"}`}>Light</button>
                                <button onClick={() => setVars(prev => ({ ...prev, light_dark: "dark" }))} className={`w-full text-xs rounded-xl py-1.5 font-semibold px-4 relative ${vars.light_dark === "light" ? "bg-white/5 text-white" : "bg-white text-black"}`}>Dark{!vars.premium && (<PremiumBadge lg={true}/>)}</button>
                            </div>  
                            <div className="mb-3 px-4">
                                <label className="block text-sm font-medium text-zinc-500">Upload Logo:</label>
                                <input 
                                    type="file" 
                                    name="logo" 
                                    accept=".png, .jpg, .jpeg, .svg, .gif" 
                                    onChange={handleFileChange} 
                                    className="mt-1 w-full md:text-sm bg-white/5 rounded-xl outline-none file:bg-white/10 file:rounded-lg file:border-none cursor-pointer p-1 file:text-zinc-400 file:cursor-pointer" 
                                />
                            </div>

                            <div className="mb-3 relative">
                                <label className="block text-sm font-medium text-zinc-500 px-4 mb-1">Upload Image:</label>
                                <div className="w-full h-4 bg-gradient-to-b from-zinc-800 absolute top-6 left-0 z-20"></div>
                                <div className="w-full h-4 bg-gradient-to-t from-zinc-800 absolute bottom-0 left-0 z-20"></div>
                                <div className="h-[200px] overflow-y-auto no-scrollbar px-4 py-2 w-full relative">
                                    <div className="w-full grid grid-cols-5 gap-2">
                                        <div className="col-span-1 bg-white/5 aspect-square relative rounded-xl overflow-hidden cursor-pointer shadow border border-black/0 hover:border-white/50 flex items-center justify-center">
                                            <IoCloudUploadOutline size={24} className="w-full h-full p-4 absolute top-0 left-0 z-[-1]"/>
                                            <input 
                                                type="file" 
                                                name="img" 
                                                accept=".png, .jpg, .jpeg, .svg, .gif" 
                                                onChange={handleFileChange}
                                                className="file:h-20 file:w-20 file:text-xs file:opacity-0 file:cursor-pointer opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        {bgImages.map((img, index) => (
                                            <div key={index} className={`col-span-1 aspect-square rounded-[14px] relative overflow-hidden cursor-pointer shadow border-2 ${vars?.img === img ? " border-white" : "border border-white/0 hover:border-white/50"}`} onClick={() => setVars(prev => ({ ...prev, img }))}>
                                                <div className="absolute inset-0 w-full h-full z-10"/>
                                                <Image
                                                    src={img}
                                                    fill
                                                    // unoptimized
                                                    alt={`Background ${index + 1}`}
                                                    sizes="(max-width: 640px) 100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw"
                                                    className="rounded-xl"
                                                    unoptimized
                                                />
                                            </div>
                                        ))}
                                        {premiumImages.map((img, index) => (
                                            <div key={index} className={`col-span-1 aspect-square rounded-[14px] relative shadow border-2 ${vars?.img === img ? " border-white" : "border border-white/0 hover:border-white/50"}`}>
                                                <div className={`w-full h-full overflow-hidden rounded-xl cursor-pointer`} onClick={() => setVars(prev => ({ ...prev, img }))}>
                                                    <div className="absolute inset-0 w-full h-full z-10"/>
                                                    {!vars.premium && (
                                                        <PremiumBadge/>    
                                                    )}
                                                    <Image
                                                        src={img}
                                                        fill
                                                        alt={`Background ${index + 1}`}
                                                        sizes="(max-width: 640px) 100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw"
                                                        className="rounded-xl"
                                                        unoptimized
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 px-4">
                                <label className="block text-sm font-medium text-zinc-500">Select Theme Color:</label>
                                <select
                                    name="theme"
                                    value={vars.theme}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 outline-none text-white"
                                >
                                    <option value="" disabled className="text-black">Select</option>
                                    <option value="neutral" className="text-black">Neutral</option>
                                    <option value="stone" className="text-black">Stone</option>
                                    <option value="red" className="text-black">Red</option>
                                    <option value="orange" className="text-black">Orange</option>
                                    <option value="amber" className="text-black">Amber</option>
                                    <option value="yellow" className="text-black">Yellow</option>
                                    <option value="lime" className="text-black">Lime</option>
                                    <option value="green" className="text-black">Green</option>
                                    <option value="emerald" className="text-black">Emerald</option>
                                    <option value="teal" className="text-black">Teal</option>
                                    <option value="cyan" className="text-black">Cyan</option>
                                    <option value="sky" className="text-black">Sky</option>
                                    <option value="blue" className="text-black">Blue</option>
                                    <option value="indigo" className="text-black">Indigo</option>
                                    <option value="violet" className="text-black">Violet</option>
                                    <option value="purple" className="text-black">Purple</option>
                                    <option value="fuchsia" className="text-black">Fuchsia</option>
                                    <option value="pink" className="text-black">Pink</option>
                                    <option value="rose" className="text-black">Rose</option>
                                </select>
                            </div> 
                            <div className="px-4">
                                <button onClick={() => {setStep(2); setCurrentStep(2)}} className="w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black"><span className="drop-shadow-sm">Next Step</span></button>       
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div className="mb-3 px-4">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Intro Text:</label>
                                <textarea
                                    name={"text1"}
                                    value={vars.text1}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                    rows={1}
                                />
                            </div>

                            <div className="mb-3 px-4">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Header Text:</label>
                                <textarea
                                    name={"text2"}
                                    value={vars.text2}
                                    onChange={handleInputChange}
                                    placeholder="Build Beautiful, Branded Waitlists - Your Way"
                                    className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                    rows={2}
                                />
                            </div>

                            <div className="mb-3 px-4">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Call to action:</label>
                                <textarea
                                    name={"text3"}
                                    value={vars.text3}
                                    onChange={handleInputChange}
                                    placeholder="Join the waitlist for Custom Waitlist, the easiest way to design and launch fully customizable waitlist landing pages with no code needed."
                                    className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                    rows={2}
                                />
                            </div>

                             <div className="mb-3 px-4">
                                <label className="block text-sm font-medium text-zinc-500">After Submit Message:</label>
                                <textarea
                                    name="message"
                                    value={vars.message}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                    rows={1}
                                />
                            </div>

                             <div className="mb-3 px-4">
                                <label className="text-sm font-medium text-zinc-500 flex gap-1 items-center"><FaXTwitter size={14}/><span>Post ID:</span></label>
                                <input
                                    name="tweetId"
                                    value={vars.tweetId}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                />
                            </div>

                            <div className="mb-6 px-4">
                                <label className="block text-sm font-medium capitalize text-zinc-500">More Info Text:</label>
                                <textarea
                                    name={"text4"}
                                    value={vars.text4}
                                    onChange={handleInputChange}
                                    placeholder="Some details about the features, launch date, etc."
                                    className="mt-1 w-full rounded-xl px-2 py-1 text-sm md:text-xs bg-white/5 no-scrollbar outline-none"
                                    rows={7}
                                />
                            </div>

                            <div className="px-4">
                                <button onClick={() => {setStep(3); setCurrentStep(3)}} className="w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black"><span className="drop-shadow-sm">Next Step</span></button>       
                            </div>
                        </>
                    )}
                    {step === 3 && (
                        <>    
                            <div className="mb-3 px-4">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Subdomain:</label>
                                <div className="w-full flex items-center gap-2">
                                    <input
                                        type="text"
                                        name={"subdomain"}
                                        placeholder="title"
                                        value={vars.subdomain}
                                        required={!vars.domain}
                                        onChange={(e) => {
                                            const input = e.target.value.toLowerCase();
                                            const validSubdomain = input
                                            .replace(/[^a-z0-9-]/g, "") // remove invalid characters
                                            .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens

                                            // if (!/^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/.test(vars.subdomain)) {
                                            //     setErrMsg("Subdomain must be 3–63 characters, lowercase, no spaces, no special characters."); 
                                            // }

                                            // limit to 63 characters
                                            if (validSubdomain.length <= 63) {
                                                handleInputChange({
                                                    target: { name: "subdomain", value: validSubdomain },
                                                });
                                            } else {
                                                setErrMsg("Subdomain is too long. Maximum 63 characters.");
                                            }
                                            setVars((prev) => ({ ...prev, domain: "" }));
                                        }}
                                        className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                    />    
                                    <p className="md:text-sm tracking-wide">.customwaitlist.com</p>
                                </div>
                                {/* {subdomainNote && <p className="text-xs mt-0.5 text-orange-400">{subdomainNote}</p>} */}
                            </div>

                            <div className="mb-6 relative px-4">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Custom Domain:</label>
                                <div className="w-full relative">
                                    {!vars.premium && (
                                        <PremiumBadge lg={true}/>
                                    )}
                                    <input
                                        type="text"
                                        name={"domain"}
                                        placeholder="example.com"
                                        value={vars.domain}
                                        required={!vars.subdomain}
                                        onChange={(e) => {
                                            const input = e.target.value.toLowerCase();
                                            const cleaned = input.replace(/[^a-z0-9.-]/g, "");
                                            handleInputChange({
                                                target: { name: "domain", value: cleaned },
                                            });
                                            setVars(prev => ({ ...prev, subdomain: "" }))
                                        }}
                                        className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                    />
                                </div>
                                
                            </div>
                          
                            {domainStatus && (     
                                <>
                                    <div className="mt-2 p-2 bg-white/10 rounded-xl text-xs mb-6">
                                        {domainStatus.startsWith("Error") ? (<p className="text-sm mb-2 text-red-500">{domainStatus}</p>) : (
                                            <>
                                                <p className="text-sm mb-4">Please set up your domain DNS on hosting platform, by adding:</p>
                                                <table className="w-full font-mono">
                                                    <thead>
                                                        <tr className="border-b border-white/30">
                                                            <th className="pb-1">Type</th>
                                                            <th className="pb-1 text-center">Name</th>
                                                            <th className="pb-1 text-right">Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="border-b border-white/10">
                                                            <td className="py-2">A</td>
                                                            <td className="text-center py-2 font-sans font-light text-sm pb-2">@</td>
                                                            <td className="text-right py-2">76.76.21.21</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="pt-2">CNAME</td>
                                                            <td className="text-center pt-2 font-sans font-light text-sm pb-1">www</td>
                                                            <td className="text-right pt-2">cname.vercel-dns.com</td>
                                                        </tr>
                                                    </tbody>
                                                </table>    
                                            </>
                                        )}
                                    </div>  
                                </>
                            )}

                            <div id="socials" className="mt-4 mb-6">
                                <div className="mb-2 px-4">
                                    <label className="text-sm font-medium capitalize text-zinc-500 flex gap-1 items-center">Social Medias</label>
                                    <div className="w-full flex items-center gap-2 mt-1">
                                        <FaSquareXTwitter color="white" size={24}/>
                                        <input
                                            type="text"
                                            name={"social_x"}
                                            placeholder="https://x.com/username"
                                            value={vars.social_x}      
                                            onChange={handleInputChange}                    
                                            className="w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                        />    
                                    </div>
                                </div>
                                <div className="mb-2 px-4">
                                    <div className="w-full flex items-center gap-2 mt-1">
                                        <FaLinkedin color="white" size={24}/>
                                        <input
                                            type="text"
                                            name={"social_linkedin"}
                                            placeholder="https://www.linkedin.com/company/id"
                                            value={vars.social_linkedin}      
                                            onChange={handleInputChange}                         
                                            className="w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                        />    
                                    </div>
                                </div>
                                <div className="mb-2 px-4">
                                    <div className="w-full flex items-center gap-2 mt-1">
                                        <FaSquareInstagram color="white" size={24}/>
                                        <input
                                            type="text"
                                            name={"social_instagram"}
                                            placeholder="https://www.instagram.com/username"
                                            value={vars.social_instagram}     
                                            onChange={handleInputChange}                          
                                            className="w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                        />    
                                    </div>
                                </div>
                                <div className="mb-2 px-4">
                                    <div className="w-full flex items-center gap-2 mt-1">
                                        <FaSquareFacebook color="white" size={24}/>
                                        <input
                                            type="text"
                                            name={"social_facebook"}
                                            placeholder="https://www.facebook.com/username"
                                            value={vars.social_facebook}      
                                            onChange={handleInputChange}                         
                                            className="w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                        />    
                                    </div>
                                </div>

                            </div>

                            <div className="px-4">
                                {vars.domain && (
                                    <button onClick={() => validateDomain(vars.domain)} disabled={!(!!vars.domain ^ !!vars.subdomain)} className="w-full px-4 py-2 rounded-xl bg-orange-300 text-black hover:bg-orange-500 transform transition-all hover:text-white disabled:opacity-50 disabled:hover:transition-none disabled:hover:bg-zinc-300 disabled:hover:text-black"><span className="drop-shadow-sm">Confirm</span></button>       
                                )}
                                {vars.subdomain && (
                                    <button onClick={() => validateSubdomain(vars.subdomain)} disabled={!(!!vars.domain ^ !!vars.subdomain)} className="w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black disabled:opacity-50 disabled:hover:transition-none disabled:hover:bg-zinc-300 disabled:hover:text-blac"><span className="drop-shadow-sm">Continue</span></button>       
                                )}
                            </div>

   
                        </>
                    )}

                    {step === 4 && (
                        <div className="px-4">    
                            {waitlistCreated ? (
                                <div className="text-center w-full mb-2">
                                    <p className="text-2xl font-bold w-full">Congratulations!</p> 
                                    <p className="text-lg mb-3">Your landing page is ready!</p>
                                    <div className="w-full">
                                        <QRCodeGenerator thx={false} qrText={`https://${vars.domain || `${vars.subdomain}.customwaitlist.com`}`} img={vars.img || "https://www.customwaitlist.com/bg3.webp"} btnColor={vars.light_dark === "dark" ? themeTextColor[vars.theme]?.[8] : themeTextColor[vars.theme]?.[7]} previewSrc={previewSrc} setPreviewSrc={setPreviewSrc}/>  
                                        <a
                                            href={`https://x.com/intent/tweet?text=${encodeURIComponent(tweetText2)}&url=${encodeURIComponent(tweetUrl)}&hashtags=${encodeURIComponent("Innovation,CustomWaitlist,Startups,ComingSoon,Trending")}&related=${encodeURIComponent("cris_update")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`mt-4 px-4 py-2 h-fit w-full rounded-full transition font-semibold inline-flex justify-center items-center gap-1 shrink-0 ${vars.light_dark === "dark" ? "bg-white text-black hover:bg-white/80" : "bg-black text-white hover:bg-black/80"}`}
                                            >
                                            <span>Share on </span>
                                            <FaXTwitter size={20}/>
                                        </a>  
                                        <Link
                                            href={`https://${vars.domain || `${vars.subdomain}.customwaitlist.com`}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 rounded-full w-full text-center text-zinc-200 hover:text-orange-600 transition-all"
                                        >
                                            <p className="text-sm line-clamp-1 drop-shadow-sm break-words">
                                                {vars.domain || `${vars.subdomain}.customwaitlist.com`}
                                            </p>
                                        </Link>
                                      
                                    </div>  
                                </div>
                            ) : (
                                <div className="w-full">
                                    <div className="text-sm text-zinc-200 mb-4">
                                        <p className="font-bold text-lg mb-2 text-center">
                                            Your landing page looks amazing! 🎉
                                        </p>  
                                        {!vars.premium && includesPremiumelements && (
                                            <>
                                                <p className="text-xs text-zinc-30 mb-2">We noticed you’ve added some Premium features (like custom themes, premium images, or custom domain support).</p> 
                                                <p className="text-xs text-zinc-30 mb-2">To publish your page as it is now, you’ll need to upgrade to Premium.</p>
                                                <p className="text-xs text-zinc-400">If you’d prefer to stay on the free plan, you can simply go back and remove the Premium elements to publish for free.</p>                                        
                                            </>
                                        )} 
                                    </div>
                                    
                                    <button disabled={loadingProcess || (includesPremiumelements && !vars.premium)}  onClick={() => {if (user) submitToSave(user.uid)}} className="w-full px-4 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600">
                                        {loadingProcess ? (
                                            <div className="flex gap-4 items-center justify-center w-full drop-shadow-sm">
                                                <span className="shrink-0">Publishing...</span>
                                                <div className="w-1 h-6 rounded-full bg-white animate-spin duration-1000"></div>
                                            </div>
                                        ) : ( 
                                            <span className="drop-shadow-sm">
                                                {isSubmitted ? "Published" : "Update & Publish"}
                                            </span>
                                        )}
                                    </button> 
                                    {!vars.premium && vars.waitlist_ref && checkoutUrl && user && (
                                        <>                               
                                            <div className="w-full relative">
                                                <Link href={checkoutUrl} target={"_blank"}>
                                                    <div className={`mt-4 w-full px-4 rounded-xl shadow-md border border-orange-400/50 bg-white/5 backdrop-blur-md text-orange-400 hover:bg-orange-500/20 text-center relative`}>
                                                        <div className="flex gap-2 items-center justify-center w-full border-b border-orange-400/50 py-2">
                                                            <span className="shrink-0">Get Premium {includesPremiumelements && "to Publish"}</span>
                                                            <span><IoDiamondOutline size={20}/></span>
                                                        </div>
                                                        <div className="w-full font-sans text-xs my-4 text-zinc-200 text-left space-y-1">
                                                            <p className="text-lg text-zinc-500">€5.99/month</p>
                                                            <p>✅ Dark Theme for a Sleek Look</p>
                                                            <p>🎨 More Theme Images</p>
                                                            <p>🌐 Use Your Own Custom Domain</p>
                                                            <p>📈 Unlimited Waitlist Members</p>
                                                            <p>💸 Affordable Monthly Pricing</p>
                                                            <p>🚫 Removed animated ”CustomWaitlist” Badge</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className="text-center mt-4 py-4">
                                                    <p className="font-bold mb-1">🎁 LIMITED TIME OFFER: 50% OFF!</p>
                                                    <p className="text-sm text-zinc-400">Be one of the first 100 Premium users and use the coupon code "<b className="text-white">FIRST100</b>" to get <b>50% Discount</b> on first payment</p>
                                                </div>
                                            </div>
                                            <span className="hidden group-hover:block shrink-0">50% OFF with Promocode "<b className="text-white">FIRST100</b>" for 100 first premium users!</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="w-full px-4">
                        {errMsg && (
                            <div className='mt-4 px-4 bg-red-600 font-mono text-white p-2 rounded-xl w-full text-xs'>{errMsg}</div> // Need to display error email already in use and same with domains and subdomains, offfer other options
                        )}
                    </div>
                </div>
                
            </div>
            <div className={`w-full flex justify-center relative md:h-screen overflow-y-auto overflow-x-clip no-scrollbar transform transition-all duration-1000 ${demo ? "pt-4 md:py-10" : "pt-0"}`}>
                <div className={`absolute z-50 top-0 right-0 w-full h-fit justify-between md:justify-end gap-4 p-8 md:p-4 flex flex-row-reverse md:flex-row ${demo ? "flex-row" : "flex-row-reverse"}`}>
                    {demo && (
                        <button onClick={() => setPc(false)} className={`hidden sm:block p-2 rounded-full h-fit shadow-md ${pc ? "bg-black/50 backdrop-blur-md text-white" : "bg-white/50 backdrop-blur-md text-black"}`}><IoPhonePortraitOutline size={24}/></button>
                    )}
                    {demo && (
                        <button onClick={() => setPc(true)} className={`hidden sm:block p-2 rounded-full h-fit shadow-md ${!pc ? "bg-black/50 backdrop-blur-md text-white" : "bg-white/50 backdrop-blur-md text-black"}`}><IoTvOutline size={24}/></button>
                    )}
                    <button onClick={() => setDemo(!demo)} className={`p-2 rounded-full h-fit shadow-md ${vars.light_dark === "dark" ? "bg-orange-500 backdrop-blur-md text-white" : "bg-orange-500/50 backdrop-blur-md text-black"}`}>{demo ? <IoExpand size={24}/> : <IoContract size={24}/>}</button>
                    {!vars.premium && demo && checkoutUrl && user && (
                        <Link href={checkoutUrl} target={"_blank"} className={`py-2 px-4 rounded-full h-10 shadow-md border border-orange-400/50 bg-white/5 backdrop-blur-md text-orange-400 hover:bg-orange-500/5 text-center group w-[154px] overflow-hidden relative`}>
                            <div className="flex gap-2 items-center w-full group-hover:animate-slide-tl group-hover:px-48 group-hover:-ml-48">
                                <span className="shrink-0">Get Premium</span>
                                <span><IoDiamondOutline size={20}/></span>
                                <span className="hidden group-hover:block shrink-0">50% OFF with Promocode "<b className="text-white">FIRST100</b>" for 100 first premium users!</span>
                            </div>
                        </Link>
                    )}
                    {/* <Link href={"https://billing.stripe.com/p/login/5kQ5kD2L76NngVC6Sya7C00"} target="_blank" className="py-1 px-4 rounded-full h-10 shadow-md flex items-center gap-2 backdrop-blur-md border border-white/10 text-zinc-300">Billing</Link> */}
                    {(demo) && (
                        <Link href={'https://' + (vars.subdomain ? (vars.subdomain + '.customwaitlist.com') : vars.domain) + '/list'} rel="noopener noreferrer" className={`py-2 md:px-4 rounded-full shadow-md flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 text-center h-10 w-10 md:w-fit`}><span className="hidden md:block shrink-0">See Members</span><IoReaderOutline size={20}/></Link>
                    )}
                    {demo && (
                        user ? (
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
                        )
                    )}  
                </div>
                <div className={`relative h-full transform transition-all duration-1000 overflow-y-auto
                    ${themeTextColor[vars.theme]?.[11]} shadow-perfect
                    ${vars.light_dark === "dark" ? "bg-black border-white/30" : "bg-white border-black/30"} 
                    ${demo ? 
                        `${pc ? 'w-full max-h-[740px] h-full md:h-[calc(100vh-80px)] md:w-[calc(100vw-416px)] scale-[0.8] md:mr-8' : ' relative w-[360px] h-[740px] scale-[0.7]'} rounded-3xl border-4` 
                        : "border-none rounded-[0rem] w-full scale-y-100 mr-0 h-screen"}
                    `}>  
                    {!vars.premium && includesPremiumelements && (
                        <PremiumBadge lg={true} className={`scale-[1.6] top-4 right-7 ${demo ? "opacity-100" : "opacity-0"}`}/>
                    )}
                    <div className="overflow-hidden h-full relative">
                        <div id="share-card" className={`absolute bottom-4 right-4 z-[100] transform transition-all duration-700`}>
                            <div className={`bg-opacity-20 backdrop-blur-md border-2 border-white/30 w-fit h-fit rounded-3xl shadow-md flex flex-col items-center relative ${vars.light_dark === "dark" ? themeTextColor[vars.theme]?.[8] : themeTextColor[vars.theme]?.[7]}`}>
                            {!showShare && (<button onClick={() => setShowShare(true)} className={`px-4 flex gap-1 items-center py-1 ${vars.light_dark === "dark" ? "text-zinc-200" : "text-zinc-800"} `}><span>Share</span><IoShareSocialOutline /></button>)}
                            <div className={`flex justify-between gap-2 items-center absolute top-0 right-0 px-2 pt-1.5 w-full ${!showShare && "hidden"}`}>
                                <p className="text-white font-sens pl-2">Share!</p>
                                <button onClick={() => setShowShare(false)} className={`bg-white text-red-800 rounded-full px-3 py-0.5 text-xs font-semibold`}>Close</button>
                            </div>
                            {showShare && (
                                <div className={`w-40 mt-2 mx-2`}>
                                    <QRCodeGenerator thx={true} qrText={`https://${vars.domain || `${vars.subdomain}.customwaitlist.com`}`} img={vars.img || "https://www.customwaitlist.com/bg3.webp"} btnColor={vars.light_dark === "dark" ? themeTextColor[vars.theme]?.[8] : themeTextColor[vars.theme]?.[7]} previewSrc={previewSrc} setPreviewSrc={setPreviewSrc}/>  
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
                        <div className={`grid grid-cols-1 h-full overflow-y-auto no-scrollbar ${demo ? (pc ? "sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-2 rounded-[20px]" : "rounded-[20px]") : "md:grid-cols-3 xl:grid-cols-2"}`}>                  
                            <div className={`absolute top-0 right-[25%] translate-y-[-80%] h-1/2 w-1/2 opacity-25 rounded-full blur-3xl z-[-10] ${vars.light_dark === "dark" ? themeTextColor[vars.theme]?.[8] : themeTextColor[vars.theme]?.[7]}`} ></div>
                            <div className={`w-full relative max-w-2xl mx-auto h-full overflow-y-clip  pt-12 pb-8 px-8 flex flex-col justify-center ${vars.light_dark === "dark" ? "text-zinc-200" : "text-zinc-800"} ${pc && demo ? "sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1" : "md:col-span-2 xl:col-span-1"}`}>
                                <div className={`absolute bottom-0 left-[-30%] translate-y-[30%] h-1/2 w-1/2 opacity-25 rounded-full blur-3xl z-[-10] ${vars.light_dark === "dark" ? themeTextColor[vars.theme]?.[8] : themeTextColor[vars.theme]?.[7]}`} ></div>
                                <div className="w-fit mb-8">   
                                    <Image
                                        src={vars.logo}
                                        className="h-16 w-auto object-contain"
                                        height={500}
                                        width={500}
                                        alt={`${vars.title} Logo`}
                                        unoptimized
                                    />    
                                </div>
                                <AvatarCircles text={vars?.text1} avatarUrls={avatars} />
                                <SparklesText sparklesCount={10} className={"mb-6"}>
                                    {vars.text2}
                                </SparklesText>
                                <div className="mb-12">
                                    <pre className="whitespace-pre-wrap font-sans font-medium text-zinc-500">{vars.text3}</pre>
                                </div>
                                <JoinWL2 theme={vars.theme} light_dark={vars.light_dark} message={vars.message} pc={pc} demo={demo} waitlist_ref={vars.waitlist_ref} isClient={true}/> 
                                <div className="mt-20 mb-20 sm:mb-8 flex gap-4 items-center">
                                    {/* <ContactForm2 theme={vars.theme} light_dark={vars.light_dark} isClient={true}/>   */}
                                    <div className="flex gap-2 items-center">
                                        {vars.social_x && (
                                            <Link href={vars.social_x} target="_blank" className={`h-9 w-9 flex justify-center items-center text-sm rounded-full shadow-md transform transition-all shrink-0 ${vars.light_dark === "dark" ? `${themeTextColor[vars.text1_bg]?.[9]}/0 text-white hover:text-black hover:bg-white` : `${themeTextColor[vars.text1_bg]?.[10]}/0 text-black hover:text-white hover:bg-black`}`}>
                                                <FaXTwitter size={20}/>
                                            </Link>     
                                        )}  
                                        {vars.social_linkedin && (
                                            <Link href={vars.social_linkedin} target="_blank" className={`h-9 w-9 flex justify-center items-center text-sm rounded-full shadow-md transform transition-all shrink-0 ${vars.light_dark === "dark" ? `${themeTextColor[vars.text1_bg]?.[9]}/0 text-white hover:text-black hover:bg-white` : `${themeTextColor[vars.text1_bg]?.[10]}/0 text-black hover:text-white hover:bg-black`}`}>
                                                <FaLinkedinIn size={20}/>
                                            </Link>     
                                        )}  
                                        {vars.social_instagram && (
                                            <Link href={vars.social_instagram} target="_blank" className={`h-9 w-9 flex justify-center items-center text-sm rounded-full shadow-md transform transition-all shrink-0 ${vars.light_dark === "dark" ? `${themeTextColor[vars.text1_bg]?.[9]}/0 text-white hover:text-black hover:bg-white` : `${themeTextColor[vars.text1_bg]?.[10]}/0 text-black hover:text-white hover:bg-black`}`}>
                                                <FaInstagram size={20}/>
                                            </Link>     
                                        )}  
                                        {vars.social_facebook && (
                                            <Link href={vars.social_facebook} target="_blank" className={`h-9 w-9 flex justify-center items-center text-sm rounded-full shadow-md transform transition-all shrink-0 ${vars.light_dark === "dark" ? `${themeTextColor[vars.text1_bg]?.[9]}/0 text-white hover:text-black hover:bg-white` : `${themeTextColor[vars.text1_bg]?.[10]}/0 text-black hover:text-white hover:bg-black`}`}>
                                                <FaFacebookF size={20}/>
                                            </Link>     
                                        )}  
                                    </div>
                                </div>
                        
                                <div className="absolute bottom-4 left-0 w-fit h-fit">
                                    <div className={`transition-all transform duration-500 px-8 flex flex-wrap gap-x-2 items-center text-xs text-zinc-500 ${demo ? "opacity-0" : "opacity-100"}`}>
                                        <span>All Rights Reserved.</span>
                                        <span>Copyright © 2025.</span>
                                        <Link href={"https://www.customwaitlist.com/"} target="_blank" title="Visit customwaitlist.com to create a landing page for your project!" className={`py-2 hover:text-orange-400`}>Powered by CustomWaitlist.com</Link>
                                    </div> 
                                </div>
                            </div>
                            <div className={`relative h-full min-h-screen overflow-clip`}>   
                                <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t h-[20vh] z-50 flex justify-end ${vars.light_dark === "dark" ? "from-black" : "from-white"}`}>
                                    <Link href={"https://www.customwaitlist.com/"} target="_blank" title="Visit customwaitlist.com to create a landing page for your project!" className="group translate-y-[114px] -translate-x-6 cursor-pointer relative">
                                        <SpinningText reverse className={`text-sm opacity-30 group-hover:opacity-100 transform transition-all ${vars.light_dark === "dark" ? "text-white" : "text-black"}`} duration={220} radius={7}>
                                            Built with Custom Waitlist . com {" "}
                                        </SpinningText>     
                                    </Link>
                                     
                                </div>
                                <div className={`w-full h-full ${pc && demo ? "sm:w-1/3 md:w-full" : "md:w-1/3 xl:w-1/2"}`}>
                                    <Image
                                        src={vars.img ?? "https:/customwaitlist.com/bg3.webp"}
                                        alt={vars.title}
                                        className={`h-full w-full relative ${pc && demo ? "sm:object-cover" : "md:object-cover"}`}
                                        fill
                                        quality={100}
                                        sizes="(max-width: 640px) 100vw, (min-width: 640px) 50vw"
                                        priority
                                        unoptimized
                                    />
                                </div>
                                <div className={`absolute bottom-0 right-0 w-full h-full overflow-y-scroll no-scrollbar transition-all transform p-8 flex flex-col gap-8 items-center bg-gradient-to-b ${vars.light_dark === "dark" ? "from-black/20 via-balck/20 to-black" : "from-white/0 via-white/20 to-white"} ${!vars.tweetId && "justify-end"}`}>
                                    {vars.tweetId && (
                                        <div className={`${vars.light_dark} scale-90 md:scale-75 hover:scale-90 transform transition-all duration-700`}>
                                            <Tweet id={vars.tweetId}/>    
                                        </div>    
                                    )}
                                    {vars.text4 && (
                                        <div className={`mb-[20vh] w-full h-fit rounded-3xl backdrop-blur-md sm:text-sm ${vars.light_dark === "dark" ? "bg-black/30 text-white border-white/5" : "bg-white/80 text-black border-black/5"} border-4 p-4 shadow-perfect ${themeTextColor[vars.theme]?.[11]}`}>
                                            <pre className="whitespace-pre-wrap font-sans">                      
                                                {vars.text4}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    
                </div>     
            </div>
            
        </div>
    </>
    )
}