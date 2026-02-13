import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { themeTextColor } from '../Welcome';


export default function JoinWL2({theme, light_dark, message, pc, demo, waitlist_ref, isClient}) {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errMsg, setErrMsg] = useState("")


  const sendIt = async (e) => {
    e.preventDefault();

    if (!waitlist_ref) {
      setErrMsg("Please create the waitlist account first.")
      setTimeout(() => {
        setErrMsg("");
      }, 4000);
      return
    }

    if (loading) return;
    setLoading(true);

    if (waitlist_ref) {
      const userRef = await addDoc(
        collection(db, "waitlist", waitlist_ref, "members"),
        {
          name: name,
          email: email,
          joinedAt: serverTimestamp(),
        }
      );
    }
    // const docRef = await addDoc(collection(db, "waitlist"), {
    //   name: name,
    //   email: email,
    //   timestamp: serverTimestamp(),
    // });

    

    // setIsOpen(false);

    setLoading(false);
    setEmail("");
    setName("");
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };


  return (
    <>
      {/* <button onClick={() => setIsOpen(true)} className='mt-[4vh] lg:mt-[6vh] bg-gradient-to-br from-[#50c8ff] to-[#037ba2] hover:bg-[#50c8ff] px-6 py-2 rounded-full text-white shadow-md'>
        Join the waitlist →
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex flex-col justify-center z-50">
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <Dialog.Panel className={`bg-white shadow-lg m-4 rounded-3xl p-6 max-w-sm overflow-hidden`}>
            <Dialog.Title className="font-bold text-center text-3xl my-4">{isSubmitted ? "Thank You!" : "OCCO Access"}</Dialog.Title>
            <Dialog.Description className="text-center mb-4 text-sm">
              {isSubmitted ? "We've received your submission and will notify you when our service becomes available." : "Be the first to experience automatic access using just your car's license plate number"}
            </Dialog.Description> */}
            {isSubmitted ? (
              <h1 className={`text-3xl font-bold w-full mb-8 ${themeTextColor[theme]?.[2]}`}>
                {message}
              </h1>
            ) : (
              <form onSubmit={sendIt} tabIndex='0'>
                <div className={`w-full flex flex-col gap-4 ${isClient && (demo ? `${pc ? "md:flex-row" : ""}` : "md:flex-row")}`}>
                  <input
                    type='text'
                    placeholder='Your name'
                    required
                    autoComplete='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-2 rounded-lg outline-none placeholder-gray-400 border ${isClient && (light_dark === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200")}`}
                  />
                  <input
                    type='email'
                    placeholder='Your email'
                    required
                    autoComplete='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2 rounded-lg outline-none placeholder-gray-400 border ${isClient && (light_dark === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200")}`}
                  />
                <button
                    disabled={!email.trim() || !name.trim()}
                    type="submit"
                    className={`bg-gradient-to-br font-semibold shrink-0 ${isClient && (light_dark === 'dark' ? 'from-white/10' : 'from-black/10')} ${isClient && themeTextColor[theme]?.[5]} ${isClient && themeTextColor[theme]?.[6]} hover:scale-95 text-white w-full md:w-fit text-center px-6 py-2 rounded-lg shadow-md disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all`}
                  >
                    <span className='drop-shadow-sm'>Join Waitlist</span>
                  </button>
                </div>
                
                {/* <div className='flex items-center mb-6'>
                  <input type='checkbox' required='true'/>
                  <p className='text-xs ml-2'>I consent to my personal data being submitted, <br/>so OCCO team can contact me.</p>
                </div> */}
                {/* <p className="text-center mb-4">
                  <b>Join the waitlist</b> and be notified when our service becomes available. Don't miss out on this <b>innovative solution</b> to make your life easier and more convenient. Join now!
                </p> */}
            
              </form>
             )
            }
            {errMsg && (
              <div className='mt-4 bg-red-600 font-mono text-white p-2 rounded-xl w-full'>{errMsg}</div>
            )}
          {/* </Dialog.Panel>
        </div>
      </Dialog> */}
    </>
  )
}