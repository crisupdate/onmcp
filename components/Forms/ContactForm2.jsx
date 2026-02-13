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


export default function ContactForm2({theme, light_dark, isClient}) {
let [isOpen, setIsOpen] = useState(false)

console.log(theme)

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");  
  const [text, setText] = useState("");  
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  

  const submitIt = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "contacts"), {
      name: name,
      email: email,
      text: text,
      timestamp: serverTimestamp(),
    });

    setLoading(false);
    setEmail("");
    setName("");
    setText("");
    setShowMessage(true);
  };


    return (
        <>
      <button onClick={() => setIsOpen(true)} className={`px-4 py-2 text-sm border rounded-full shadow-md transform transition-all shrink-0 ${isClient && (light_dark === "dark" ? "border-white hover:text-black hover:bg-white" : "border-black hover:text-white hover:bg-black")}`}>
        Contact Us
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex flex-col justify-center z-50 bg-transparent">
        <div className={`fixed inset-0 flex items-center justify-center backdrop-blur-md p-4 ${isClient && (light_dark === "dark" ? "bg-black/50" : "bg-white/50")}`}>
          <Dialog.Panel className={`outline-none`}>
            <Dialog.Title className={`font-bold text-center text-3xl mb-4 ${isClient && (light_dark === "dark" ? "text-white" : "text-black")}`}>{showMessage ? "Thank You!" : "Contact us"}</Dialog.Title>
            {/* <Dialog.Description className="text-center mb-4 text-sm">
              {showMessage ? "Thank you for message!" : "Get in touch with us"}
            </Dialog.Description> */}
            <form id='contact' onSubmit={submitIt} className={`backdrop-blur-[18px] w-full h-50 shadow-perfect rounded-3xl p-4 md:max-w-md z-0 ${isClient && (light_dark === "dark" ? "bg-zinc-800" : "bg-zinc-800")}`}>
                {/* {showMessage ? (
                    <h2 className="font-bold text-center text-2xl mt-4 md:mt-0">Thank you for message!</h2>
                ) : (
                    <h2 className="font-bold text-center text-2xl mt-4 md:mt-0">Get in touch with us</h2>
                )} */}
                <input
                    type='text'
                    placeholder='What is your full name?'
                    className="w-full mb-4 text-lg p-2 rounded-xl outline-none bg-white placeholder:text-base"
                    required
                    autoComplete='cc-name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type='email'
                    placeholder='What is your email?'
                    className="w-full mb-4 text-lg p-2 rounded-xl outline-none bg-white placeholder:text-base"
                    required
                    autoComplete='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <textarea
                    type='text'
                    rows='4'
                    placeholder='What would you like to say to our team?'
                    className="w-full mb-4 text-lg p-2 rounded-xl outline-none bg-white placeholder:text-base"
                    required
                    autoComplete='off'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                {/* <div className='flex items-center mb-6'>
                    <input type='checkbox' required='true'/>
                    <p className='text-xs ml-2'>I consent to my personal data being submitted, <br/>so team can contact me.</p>
                </div> */}
                
                {showMessage ? (
                    <button
                        type="button"
                        onClick={() => setShowMessage(false)}
                        className='bg-gray-800 text-white w-full text-center px-6 py-2 rounded-xl'
                    >
                        Submit another message
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={!email.trim() || !name.trim() || !text.trim()}
                        className={`disabled:bg-white/50 ${themeTextColor[theme]?.[7]} transform transition-all hover:${themeTextColor[theme]?.[8]} w-full text-center px-6 py-2 rounded-xl font-semibold text-black`}
                    >
                        Submit
                    </button>
                )}
            </form>
                </Dialog.Panel>
        </div>
      </Dialog>
        </>
    )
}
