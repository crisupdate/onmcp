import Link from "next/link";

const BrandBadge = () => {
  return (
    <div className="relative w-32 h-8">
      <div className="absolute bottom-0 right-0 group w-32 hover:w-72 overflow-hidden h-8 hover:h-fit hover:p-4 bg-black backdrop-blur-md rounded-2xl border border-white/0 hover:border-white/30 transform duration-400">
        <div className="z-10 w-32 h-8 overflow-hidden rounded flex items-center justify-center bg-green-800 group-hover:h-16 group-hover:w-64 transform duration-200">
          <video
            width="300"
            height="100"
            loop
            preload="auto"
            muted
            autoPlay
            playsInline
            className="w-auto h-20 group-hover:h-40 transform duration-200"
          >
            <source src="https://content.aiwebserverdata.com/vds/awbbusiness.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="opacity-0 mt-[-32px] group-hover:opacity-100 group-hover:mt-2 transform duration-400">
          <h4 className="font-semibold text-[16px] opacity-10 group-hover:opacity-100 delay-100 transform duration-200 transition-opacity text-white">
            AWB Soft Ltd.
          </h4>
          <p className="text-zinc-400 text-xs mt-1 mb-4 opacity-10 group-hover:opacity-100 delay-200 transform duration-200 transition-opacity">
            Websites, custom CRM and bespoke SaaS solutions to help companies
            grow and work smarter.
          </p>
          <div className="w-full flex gap-2 justify-between items-end">
            <Link
              href={"https://awbbusiness.com"}
              target="blank"
              className="px-4 py-1 bg-white rounded-full text-black hover:bg-sky-400"
            >
              Visit website
            </Link>
            <Link
              href={"https://awbbusiness.com"}
              target="blank"
              className="text-zinc-400 hover:text-sky-400 opacity-10 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 delay-300 transform duration-400 transition-all"
            >
              awbbusiness.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandBadge;
