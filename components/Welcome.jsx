import Image from "next/image";
import BrandBadge from "./brandBadge";
import JoinWL2 from "./Forms/JoinWL2";
// import ContactForm2 from "./Forms/ContactForm2";
import { useEffect, useRef, useState } from "react";
import { IoContract, IoExpand, IoPhonePortraitOutline, IoTvOutline, IoDiamondOutline, IoCloudUploadOutline, IoReaderOutline, IoCheckmark, IoCheckmarkSharp, IoPersonCircleOutline, IoPersonCircle, IoExitOutline, IoGridOutline, IoChevronUp, IoCreateOutline } from "react-icons/io5";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import QRCodeGenerator from "./QRgen";
import { FaFacebookF, FaInstagram, FaLinkedin, FaLinkedinIn, FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter, FaXTwitter } from "react-icons/fa6";
import { SpinningText } from "./magicui/spinning-text";
import { AvatarCircles } from "./magicui/avatar-circles";
import { TypingAnimation } from "./magicui/typing-animation";
import { SparklesText } from "./magicui/sparkles-text";
// import { cn } from "lib/utils";
// import { DotPattern } from "./magicui/dot-pattern";
import { Tweet } from "react-tweet";
import { IoShareSocialOutline, IoTimerOutline } from "react-icons/io5";
import { useRouter } from "next/router";


export const avatars = [
  {
    imageUrl: `https://thispersondoesnotexist.com/?${Math.random()}`,
    profileUrl: "https://github.com/dillionverma",
  },
  {
    imageUrl: `https://thispersondoesnotexist.com/?${Math.random()}`,
    profileUrl: "https://github.com/tomonarifeehan",
  },
  {
    imageUrl: `https://thispersondoesnotexist.com/?${Math.random()}`,
    profileUrl: "https://github.com/BankkRoll",
  }
];

export const bgImages = [
    "https://www.customwaitlist.com/bg/1.webp",
    "https://www.customwaitlist.com/bg/2.webp",
    "https://www.customwaitlist.com/bg/3.webp",
    "https://www.customwaitlist.com/bg/4.webp",
    "https://www.customwaitlist.com/bg/5.webp",
    "https://www.customwaitlist.com/bg/6.webp",
    "https://www.customwaitlist.com/bg/7.webp",
    // "/bg/8.webp",
    "https://www.customwaitlist.com/bg/9.webp",
    "https://www.customwaitlist.com/bg/10.webp",
    "https://www.customwaitlist.com/bg/12.webp",
    "https://www.customwaitlist.com/bg/13.webp",
    "https://www.customwaitlist.com/bg/14.webp",
    "https://www.customwaitlist.com/bg/15.webp",
    "https://www.customwaitlist.com/bg/16.webp",
    "https://www.customwaitlist.com/bg/17.webp",
    "https://www.customwaitlist.com/bg/18.webp",
    "https://www.customwaitlist.com/bg/19.webp",
    "https://www.customwaitlist.com/bg/20.webp",
    "https://www.customwaitlist.com/bg/21.webp",
    // "/bg/22.webp",
]

export const premiumImages = [
    "https://www.customwaitlist.com/bg/premium/bg1.webp",
    "https://www.customwaitlist.com/bg/premium/bg2.webp",
    "https://www.customwaitlist.com/bg/premium/bg3.webp",
    "https://www.customwaitlist.com/bg/premium/bg4.webp",
    "https://www.customwaitlist.com/bg/premium/bg5.webp",
    "https://www.customwaitlist.com/bg/premium/bg6.webp",
    "https://www.customwaitlist.com/bg/premium/bg7.webp",
    "https://www.customwaitlist.com/bg/premium/bg8.webp",
    "https://www.customwaitlist.com/bg/premium/bg9.webp",
    "https://www.customwaitlist.com/bg/premium/bg10.webp",
]

export const tailwindColors = [
  "neutral", "stone", "red", "orange", "amber", "yellow", "lime", "green",
  "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple",
  "fuchsia", "pink", "rose"
];


