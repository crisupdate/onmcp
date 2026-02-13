import React from "react";

const VideoInfo = () => {
  return (
    <div id="video" className={`p-4 w-full mx-auto md:max-w-4xl mb-20`}>
      {/* <h1 className="text-3xl md:text-4xl font-semibold leading-12 lg:leading-[1.2] animate-opacityWT mb-4 text-center">
        Meet our AI autopilot
      </h1>
      <h2
        className={`lg:text-lg w-full text-center text-zinc-500 transform duration-1000 delay-500 max-w-lg mx-auto mb-16 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >{`Make your Brand known with our AI autopilot powered by marketing specialists and softtware engineers`}</h2> */}
      <div className="font-thin w-full text-white">
        <div 
          className="w-full h-full shadow-2xl shadow-sky-200" 
        >
          <video
            width="1024"
            height="800"
            controls
            loop
            preload="auto"
            // muted
            // autoPlay
            playsInline
            className="w-full h-auto rounded-[18px]"
          >
            <source
              src="/awb/awbbusiness.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
