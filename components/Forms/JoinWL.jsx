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


export default function JoinWL() {
  // The open/closed state lives outside of the Dialog and is managed by you
  let [isOpen, setIsOpen] = useState(false)

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  


  const sendIt = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "waitlist"), {
      name: name,
      email: email,
      timestamp: serverTimestamp(),
    });
    // setIsOpen(false);

    setLoading(false);
    setEmail("");
    setName("");
    setIsSubmitted(true);
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className='mt-[4vh] lg:mt-[6vh] bg-gradient-to-br from-[#50c8ff] to-[#037ba2] hover:bg-[#50c8ff] px-6 py-2 rounded-full text-white shadow-md'>
        Join the waitlist →
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex flex-col justify-center z-50">
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <Dialog.Panel className={`bg-white shadow-lg m-4 rounded-3xl p-6 max-w-sm overflow-hidden`}>
            <Dialog.Title className="font-bold text-center text-3xl my-4">{isSubmitted ? "Thank You!" : "OCCO Access"}</Dialog.Title>
            <Dialog.Description className="text-center mb-4 text-sm">
              {isSubmitted ? "We've received your submission and will notify you when our service becomes available." : "Be the first to experience automatic access using just your car's license plate number"}
            </Dialog.Description>
            {isSubmitted ? null :
              <form onSubmit={sendIt} tabIndex='0'>
                <input
                  type='text'
                  placeholder='What is your full name?'
                  required='true'
                  autoComplete='cc-name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full my-4 text-lg p-2 rounded-lg outline-none placeholder-gray-400"
                />
                <input
                  type='email'
                  placeholder='What is your email?'
                  required='true'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-6 text-lg p-2 rounded-lg outline-none placeholder-gray-400"
                />
                <div className='flex items-center mb-6'>
                  <input type='checkbox' required='true'/>
                  <p className='text-xs ml-2'>I consent to my personal data being submitted, <br/>so OCCO team can contact me.</p>
                </div>
                <p className="text-center mb-4">
                  <b>Join the waitlist</b> and be notified when our service becomes available. Don't miss out on this <b>innovative solution</b> to make your life easier and more convenient. Join now!
                </p>
                <button
                  disabled={!email.trim() || !name.trim()}
                  type="submit"
                  className='bg-gradient-to-br from-[#50c8ff] to-[#037ba2] text-white w-full text-center mt-7 px-6 py-2 rounded-lg shadow-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Join
                </button>
              </form>
            }
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}