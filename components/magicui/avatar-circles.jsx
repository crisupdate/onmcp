"use client";

import Image from "next/image";
import { useEffect, useState } from "react";


export const AvatarCircles = ({
  text,
  avatarUrls,
}) => {
const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=3")
      .then((res) => res.json())
      .then((data) => {
        setAvatars(
          data.results.map((user) => ({
            imageUrl: user.picture.thumbnail,
            profileUrl: `https://x.com/${user.login.username}`, // fake profile link
          }))
        );
      });
  }, []);

  return (
    <div className={"z-10 flex items-center -space-x-4 rtl:space-x-reverse w-fit rounded-full p-1 mb-8"}>
      {avatars.map((avatar, index) => (
        // <a
        //   key={index}
        //   href={avatar.profileUrl}
        //   target="_blank"
        //   rel="noopener noreferrer"
        // >
          <Image
            key={index + Math.random()}
            src={avatar.imageUrl}
            className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
            // src={url.imageUrl}
            width={40}
            height={40}
            alt={`Avatar ${index + 1}`}
            unoptimized
          />
        // </a>
      ))}
 
      <p
        className="pl-6 pr-2 flex h-10 w-fit items-center justify-center text-center text-sm font-medium text-zinc-500"
      >
        {text}
      </p>
 
    </div>
  );
};
