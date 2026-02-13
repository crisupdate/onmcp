import Image from "next/image";
import BrandBadge from "./brandBadge";
import JoinWL2 from "./Forms/JoinWL2";
import ContactForm2 from "./Forms/ContactForm2";
import { useEffect, useState } from "react";
import { IoContract, IoExpand, IoPhonePortraitOutline, IoTvOutline } from "react-icons/io5";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";



export default function ListMembers({members}) {   
    const [demo, setDemo] = useState(false);
    const [vars, setVars] = useState(variables)
    const [pc, setPc] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [step, setStep] = useState(1)
    const [errMsg, setErrMsg] = useState("")
    const [domainStatus, setDomainStatus] = useState("");
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const largeScreen = window.innerWidth > 640;
        setIsLargeScreen(largeScreen);
        setPc(largeScreen);
        setTimeout(() => {
            setDemo(true)
        }, 2000);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVars((prev) => ({ ...prev, [name]: value }));
    };

    // const handleFileChange = (e) => {
    //     const { name, files } = e.target;
    //     if (files?.[0]) {
    //         const file = files[0];
    //         const url = URL.createObjectURL(file);
    //         setVars((prev) => ({ ...prev, [name]: file, [`${name}Url`]: url }));
    //     }
    // };

    const handleFileChange = () => {
        const { name, files } = e.target;
        if (files?.[0]) {
            const file = files[0];
            const url = URL.createObjectURL(file); // just for preview
            setVars((prev) => ({
            ...prev,
            [`${name}File`]: file,        // Save it separately, not as 'logo'
            [`${name}Url`]: url,          // Preview URL
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
        if (res.ok) {
            setDomainStatus('✅ Domain added. Please configure your DNS and wait a few minutes.');
        } else {
            setDomainStatus('Error: ' + JSON.stringify(data.error.error.message));
        }
    }

    const submitToSave = async () => {
        if (vars.pass !== vars.repass) {
            setErrMsg("Password doesn't match. Please try to input password again in both fields.")
            setTimeout(() => {
                setErrMsg("");
            }, 4000);
            return
        }

        try {
            let logoUrl = null;
            let imgUrl = null;

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

            const docRef2 = await addDoc(collection(db, "waitlist"), {
                subdomain: vars.subdomain,
                domain: vars.domain,
                email: vars.email,
                pass: vars.pass,
                timestamp: serverTimestamp(),
            });

            setVars(prev => ({ ...prev, waitlist_ref: docRef2.id }))
            // console.log("Document from sites written with ID:", docRef2.id);

            const docRef1 = await addDoc(collection(db, "sites"), {
                ...cleanVars,
                logo: logoUrl,      
                img: imgUrl,    
                waitlist_ref: docRef2.id,     
                timestamp: serverTimestamp(),
            });

            // console.log("Document from sites written with ID:", docRef1.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }

        setIsSubmitted(true);

        setTimeout(() => {
            setIsSubmitted(false);
        }, 4000);
    };

        
    return (
        <>
        <div className='w-full relative h-full bg-[url(/bg3.webp)] flex flex-col md:flex-row items-center'>
            <div className={`w-full sm:w-96 shrink-0 md:max-h-screen overflow-y-auto no-scrollbar scrollbar-hide text-left px-8 relative md:transform md:transition-all md:duration-1000 ${demo ? "md:ml-0 h-full py-8" : "h-0 md:h-full py-0 md:py-8 sm:ml-[-384px]"}`}>
                {/* <div className={`w-full h-full p-4 rounded-3xl shadow-md backdrop-blur-md bg-black/30 text-white relative mb-8`}>
                    <button onClick={() => setStep(2)} className="w-full px-4 py-1 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black"><span className="drop-shadow-sm">Login</span></button>       
                </div> */}

                <div className="text-white mb-8">
                    <div className="w-fit mb-8">   
                        <Image
                            src={"/assets/2x/logo.png"}
                            className="h-16 w-16 object-contain rounded-full shadow-md"
                            alt={"Custom Waitlist"}
                            height={500}
                            width={500}
                        />    
                    </div>
                    <h1 className="text-3xl font-bold w-full mb-6">
                        Create <span className="inline animate-gradient bg-gradient-to-r from-zinc-400 via-white to-zinc-400 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">Custom Waitlist</span> in Minutes
                    </h1>
                    <p className="text-zinc-300 mb-16">Launch faster and start building your audience from day one - no code required.</p>
                    {/* <div className="w-full flex justify-between items-center px-8 font-mono">
                        <button onClick={() => setStep(1)} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 ${step ? "bg-white/25" : "bg-white/10"}`}>1</button>
                        <span className="border-t w-full border-white/10"/>
                        <button onClick={() => setStep(2)} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 ${step !== 1 ? "bg-white/25" : "bg-white/10"}`}>2</button>
                        <span className="border-t w-full border-white/10"/>
                        <button onClick={() => setStep(3)} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 ${(step === 3 || step === 4) ? "bg-white/25" : "bg-white/10"}`}>3</button>
                        <span className="border-t w-full border-white/10"/>
                        <button onClick={() => setStep(4)} className={`w-10 h-10 shrink-0 rounded-full shadow-md flex items-center justify-center border-2 border-white/5 ${step === 4 ? "bg-white/25" : "bg-white/10"}`}>4</button>
                    </div> */}
                </div>
                <div className={`w-full h-full p-4 rounded-3xl shadow-good shadow-emerald-200 backdrop-blur-md bg-black/30 text-white relative transform transition-all duration-1000 ${demo ? "translate-y-0" : "translate-y-[20%]"}`}>
                    {step === 1 && (
                        <>       
                            <div className="mb-3">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Title:</label>
                                <input
                                    name={"title"}
                                    value={vars.title}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                />
                            </div>
                            <label className="block text-sm font-medium text-zinc-500">Background:</label>
                            <div className="w-full flex items-center gap-3 mb-4 text-sm mt-1">
                                <button onClick={() => setVars(prev => ({ ...prev, light_dark: "light" }))} className={`w-full text-xs rounded-xl py-1.5 font-semibold px-4 ${vars.light_dark === "dark" ? "bg-white/5 text-white" : "bg-white text-black"}`}>Light</button>
                                <button onClick={() => setVars(prev => ({ ...prev, light_dark: "dark" }))} className={`w-full text-xs rounded-xl py-1.5 font-semibold px-4 ${vars.light_dark === "light" ? "bg-white/5 text-white" : "bg-white text-black"}`}>Dark</button>
                            </div>  
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-zinc-500">Upload Logo:</label>
                                <input type="file" name="logo" onChange={handleFileChange} className="mt-1 w-full text-sm bg-white/5 rounded-xl outline-none" />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-zinc-500">Upload Image:</label>
                                <input type="file" name="img" onChange={handleFileChange} className="mt-1 w-full text-sm bg-white/5 rounded-xl outline-none" />
                            </div>
                    
                            <div className="mb-3">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Intro Text:</label>
                                <textarea
                                    name={"text1"}
                                    value={vars.text1}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                    rows={1}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-zinc-500">Intro Text Color:</label>
                                <select
                                    name="text1_bg"
                                    value={vars.text1_bg}
                                    onChange={handleInputChange}
                                    className={`mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 outline-none text-white`}
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
                            </div>  
                            <button onClick={() => setStep(2)} className="w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black"><span className="drop-shadow-sm">Next Step</span></button>       
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div className="mb-3">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Header Text:</label>
                                <textarea
                                    name={"text2"}
                                    value={vars.text2}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                    rows={2}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-zinc-500">Select Theme Color:</label>
                                <select
                                    name="theme"
                                    value={vars.theme}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 outline-none text-white"
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

                            <div className="mb-3">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Call to action:</label>
                                <textarea
                                    name={"text3"}
                                    value={vars.text3}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                    rows={2}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium capitalize text-zinc-500">More Info Text:</label>
                                <textarea
                                    name={"text4"}
                                    value={vars.text4}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                    rows={7}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-zinc-500">After Submit Message:</label>
                                <textarea
                                    name="message"
                                    value={vars.message}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                    rows={1}
                                />
                            </div>
                            <button onClick={() => setStep(3)} className="w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black"><span className="drop-shadow-sm">Next Step</span></button>       
                        </>
                    )}
                    {step === 3 && (
                        <>    
                            <div className="mb-3">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Domain:</label>
                                <div className="w-full flex items-center gap-2">
                                    <input
                                        type="text"
                                        name={"subdomain"}
                                        placeholder="title"
                                        value={vars.subdomain}
                                        onChange={(e) => {
                                            handleInputChange(e); 
                                            setVars(prev => ({ ...prev, domain: "" }))
                                        }}
                                        className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                    />    
                                    <p className="text-sm tracking-wide">.customwaitlist.com</p>
                                </div>
                                
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium capitalize text-zinc-500">Custom Domain:</label>
                                <input
                                    type="text"
                                    name={"domain"}
                                    placeholder="example.com"
                                    value={vars.domain}
                                    onChange={(e) => {
                                        handleInputChange(e); 
                                        setVars(prev => ({ ...prev, subdomain: "" }))
                                    }}
                                    className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                />
                            </div>
                          
                            {domainStatus && (     
                                <>
                                    <div className="mt-2 p-2 bg-white/10 rounded-xl text-xs mb-6">
                                        {domainStatus.startsWith("Error") ? (<p className="text-sm mb-2 text-red-500">{domainStatus}</p>) : (
                                            <>
                                                <p className="text-sm mb-4">Please set up your domain DNS on hosting platform, by adding:</p>
                                                <table className="w-full font-mono">
                                                    <tr className="border-b border-white/30">
                                                        <th className="pb-1">Type</th>
                                                        <th className="pb-1 text-center">Name</th>
                                                        <th className="pb-1 text-right">Value</th>
                                                    </tr>
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
                                                </table>    
                                            </>
                                        )}
                                    </div>  
                                </>
                            )}
                            {((vars.domain || !domainStatus.startsWith("Error")) && !vars.subdomain) && (
                                <button onClick={() => addVercelDomain()} className="w-full px-4 py-2 rounded-xl bg-orange-300 text-black hover:bg-orange-500 transform transition-all hover:text-white disabled:opacity-50 disabled:hover:transition-none"><span className="drop-shadow-sm">Confirm</span></button>       
                            )}
                            {((domainStatus && !domainStatus.startsWith("Error")) || vars.subdomain) && (
                                <button onClick={() => {setStep(4); setDomainStatus("")}} className="w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black"><span className="drop-shadow-sm">Continue</span></button>       
                            )}
                            
                        </>
                    )}
                    {step === 4 && (
                        <>    
                            <div className="mt-6">
                                <label className="block text-sm font-medium capitalize text-zinc-200 text-center">Waitlist Account</label>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium capitalize text-zinc-500">Email:</label>
                                    <input
                                        type="email"
                                        name={"email"}
                                        value={vars.email}
                                        onChange={handleInputChange}
                                        className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium capitalize text-zinc-500">Password:</label>
                                    <input
                                        type="password"
                                        name={"pass"}
                                        value={vars.pass}
                                        onChange={handleInputChange}
                                        className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium capitalize text-zinc-500">Repeat Password:</label>
                                    <input
                                        type="password"
                                        name={"repass"}
                                        value={vars.repass}
                                        onChange={handleInputChange}
                                        className="mt-1 w-full rounded-xl px-2 py-1 text-sm bg-white/5 no-scrollbar outline-none"
                                    />
                                </div>
                            </div>
                            <button onClick={() => submitToSave()} className="w-full px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-300 transform transition-all hover:text-black"><span className="drop-shadow-sm">{isSubmitted ? "Saved" : "Save"}</span></button>       
                        </>
                    )}
                    
                    {errMsg && (
                        <div className='mt-4 bg-red-600 font-mono text-white p-2 rounded-xl w-full text-xs'>{errMsg}</div>
                    )}
                </div>
                
            </div>
            <div className="w-full flex justify-center relative h-screen overflow-y-auto no-scrollbar">
                <div className="absolute z-50 top-0 right-0 w-fit h-fit flex gap-2 p-8 md:p-4">
                    <button onClick={() => setPc(false)} className={`hidden sm:block p-2 rounded-full h-fit shadow-md ${pc ? "bg-black/50 backdrop-blur-md text-white" : "bg-white/50 backdrop-blur-md text-black"}`}><IoPhonePortraitOutline size={24}/></button>
                    <button onClick={() => setPc(true)} className={`hidden sm:block p-2 rounded-full h-fit shadow-md ${!pc ? "bg-black/50 backdrop-blur-md text-white" : "bg-white/50 backdrop-blur-md text-black"}`}><IoTvOutline size={24}/></button>
                    <button onClick={() => setDemo(!demo)} className={`p-2 rounded-full h-fit shadow-md ${vars.light_dark === "dark" ? "bg-orange-500/50 backdrop-blur-md text-white" : "bg-orange-500/50 backdrop-blur-md text-black"}`}>{demo ? <IoExpand size={24}/> : <IoContract size={24}/>}</button>
                </div>
                <div className={`grid relative grid-cols-1 overflow-y-auto no-scrollbar transform transition-all duration-1000 shadow-perfect shadow-zinc-500 
                    ${vars.light_dark === "dark" ? "bg-black border-white/30" : "bg-white border-black/30"} 
                    ${demo ? 
                        `${pc ? 'w-full max-h-[500px] scale-75 md:max-h-full md:w-[calc(100vw-416px)] md:scale-90 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-2 h-screen md:mr-8' : 'w-[360px] h-[740px] scale-75'} overflow-hidden rounded-3xl border-4` 
                        : "border-0 rounded-[0rem] w-full scale-y-100 mr-0 md:grid-cols-3 xl:grid-cols-2 h-screen"}
                    `}>
                    <div className={`w-full max-w-2xl mx-auto h-full pt-12 pb-8 px-8 ${vars.light_dark === "dark" ? "text-zinc-200" : "text-zinc-800"} ${pc && demo ? "sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1" : "md:col-span-2 xl:col-span-1"}`}>
                        <div className="w-fit mb-16">   
                            <Image
                                src={vars.logoUrl || vars.logo}
                                className="h-12 w-auto object-contain"
                                alt={vars.title}
                                height={500}
                                width={500}
                            />    
                        </div>
                        <div className={`p-2 rounded-md text-xs font-semibold tracking-wider w-fit mb-8 ${vars.light_dark === "dark" ? themeTextColor[vars.text1_bg]?.[9] : themeTextColor[vars.text1_bg]?.[10]}`}>{vars.text1}</div>
                        <h1 className="text-3xl font-bold w-full mb-8">
                            {vars.text2}
                        </h1>
                        <JoinWL2 theme={vars.theme} light_dark={vars.light_dark} message={vars.message} pc={pc} demo={demo} waitlist_ref={vars.waitlist_ref}/> 
                        <div className="mt-8">
                            <pre className="whitespace-pre-wrap">{vars.text3}</pre>
                            <pre className="italic mt-4 whitespace-pre-wrap">                      
                                {vars.text4}
                            </pre>
                        </div>
                        <div className="mt-8">
                            <ContactForm2 theme={vars.theme} light_dark={vars.light_dark}/>     
                        </div>
                    </div>
                    <div className="w-full relative h-full min-h-[400px] flex justify-center items-center overflow-hidden">
                        <div className={`w-full h-full ${pc && demo ? "sm:w-1/3 md:w-full" : "md:w-1/3 xl:w-1/2"}`}>
                            <Image
                                src={vars.imgUrl || vars.img}
                                alt={vars.title}
                                className="object-cover h-full w-full"
                                fill
                                // width={1000}
                                // height={1000}
                                priority
                            />
                        </div>
                        <div className="absolute top-0 right-0 w-full h-full"/>
                        <div className="absolute bottom-8 right-8">
                            <BrandBadge/>
                        </div> 
                    </div>
                    
                </div>     
            </div>
            
        </div>
        </>
    )
}