export const themeTextColor = {
  neutral: ["text-neutral-300", "text-neutral-400", "text-neutral-500", "text-neutral-600", "text-neutral-700", "from-neutral-300", "to-neutral-600", "bg-neutral-500", "bg-neutral-700", "bg-neutral-800", "bg-neutral-100", "shadow-neutral-500/30"],
  stone: ["text-stone-300", "text-stone-400", "text-stone-500", "text-stone-600", "text-stone-700", "from-stone-300", "to-stone-600", "bg-stone-500", "bg-stone-700", "bg-stone-800", "bg-stone-100", "shadow-stone-500/30"],
  red: ["text-red-300", "text-red-400", "text-red-500", "text-red-600", "text-red-700", "from-red-300", "to-red-600", "bg-red-500", "bg-red-700", "bg-red-800", "bg-red-100", "shadow-red-500/30"],
  orange: ["text-orange-300", "text-orange-400", "text-orange-500", "text-orange-600", "text-orange-700", "from-orange-300", "to-orange-600", "bg-orange-500", "bg-orange-700", "bg-orange-800", "bg-orange-100", "shadow-orange-500/30"],
  amber: ["text-amber-300", "text-amber-400", "text-amber-500", "text-amber-600", "text-amber-700", "from-amber-300", "to-amber-600", "bg-amber-500", "bg-amber-700", "bg-amber-800", "bg-amber-100", "shadow-amber-500/30"],
  yellow: ["text-yellow-300", "text-yellow-400", "text-yellow-500", "text-yellow-600", "text-yellow-700", "from-yellow-300", "to-yellow-600", "bg-yellow-500", "bg-yellow-700", "bg-yellow-800", "bg-yellow-100", "shadow-yellow-500/30"],
  lime: ["text-lime-300", "text-lime-400", "text-lime-500", "text-lime-600", "text-lime-700", "from-lime-300", "to-lime-600", "bg-lime-500", "bg-lime-700", "bg-lime-800", "bg-lime-100", "shadow-lime-500/30"],
  green: ["text-green-300", "text-green-400", "text-green-500", "text-green-600", "text-green-700", "from-green-300", "to-green-600", "bg-green-500", "bg-green-700", "bg-green-800", "bg-green-100", "shadow-green-500/30"],
  emerald: ["text-emerald-300", "text-emerald-400", "text-emerald-500", "text-emerald-600", "text-emerald-700", "from-emerald-300", "to-emerald-600", "bg-emerald-500", "bg-emerald-700", "bg-emerald-800", "bg-emerald-100", "shadow-emerald-500/30"],
  teal: ["text-teal-300", "text-teal-400", "text-teal-500", "text-teal-600", "text-teal-700", "from-teal-300", "to-teal-600", "bg-teal-500", "bg-teal-700", "bg-teal-800", "bg-teal-100", "shadow-teal-500/30"],
  cyan: ["text-cyan-300", "text-cyan-400", "text-cyan-500", "text-cyan-600", "text-cyan-700", "from-cyan-300", "to-cyan-600", "bg-cyan-500", "bg-cyan-700", "bg-cyan-800", "bg-cyan-100", "shadow-cyan-500/30"],
  sky: ["text-sky-300", "text-sky-400", "text-sky-500", "text-sky-600", "text-sky-700", "from-sky-300", "to-sky-600", "bg-sky-500", "bg-sky-700", "bg-sky-800", "bg-sky-100", "shadow-sky-500/30"],
  blue: ["text-blue-300", "text-blue-400", "text-blue-500", "text-blue-600", "text-blue-700", "from-blue-300", "to-blue-600", "bg-blue-500", "bg-blue-700", "bg-blue-800", "bg-blue-100", "shadow-blue-500/30"],
  indigo: ["text-indigo-300", "text-indigo-400", "text-indigo-500", "text-indigo-600", "text-indigo-700", "from-indigo-300", "to-indigo-600", "bg-indigo-500", "bg-indigo-700", "bg-indigo-800", "bg-indigo-100", "shadow-indigo-500/30"],
  violet: ["text-violet-300", "text-violet-400", "text-violet-500", "text-violet-600", "text-violet-700", "from-violet-300", "to-violet-600", "bg-violet-500", "bg-violet-700", "bg-violet-800", "bg-violet-100", "shadow-violet-500/30"],
  purple: ["text-purple-300", "text-purple-400", "text-purple-500", "text-purple-600", "text-purple-700", "from-purple-300", "to-purple-600", "bg-purple-500", "bg-purple-700", "bg-purple-800", "bg-purple-100", "shadow-purple-500/30"],
  fuchsia: ["text-fuchsia-300", "text-fuchsia-400", "text-fuchsia-500", "text-fuchsia-600", "text-fuchsia-700", "from-fuchsia-300", "to-fuchsia-600", "bg-fuchsia-500", "bg-fuchsia-700", "bg-fuchsia-800", "bg-fuchsia-100", "shadow-fuchsia-500/30"],
  pink: ["text-pink-300", "text-pink-400", "text-pink-500", "text-pink-600", "text-pink-700", "from-pink-300", "to-pink-600", "bg-pink-500", "bg-pink-700", "bg-pink-800", "bg-pink-100", "shadow-pink-500/30"],
  rose: ["text-rose-300", "text-rose-400", "text-rose-500", "text-rose-600", "text-rose-700", "from-rose-300", "to-rose-600", "bg-rose-500", "bg-rose-700", "bg-rose-800", "bg-rose-100", "shadow-rose-500/30"],
};

export const tweetPostContent = (title) => [
    `🚀 Just joined the waitlist for ${title}! Can’t wait to see what’s next.`,
    `I’m officially on the waitlist for ${title} 👀 Who else is in?`,
    `Signed up for ${title} new product waitlist 🔥 Something exciting is coming!`,
    `The hype is real… joined the waitlist for ${title} upcoming product 🚀`,
    `Just reserved my spot on ${title} waitlist. Don’t sleep on this one 👏`,
    `Waiting for ${title}’s next launch like 😎 Just joined the waitlist!`,
    `Can’t wait for ${title}’s new product! I’m officially on the waitlist 🚀`,
    `Excited to be on ${title} waitlist! Something big is coming 🔥`,
    `I joined the waitlist for ${title}’s latest product! Let’s see what the future holds 👀`,
    `Who else is on the ${title} waitlist? I just joined and the hype is real 🚀`,
    `FOMO is real… joined ${title}’s waitlist for their upcoming product 🔥`,
    `I’m on the waitlist for ${title} next big thing 😎 Can’t wait!`,
    `Secured my spot on ${title} waitlist 🚀 Who’s joining me?`,
    `Big things coming from ${title}... I’m on the waitlist! 👏`,
    `Just joined ${title} waitlist for their latest product 😍`,
    `Excited to be among the first to try ${title} next product 🔥`,
    `The countdown begins! I’m on the ${title} waitlist ⏳`,
    `I’ve joined ${title} waitlist! Who else is ready for the future? 🚀`,
    `${title}’s new product? I’m in! Joined the waitlist 👀`,
    `Can’t wait to see ${title}’s next big thing! I’ve secured my spot on the waitlist 🔥`
]

