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


export default function ContactForm() {

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
            <form id='contact' onSubmit={submitIt} className="backdrop-blur-[18px] w-full h-50 shadow-perfect rounded-3xl p-4 md:max-w-md shadow-[#50c8ff72] border border-white z-0 bg-[#83d8ff] bg-opacity-30">
                {showMessage ? (
                    <h2 className="font-bold text-center text-2xl mt-4 md:mt-0">Thank you for message!</h2>
                ) : (
                    <h2 className="font-bold text-center text-2xl mt-4 md:mt-0">Get in touch with us</h2>
                )}
                <input
                    type='text'
                    placeholder='What is your full name?'
                    className="w-full my-4 text-lg p-2 rounded-lg outline-none bg-white placeholder:text-base"
                    required='true'
                    autoComplete='cc-name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type='text'
                    placeholder='What is your email?'
                    className="w-full mb-4 text-lg p-2 rounded-lg outline-none bg-white placeholder:text-base"
                    required='true'
                    autoComplete='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <textarea
                    type='text'
                    rows='4'
                    placeholder='What would you like to say to our team?'
                    className="w-full mb-4 text-lg p-2 rounded-lg outline-none bg-white placeholder:text-base"
                    required='true'
                    autoComplete='off'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className='flex items-center mb-6'>
                    <input type='checkbox' required='true'/>
                    <p className='text-xs ml-2'>I consent to my personal data being submitted, <br/>so OCCO team can contact me.</p>
                </div>
                
                {showMessage ? (
                    <button
                        type="button"
                        onClick={() => setShowMessage(false)}
                        className='bg-gray-800 text-white w-full text-center text- px-6 py-2 rounded-lg'
                    >
                        Submit another message
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={!email.trim() && !name.trim() && !text.trim()}
                        className='disabled:border disabled:border-gray-800 bg-gray-800 text-white w-full text-center text- px-6 py-2 rounded-lg'
                    >
                        Submit
                    </button>
                )}
            </form>
        </>
    )
}
