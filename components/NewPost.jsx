import React, { useRef, useState } from "react";

import Button from "./Button";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Avatar from "./Avatar";

const NewPost = () => {
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");  
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  

  const fPicker = useRef(null);

  const { data: session } = useSession();

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      // setFileType(e.target.files[0].type);
      if (e.target.files[0].type.includes('image')) {
        setFileType('image');
        // console.log('it is image');
      } else if (e.target.files[0].type.includes('video')) {
        setFileType('video');
        // console.log('it is video');
      }
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
    document.getElementById('foo').style.cssText = 'display: none';
  };

  const sendPost = async () => {
    if (loading) return;

    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      text: input,
      title: title,
      file_type: fileType,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    // console.log(selectedFile);

    setLoading(false);
    setInput("");
    setTitle("");
    setSelectedFile(null);
  };

  return (
    <>
    <div
      className={`py-40 px-4 h-fit break-words max-w-lg mx-auto relative ${
        loading && "opacity-50"
      }`}
    >
      <div className="h-auto relative">
        <div className='flex w-full z-10 justify-between -mt-6 absolute'>
          <div className='flex pl-3'>
            <div className='rounded-full w-12 h-12 bg-white p-1'>
              <Avatar
                size={40}
                url={'/logosm.png'}
                username={'FDPC'}
              />
            </div> 
            <div className='ml-1'>
              <input
                className="outline-none border-none text-blue-500 placeholder:text-blue-300"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
              />
            </div> 
          </div>
        </div>

        {selectedFile && (
          <div className="h-auto min-h-fit bg-green-100 rounded-xl flex justify-center">
            {fileType === 'image' && <img src={selectedFile} layout="responsive" objectfit="contain" alt="pic" className="bg-center bg-cover object-cover object-center rounded-xl bg-no-repeat" />}      
            <div id='videohere' className="flex justify-center bg-green-100 rounded-xl">
                {fileType === 'video' && <video width="600" height="300" controls alt="post" className="rounded-xl" allowFullScreen frameBorder="0" scrolling="no">
                  <source className="bg-center z-10 bg-cover object-cover object-center bg-no-repeat w-full" src={selectedFile}></source>
                </video>}               
            </div>
            <div
              className="text-red-500 border border-red-500 bg-white px-2 h-7 absolute top-0 right-0 m-[10px] rounded-full cursor-pointer place-items-center"
              onClick={() => {
                setSelectedFile(null);
                fPicker.current.value = "";
                document.getElementById('foo').style.cssText = 'display: block';
              }}
            >
              Remove
            </div>
          </div>
        )}

        <label htmlFor="filePicker">
          <div id="foo" className="object-center bg-gray-300 rounded-xl h-14 cursor-pointer">
            <p className="font-medium text-gray-600 text-center pt-[0.85rem]">Select Photo/video</p>
          </div>

          <input
            type="file"
            name="filePicker"
            id="filePicker"
            accept="image/*"
            onChange={addImageToPost}
            ref={fPicker}
            hidden
          />
        </label>

        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`What is this post about?`}
          rows="8"
          className="mt-2 outline-none w-full">
        </textarea> 
      </div>
      <Button input={input} selectedFile={selectedFile} onClick={sendPost} />
    </div>
    </>

  );
};

export default NewPost;