export const tweetPostContent2 = (title) => [
    `🚀 I just launched a waitlist for '${title}'! Be the first to get access!`,
    `Excited to announce the waitlist for '${title}' is now open! Join here: `,
    `The wait is over! Join the waitlist for '${title}' today and be ahead of the crowd.`,
    `Just launched a waitlist for '${title}' – spots are limited! Sign up now:`,
    `🔥 Hot off the press: '${title}' waitlist is live! Don’t miss out!`,
    `Calling all early adopters! Join the '${title}' waitlist and get exclusive updates!`,
    `Big news! We just launched the waitlist for '${title}'. Be part of something amazing!`,
    `I’m thrilled to share '${title}' waitlist is open! Reserve your spot today:`,
    `Join the movement! The '${title}' waitlist is officially live. Early access awaits!`,
    `Pumped to announce our waitlist for '${title}' is live! Don’t wait—join now!`
]

export default function Welcome() {   
    const rn = Math.floor(Math.random() * bgImages.length);
    const rc = Math.floor(Math.random() * tailwindColors.length);

    const router = useRouter();


    function generateSafeUniqueSubdomain(base) {
        const timePart = Date.now().toString().slice(-5);
        const randPart = Math.floor(100 + Math.random() * 900); // 3-digit random
        return `${base}${timePart}${randPart}`;
    }

    let tweetText = "";
    let tweetText2 = "";
    let tweetUrl = "";

    const variables = {
        title: "Custom Waitlist",
        logo: "https://www.customwaitlist.com/assets/2x/logo.png",
        text1: "1000+ already joined",
        text2: "Build Beautiful, Branded Waitlists - Your Way",
        text3: "Join the waitlist for Custom Waitlist, the easiest way to design and launch fully customizable waitlist landing pages with no code needed.",
        text4: `🎨 Tailor details: colors, text, images
⚡ Launch in minutes with clean, responsive template
🧩 Embed forms to track signups
💼 Perfect for founders, indie hackers, and product launches
🔐 Fully hosted & mobile-optimized`,
        img: bgImages[rn],
        text1_bg: tailwindColors[rc],
        theme: tailwindColors[rc],
        light_dark: "dark",
        message: "Thank You for Signing Up!",
        subdomain: generateSafeUniqueSubdomain("myproject"),
        domain: "",
        email: "",
        pass: "",
        repass: "",
        waitlist_ref: "",
        social_x: "",
        social_linkedin: "",
        social_instagram: "",
        social_facebook: "",
        tweetId: "1962978874658271439",
        premium: false,
        status: "draft"
    }

    const [demo, setDemo] = useState(true);
    const [vars, setVars] = useState(variables)
    const [pc, setPc] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [step, setStep] = useState(1)
    const [errMsg, setErrMsg] = useState("")
    const [domainStatus, setDomainStatus] = useState("");
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [showListBtn, setShowListBtn] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [waitlistCreated, setWaitlistCreated] = useState(null);
    const [loadingProcess, setLoadingProcess] = useState(false);
    const [domainAddedToVercel, setDomainAddedToVercel] = useState(false);
    const [createAccount, setCreateAccount] = useState(true);
    const [validatedSubdomain, setValidatedSubdomain] = useState("");
    const [validatedDomain, setValidatedDomain] = useState("");
    // const [subdomainNote, setSubdomainNote] = useState("");
    const [waitWall, setWaitWall] = useState(false);
    const [user, setUser] = useState(auth.currentUser);
    const [hasPremium, setHasPremium] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [hiName, setHiName] = useState("")
    const [timeExpired, setTimeExpired] = useState(false)
    const [previewSrc, setPreviewSrc] = useState(null);
    const [checkoutUrl, setCheckoutUrl] = useState(null);
    const [pandingPayment, setPandingPayment] = useState(false);

    const rt = Math.floor(Math.random() * tweetPostContent.length) //random tweet
    tweetText = tweetPostContent(vars.title)[rt]
    tweetUrl = `https://${vars.domain || `${vars.subdomain}.customwaitlist.com`}` ?? 'https://customwaitlist.com'
    tweetText2 = tweetPostContent2(vars.title)[rt]

    useEffect(() => {
        const largeScreen = window.innerWidth > 640;
        setIsLargeScreen(largeScreen);
        setPc(largeScreen);
        if (router.isReady) {
            const { hi } = router.query;
            if (hi) {
                setHiName(hi.toString());
                setHasPremium(true)
                setVars((prev) => ({ ...prev, premium: true }));
            }
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        // console.log({ waitlistRef: vars.waitlist_ref })
        async function createSession() {
        const res = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ waitlistRef: vars.waitlist_ref, email: user?.email || vars.email || "", domain: vars.domain, subdomain: vars.subdomain }),
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
        // console.log("Domain response:", data);
        if (res.ok) {
            setDomainStatus('✅ Domain added. Please configure your DNS and wait a few minutes.');
            setDomainAddedToVercel(true);
        } else {
            setDomainStatus('Error: ' + JSON.stringify(data.error.error.message));
            setDomainAddedToVercel(false);
        }
    }

    const validateSubdomain = async (subdomain) => {
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
                // console.log("Domain validation response:", data);

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

    async function loginToAccount(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // const user = userCredential.user;
            // setUser(auth.currentUser);
            // console.log("User logged in:", userCredential.user)
            setUser(userCredential.user);
            setStep(5); 
            // console.log('hasPremium', hasPremium)
            setCurrentStep(5);
            setErrMsg("");
            createWaitlistRef(userCredential.user.uid);
            // Optional: Fetch custom account data from Firestore
            // const userDocRef = doc(db, "accounts", user.uid); // Adjust "accounts" to your collection
            // const userDocSnap = await getDoc(userDocRef);

            // if (userDocSnap.exists()) {
            //     return {
            //         uid: user.uid,
            //         email: user.email,
            //         account: userDocSnap.data()
            //     };
            // } else {
            //     // If no additional Firestore account data found
            //     return {
            //         uid: user.uid,
            //         email: user.email
            //     };
            // }            

        } catch (error) {
            console.error("Login error:", error.message);
            setErrMsg("Login error:", error.message);
            // throw new Error(error.message);
        }
    }

    async function signupAccount(email, password) {
        if (!vars.email || !vars.pass || !vars.repass) {
            setErrMsg("Please fill in all fields.");
            setTimeout(() => {
                setErrMsg("");
            }, 4000);
            return;
        }

        if (vars.pass !== vars.repass) {
            setErrMsg("Passwords do not match.")
            setTimeout(() => {
                setErrMsg("");
            }, 4000);
            return
        }
        // let user = null
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // user = userCredential.user;
            setUser(userCredential.user);

            // You can do something with the user, like save to Firestore
            // console.log("User created:", user.uid);

            setStep(5); 
            setCurrentStep(5);
            setErrMsg("");
            createWaitlistRef(userCredential.user.uid);

        } catch (error) {
            console.error("Error creating user:", error.code, error.message);

            if (error.code === "auth/email-already-in-use") {
                setErrMsg("Email is already in use. Try to login instead.");
            } else if (error.code === "auth/invalid-email") {
                setErrMsg("Invalid email address.");
            } else if (error.code === "auth/weak-password") {
                setErrMsg("Password should be at least 6 characters.");
            } else {
                setErrMsg("An error occurred while creating the account.");
            }
            setLoadingProcess(false);
            return;
        }
    }

    //create waitlist
    const createWaitlistRef = async (userId) => {
        try {            
            const docRef2 = await addDoc(collection(db, "waitlist"), {
                subdomain: vars.subdomain,
                domain: vars.domain,
                email: vars.email,
                userId: userId,
                timestamp: serverTimestamp(),
            });
            setVars(prev => ({ ...prev, waitlist_ref: docRef2.id }))
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    //update waitlist
    // const updateWaitlist = async () => {
    //     try {         
    //         const docRef = doc(db, "waitlist", vars.waitlist_ref);
    //         await updateDoc(docRef, {
    //             subdomain: vars.subdomain,
    //             domain: vars.domain,
    //             email: vars.email,
    //             userId: user.uid,
    //             updated: serverTimestamp(),
    //         });
    //     } catch (error) {
    //         console.error("Error adding document: ", error);
    //     }
    // };

    //update waitlist
    const submitToSave = async (userId, status) => {
        setLoadingProcess(true);
            
        if (vars.subdomain) {
            const isSubdomainValid = validateSubdomain(vars.subdomain);
            if (!isSubdomainValid) return
        } else if (vars.domain) {
            const isDomainValid = validateDomain(vars.domain);
            if (!isDomainValid) return
        }

        try {            
            let logoUrl = vars.logo || null;
            let imgUrl = vars.img || null;

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

            const { logoFile, imgFile, email, pass, repass, ...cleanVars } = vars;

            setVars(prev => ({ ...prev, img: imgUrl, logo: logoUrl, status: status || "draft"}))
            // console.log("Document from sites written with ID:", docRef2.id);

            const docRef1 = await addDoc(collection(db, "sites"), {
                ...cleanVars,
                logo: logoUrl,      
                img: imgUrl,    
                waitlist_ref: vars.waitlist_ref || null,     
                userId: userId || null,
                timestamp: serverTimestamp(),
                status: status || "draft",
            });

            setWaitlistCreated(docRef1.id)
            toggleTimer("stop")

            // console.log("Document from sites written with ID:", docRef1.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        setLoadingProcess(false);
        setIsSubmitted(true);
        setShowListBtn(true);
        setCurrentStep(5);
        setStep(5);

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

    let includesPremiumelements = vars.domain || vars.light_dark === "dark" || !!vars.img?.includes("/bg/premium/bg")
    // console.log('includesPremiumelements', includesPremiumelements)
            

    // if (!isClient) return (
    //     <div className={`w-full h-screen flex flex-col items-center justify-center bg-black text-white p-8 interactive-background transform transition-all ${!isClient ? "opacity-100" : "opacity-0"}`}>
    //         <p className="text-5xl font-bold text-center mb-4 animate-opacityIn">Customize, Check, Publish</p>
    //         <p className="text-zinc-300 text-center text-lg mb-8">Simple, Modern waitlist for everyone</p>
    //         <div className="w-1 h-10 rounded-full bg-white animate-spin duration-1000">
    //         </div>
    //     </div>
    // )
    
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const intervalRef = useRef(null);

    const toggleTimer = (value) => {
        if (value === "start") {
            setIsClient(true);
            if (intervalRef.current) return; // avoid multiple intervals
            setTimeExpired(false);
            setHasPremium(true)
            setVars((prev) => ({ ...prev, premium: true }));

            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setTimeExpired(true);
                    setHasPremium(false);
                    setVars((prev) => ({ ...prev, premium: false }));
                    return 0;
                }
                return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
            setHasPremium(false)
            setVars((prev) => ({ ...prev, premium: false }));
        }
    };

    // Reset on unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    // Format time → mm:ss
    const formatTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

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
        <div className={`w-screen relative overflow-hidden flex flex-col-reverse md:flex-row items-center transform transition-all duration-1000 ${waitWall ? "translate-x-0" : "translate-x-0"} ${isClient ? "h-full" : "h-screen"}`}>
        <div className={`w-full h-full absolute inset-0 bg-black/80`}></div>
        <div className={`w-full h-16 md:h-8 fixed bottom-0 left-0 bg-gradient-to-t from-black z-20 transition-all transform duration-1000 ${!demo ? "opacity-0 translate-y-16" : "opacity-100 translate-y-0"}`}></div>
        <div className={`absolute bottom-4 xl:bottom-8 right-0 px-8 z-20 transform transition-all w-fit sm:justify-end items-end flex flex-wrap justify-between gap-x-8 gap-y-4 ${demo ? " translate-y-0 duration-1000" : "translate-y-20 duration-500"}`}>
            <p className="text-zinc-400 text-xs tracking-wide break-words text-right w-full sm:w-fit"><span>All Rights Reserved</span><br/>Copyright © 2026 onmcp.co</p>
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
                     <h1 className="text-3xl font-bold w-full mb-6">
                        Your <span className="inline animate-gradient bg-gradient-to-r from-zinc-400 via-white to-zinc-400 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">Website</span><br/> as an <span className="inline animate-gradient bg-gradient-to-r from-zinc-400 via-white to-zinc-400 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">MCP app</span>
                    </h1>    
                   
                    <p className="text-zinc-300 mb-16">...</p>
                    {waitlistCreated && (
                        <Link href={'https://' + (vars.subdomain ? (vars.subdomain + '.customwaitlist.com') : vars.domain) + '/edit'} className={`py-2 md:px-4 rounded-full shadow-md flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 text-center h-10 w-full`}><span className="hidden md:block shrink-0">Edit page</span><IoCreateOutline size={20}/></Link>
                    )}
                    <div className={`w-full flex justify-between items-center px-8 font-mono ${(waitlistCreated || pandingPayment) && "hidden"}`}>
                        <button disabled={currentStep < 1} onClick={() => {setStep(1); if (currentStep === 5) {setCurrentStep(4)}}} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${step === 1 ? "bg-white text-black" : "bg-white/25"}`}>1</button>
                        <span className="border-t w-full border-white/10"/>
                        <button disabled={currentStep < 2} onClick={() => {setStep(2); if (currentStep === 5) {setCurrentStep(4)}}} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${step === 2 ? "bg-white text-black" : "bg-white/25"}`}>2</button>
                        <span className="border-t w-full border-white/10"/>
                        <button disabled={currentStep < 3} onClick={() => {setStep(3); if (currentStep === 5) {setCurrentStep(4)}}} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${step === 3 ? "bg-white text-black" : "bg-white/25"}`}>3</button>
                        <span className="border-t w-full border-white/10"/>
                        <button disabled={currentStep < 4} onClick={() => {setStep(4); if (currentStep === 5) {setCurrentStep(4)}}} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${step === 4 ? "bg-white text-black" : "bg-white/25"}`}>4</button>
                        <span className={`border-t w-full border-white/10 ${currentStep !== 5 && 'hidden'}`}/>
                        {currentStep === 5 && (
                            <button onClick={() => setStep(5)} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 disabled:opacity-50 disabled:cursor-not-allowed ${waitlistCreated ? "bg-green-600" : "bg-orange-600/25"}`}><IoCheckmarkSharp/></button>
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
                                <button onClick={() => setVars(prev => ({ ...prev, light_dark: "dark" }))} className={`w-full text-xs rounded-xl py-1.5 font-semibold px-4 relative ${vars.light_dark === "light" ? "bg-white/5 text-white" : "bg-white text-black"}`}>Dark<PremiumBadge lg={true}/></button>
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
                                            <div key={index} className={`col-span-1 aspect-square rounded-[14px] relative overflow-hidden cursor-pointer shadow border-2 ${isClient && vars?.img === img ? " border-white" : "border border-white/0 hover:border-white/50"}`} onClick={() => setVars(prev => ({ ...prev, img }))}>
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
                                            <div key={index} className={`col-span-1 aspect-square rounded-[14px] relative shadow border-2 ${isClient && vars?.img === img ? " border-white" : "border border-white/0 hover:border-white/50"}`}>
                                                <div className={`w-full h-full overflow-hidden rounded-xl cursor-pointer`} onClick={() => setVars(prev => ({ ...prev, img }))}>
                                                    <div className="absolute inset-0 w-full h-full z-10"/>
                                                    <PremiumBadge/>
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
                {/* 
                            <div className="mb-6 px-4">
                                <label className="block text-sm font-medium text-zinc-500">Intro Text Color:</label>
                                <select
                                    name="text1_bg"
                                    value={vars.text1_bg}
                                    onChange={handleInputChange}
                                    className={`mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 outline-none text-white`}
                                >
                                    <option value="" className="text-black">Select</option>
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
                            </div>   */}
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
                                    <PremiumBadge lg={true}/>
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

                        {/* X, Linkedin, Instagram, Facebook */}


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
                        <>    
                            <div className="px-4">
                                <label className="block text-sm font-medium capitalize text-zinc-200 text-center">Waitlist Account</label>
                                {user ? (
                                    <div>
                                        <p className="text-sm text-center mt-4">Save to my account:<br/>{user.email}</p>
                                        <button onClick={() => {setStep(5); setCurrentStep(5); setErrMsg("")}} className="mt-3 w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black">
                                            Save
                                        </button>
                                        <div className="w-full flex items-center justify-center opacity-30 mb-1">
                                            <div className="pt-1 w-full border-b border-white"></div>
                                            <span className="p-2">or</span>
                                            <div className="pt-1 w-full border-b border-white"></div>
                                        </div>
                                        <button onClick={logOut} className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transform transition-all">
                                            Save to an other account
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-full grid grid-cols-2 items-center gap-3 mb-4 md:text-sm mt-4 h-fit">
                                            <button onClick={() => setCreateAccount(true)} className={`w-full h-full text-xs rounded-xl py-1.5 font-semibold px-4 ${!createAccount ? "bg-white/5 text-white" : "bg-white text-black"}`}>Create an account</button>
                                            <button onClick={() => setCreateAccount(false)} className={`w-full h-full text-xs rounded-xl py-1.5 font-semibold px-4 ${createAccount ? "bg-white/5 text-white" : "bg-white text-black"}`}>Login to existing account</button>
                                        </div>   
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium capitalize text-zinc-500">Email:</label>
                                            <input
                                                type="email"
                                                name={"email"}
                                                value={vars.email}
                                                onChange={handleInputChange}
                                                placeholder="name@company.com"
                                                className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium capitalize text-zinc-500">Password:</label>
                                            <input
                                                type="password"
                                                name={"pass"}
                                                value={vars.pass}
                                                onChange={handleInputChange}
                                                placeholder="********"
                                                className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                            />
                                        </div>
                                        {createAccount && (
                                            <div className="mb-3">
                                                <label className="block text-sm font-medium capitalize text-zinc-500">Repeat Password:</label>
                                                <input
                                                    type="password"
                                                    name={"repass"}
                                                    value={vars.repass}
                                                    onChange={handleInputChange}
                                                    placeholder="********"
                                                    className="mt-1 w-full rounded-xl px-2 py-1 md:text-sm bg-white/5 no-scrollbar outline-none"
                                                />
                                            </div>    
                                        )}  
                                        <p className="text-sm p-4">You will need this credentials on viewing the waitlist members</p>
                                        {createAccount ? (
                                            <button disabled={loadingProcess} onClick={() => signupAccount(vars.email, vars.pass)} className="mt-3 w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black">
                                                <span className="drop-shadow-sm">
                                                    {isSubmitted ? "Saved" : "Submit"}
                                                </span>
                                            </button>  
                                        ) : (
                                            <button disabled={loadingProcess} onClick={() => loginToAccount(vars.email, vars.pass)} className="mt-3 w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black">
                                                <span className="drop-shadow-sm">
                                                    Login
                                                </span>
                                            </button>  
                                        )}                     
                                    </>
                                )}                                
                            </div>
                        </>
                    )}

                    {step === 5 && (
                        <div className="px-4">    
                            {waitlistCreated ? (
                                <div className="text-center w-full mb-2">
                                    {vars.status === "draft" ? (
                                        <>
                                            <p className="text-2xl font-bold w-full">Pending payment!</p>
                                            <p className="text-lg mb-3">Your landing page is in draft!</p>
                                        </>        
                                    ) : (
                                        <>
                                            <p className="text-2xl font-bold w-full">Congratulations!</p>
                                            <p className="text-lg mb-3">Your landing page is ready!</p>
                                        </>  
                                    )}
                                   
                                    <div className="w-full">
                                          
                                        {/* {vars.img && ( */}
                                            <QRCodeGenerator thx={false} qrText={`https://${vars.domain || `${vars.subdomain}.customwaitlist.com`}`} img={vars.img || "https://www.customwaitlist.com/bg3.webp"} previewSrc={previewSrc} setPreviewSrc={setPreviewSrc}/>  
                                        {/* )} */}
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
                                        <p className="font-bold text-lg mb-2">
                                            Your landing page looks fantastic! 🎉
                                        </p>  
                                        {!timeExpired || includesPremiumelements && (
                                            <>
                                                <p className="text-xs text-zinc-30 mb-2">We noticed you’ve added some Premium features (like custom themes, premium images, or custom domain support).</p> 
                                                <p className="text-xs text-zinc-30 mb-2">To publish your page as it is now, you’ll need to upgrade to Premium.</p>
                                                <p className="text-xs text-zinc-400">If you’d prefer to stay on the free plan, no problem – you can simply go back and remove the Premium elements to publish for free.</p>                                        
                                            </>
                                        )} 
                                    </div>
                                    
                                    <button disabled={loadingProcess || (includesPremiumelements && !hasPremium)} onClick={() => {if (user) {submitToSave(user.uid, "public")}}} className="w-full px-4 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600">
                                        {loadingProcess ? (
                                            <div className="flex gap-4 items-center justify-center w-full drop-shadow-sm">
                                                <span className="shrink-0">Publishing...</span>
                                                <div className="w-1 h-6 rounded-full bg-white animate-spin duration-1000"></div>
                                            </div>
                                        ) : ( 
                                            <span className="drop-shadow-sm">
                                                {isSubmitted ? "Published" : "Publish my waitlist"}
                                            </span>
                                        )}
                                    </button> 
                                    {!hasPremium && vars.waitlist_ref && checkoutUrl && user && (
                                        <>                               
                                            <div className="w-full relative">
                                                <Link href={checkoutUrl} target={"_blank"} onClick={() => {if (user) {submitToSave(user.uid); setPandingPayment(true)}}}>
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
                                                            <p>💸 Affordable Mmonthly Pricing</p>
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
                <a href="https://www.producthunt.com/products/custom-waitlist-site-in-under-5-minutes?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-custom&#0045;waitlist&#0045;site&#0045;in&#0045;under&#0045;5&#0045;minutes" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1015959&theme=dark&t=1757814046813" alt="Custom&#0032;Waitlist&#0032;site&#0032;in&#0032;under&#0032;5&#0032;minutes - Create&#0032;stunning&#0044;&#0032;customizable&#0032;landing&#0032;pages&#0032;with&#0032;no&#0032;code | Product Hunt" className="h-auto w-[fit] mx-auto md:hidden" width="250" height="54" /></a>
                
            </div>
            <div className={`w-full flex justify-center relative md:h-screen overflow-y-auto overflow-x-clip no-scrollbar transform transition-all duration-1000 ${demo ? "pt-4 md:py-10" : "pt-0"}`}>
                <div className={`absolute z-50 top-0 right-0 w-full h-fit justify-between md:justify-end gap-4 p-8 md:p-4 flex flex-row-reverse md:flex-row ${demo ? "flex-row" : "flex-row-reverse"}`}>
                    <a href="https://www.producthunt.com/products/custom-waitlist-site-in-under-5-minutes?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-custom&#0045;waitlist&#0045;site&#0045;in&#0045;under&#0045;5&#0045;minutes" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1015959&theme=dark&t=1757814046813" alt="Custom&#0032;Waitlist&#0032;site&#0032;in&#0032;under&#0032;5&#0032;minutes - Create&#0032;stunning&#0044;&#0032;customizable&#0032;landing&#0032;pages&#0032;with&#0032;no&#0032;code | Product Hunt" className="h-[40px] w-auto hidden md:block" width="250" height="54" /></a>
                    {!timeExpired && !router.query.hi && (
                        <div className={`py-1 pl-2.5 pr-4 rounded-full h-10 shadow-md flex items-center gap-2 backdrop-blur-md border border-white/10 text-zinc-300`}>
                            <IoTimerOutline size={20}/>
                            <span className="shrink-0">{formatTime(timeLeft)}</span>
                        </div>
                    )}
                    {demo && (
                        <button onClick={() => setPc(false)} className={`hidden sm:block p-2 rounded-full h-fit shadow-md ${pc ? "bg-black/50 backdrop-blur-md text-white" : "bg-white/50 backdrop-blur-md text-black"}`}><IoPhonePortraitOutline size={24}/></button>
                    )}
                    {demo && (
                        <button onClick={() => setPc(true)} className={`hidden sm:block p-2 rounded-full h-fit shadow-md ${!pc ? "bg-black/50 backdrop-blur-md text-white" : "bg-white/50 backdrop-blur-md text-black"}`}><IoTvOutline size={24}/></button>
                    )}
                    <button onClick={() => setDemo(!demo)} className={`p-2 rounded-full h-fit shadow-md ${vars.light_dark === "dark" ? "bg-orange-500 backdrop-blur-md text-white" : "bg-orange-500/50 backdrop-blur-md text-black"}`}>{demo ? <IoExpand size={24}/> : <IoContract size={24}/>}</button>
                    {(!timeExpired || !hasPremium) && demo && vars.waitlist_ref && checkoutUrl && user &&  (
                        <Link href={checkoutUrl} target={"_blank"} onClick={() => {if (user) {submitToSave(user.uid); setPandingPayment(true)}}} className={`py-2 px-[9px] md:px-4 rounded-full h-10 w-10 shadow-md border border-orange-400/50 bg-white/5 backdrop-blur-md text-orange-400 hover:bg-orange-500/5 text-center group md:w-[154px] overflow-hidden relative`}>
                            <div className="flex gap-2 items-center w-full group-hover:animate-slide-tl group-hover:px-48 group-hover:-ml-48">
                                <span className="hidden group-hover:block md:block shrink-0">Get Premium</span>
                                <span><IoDiamondOutline size={20}/></span>
                                <span className="hidden group-hover:block shrink-0">50% OFF with Promocode "<b className="text-white">FIRST100</b>" for 100 first premium users!</span>
                            </div>
                        </Link>
                    )}
                    {/* <Link href={"https://billing.stripe.com/p/login/5kQ5kD2L76NngVC6Sya7C00"} target="_blank" className="py-1 px-4 rounded-full h-10 shadow-md flex items-center gap-2 backdrop-blur-md border border-white/10 text-zinc-300">Billing</Link> */}
                    {(demo && pandingPayment && vars.status === "draft") && (
                        <Link href={'https://' + (vars.subdomain ? (vars.subdomain + '.customwaitlist.com') : vars.domain) + '/edit'} rel="noopener noreferrer" className={`py-2 md:px-4 rounded-full shadow-md flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 text-center h-10 w-10 md:w-fit`}><span className="hidden md:block shrink-0">Edit page</span><IoCreateOutline size={20}/></Link>
                    )}
                    {(demo && showListBtn) && (
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
                {/* <div className="absolute top-0 -right-2 h-full flex items-center justify-center w-28">
                    <button onClick={() => setWaitWall(!waitWall)} className="rotate-90 flex flex-col items-center justify-center group text-white hover:text-orange-500 cursor-pointer">
                        <IoChevronUp size={20} className="transform transition-all -translate-y-6 group-hover:translate-y-4"/>
                        <IoChevronUp size={20}/>
                        <div className={`py-2 md:px-4 -mt-1 rounded-full text-white text-center text-sm md:text-base h-10 w-10 md:w-fit transform transition-all group-hover:-translate-y-2`}><span className="hidden md:block shrink-0">Wait Wall</span></div>
                    </button>
                </div> */}
                <div className={`relative h-full transform transition-all duration-1000 overflow-y-auto border border-black
                    ${vars.light_dark === "dark" ? "bg-black" : "bg-white"} 
                    ${demo ? 
                        `${pc ? 'w-full max-h-[740px] h-full md:h-[calc(100vh-80px)] md:w-[calc(100vw-416px)] scale-[0.8] md:mr-8' : ' relative w-[360px] h-[740px] scale-[0.7]'} rounded-3xl` 
                        : "rounded-[0rem] w-full scale-y-100 mr-0 h-screen"}
                    `}>  
                    {/* {includesPremiumelements && (
                        <PremiumBadge lg={true} className={`scale-[1.6] top-4 right-7 ${demo ? "opacity-100" : "opacity-0"}`}/>
                    )} */}
                    <div className="overflow-hidden h-full relative flex items-center justify-center">
                        <input type="text" name="domain" placeholder="Your website link by ex: onmcp.co" value={vars.domain} onChange={handleInputChange} className="w-full max-w-xl rounded-xl px-4 py-2 text-lg bg-white/5 no-scrollbar outline-none text-white"/>
                    </div>
                    
                </div>     
            </div>
            
        </div>
        <div className={`
            absolute top-0 left-0 w-full flex flex-col items-center justify-center z-[200]
            bg-black/30 backdrop-blur-xl text-white overflow-hidden
            duration-1000 transform transition-all
            ${isClient ? "translate-y-[100vh] h-0 opacity-0" : "translate-y-[0vh] h-screen opacity-100 p-8"}
            ${!demo && 'hidden'}
        `}>
            <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
                {/* <DotPattern
                    // glow={true}
                    className={cn(
                    "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] absolute top-0 left-0 animate-pulse",
                    )}
                /> */}
            {router.isReady && (
                router.query.hi ? (
                <>
                    <p className="text-3xl md:text-5xl mb-4 font-bold text-center animate-opacityIn text-zinc-500">Hi, {hiName}</p>
                    <TypingAnimation duration={100} className="text-5xl font-bold text-center mb-8">Happy to see you here!</TypingAnimation>
                    <p className="text-orange-400 text-center text-xl my-4 animate-opacityIn delay-1000 font-bold">You got Premium!</p>
                    <p className="text-zinc-300 text-sm mb-8">Thank You for being part of this journey!</p>
                    <button onClick={() => setIsClient(true)} className="w-fit py-2 px-4 rounded-full h-10 shadow-md border border-white/50 bg-white backdrop-blur-md text-black hover:bg-white/80 text-center">Start Exploring!</button>
                </>
            ) : (
                <>    
                   {/* {!isClient && (
                        <div className="w-1 h-10 rounded-full bg-white animate-spin duration-1000"/>
                    )}                */}
                    <p className="text-5xl font-bold text-center mb-4 animate-opacityIn delay-500">Welcome to ONMCP!</p>
                    <p className="text-zinc-300 text-center text-lg mb-8 animate-opacityIn">Your Life. Structured here.</p>
                    <div className="flex justify-between w-fit mb-16">
                        {/* <button onClick={() => toggleTimer("start")} className="w-full py-2 px-4 rounded-full h-10 shadow-md border border-orange-400/50 bg-orange-500/5 backdrop-blur-md text-orange-400 hover:bg-orange-500/10 text-center">Start Challenge!</button> */}
                        <button onClick={() => {setIsClient(true); setTimeExpired(true)}} className="w-full py-2 px-4 rounded-full h-10 shadow-md border border-white/50 bg-white backdrop-blur-md text-black hover:bg-white/80 text-center">Continue</button>
                    </div>
                    {/* <div className="shadow-good shadow-zinc-600 bg-black backdrop-blur-md text-white rounded-2xl p-4 mb-4">
                        <p>You will have 5 minutes to publish your custom waitlist to get <span className="text-orange-400">Premium for free.</span></p>
                        <p className="text-zinc-300 text-sm mt-4">Note, you can use Premium elements in this 5 minute, for free.</p>
                        <p className="text-zinc-300 text-sm">In case you exceeded the time of 5 minutes, you will have to buy Premium Package for using Premium elements.</p>
                        <p className="text-orange-400 mt-4">Are you ready?</p>      
                    </div> */}
                    {/* <stripe-pricing-table pricing-table-id="prctbl_1RyNXhGheTQgyPDGw7U1WzXR"
                    publishable-key="pk_live_51P9pJUGheTQgyPDGR3cdSC1UmlWypR8Y2AI3MVO8b6OaPUcdS4Hxnwl6h0FNilfOVe2gpNRVDfPjctibOpZ7ckRJ00cCO6JGwp">
                    </stripe-pricing-table> */}
                </>
            ))}
    
            </div>
            
        </div>
        {/* <div className="relative w-screen h-full bg-green-500">
            <div className="absolute top-0 -right-2 h-full flex items-center justify-center w-26 bg-red-500">
                <button onClick={() => setWaitWall(false)} className="rotate-90 flex flex-col items-center justify-center group text-white hover:text-orange-500 cursor-pointer">
                    <IoChevronUp size={20} className="transform transition-all -translate-y-5 group-hover:translate-y-4"/>
                    <IoChevronUp size={20}/>
                    <div className={`py-2 md:px-4 -mt-1 rounded-full text-white text-center text-sm md:text-base h-10 w-10 md:w-fit transform transition-all group-hover:-translate-y-2`}><span className="hidden md:block shrink-0">My Waitlist</span></div>
                </button>
            </div>
        </div>
        </div> */}
    </>
    )
}