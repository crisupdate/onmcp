import Image from 'next/image'
import About from './About'

export default function MobileApp() {
    return (
        <>
            <div className="overflow-hidden z-20">
                <div className='z-[-20]'>
                    <Image
                        src='/assets/UXWEB/3d-contact.png'
                        className="absolute -right-60 -bottom-[30rem] md:-bottom-[36rem]"
                        alt=''
                        // layout='fill'
                        objectFit='cover'
                        width={800}
                        height={800}
                    />
                </div>
                <h1 className="mt-[8vw] lg:mt-[10vh] text-3xl text-center font-bold sm:text-4xl">
                    Our App is comming soon!
                </h1>
                
                <div className="mx-auto md:max-w-4xl lg:max-w-5xl xl:max-w-6xl flex flex-col-reverse gap-8 md:flex-row justify-between p-8 overflow-hidden">
                    <div className="mx-auto md:ml-20 my-auto">
                        <Image
                            src='/assets/UXWEB/wood-phone.png'
                            className="z-[-2] h-auto w-60"
                            alt=''
                            // layout='fill'
                            objectFit='cover'
                            width={500}
                            height={500}
                        />
                    </div>
                    <div className="my-auto z-0">
                        <h2 className='sm:text-xl sm:text-left max-w-2xl mx-auto'>Here you can create an account and use our services for free.<br/>Connect your payment details and car plate numbers.<br/>Choose the tools you need. Feel free to have access on any of our partners services!<br/><br/><i>-Let the barriers open in front of your car!</i></h2>
                        <button className=' mt-[4vh] lg:mt-[6vh] bg-gray-800 hover:bg-[#50c8ff] px-6 py-2 rounded-full text-white'>Join waiting list</button>
                    </div>
                </div> 
                <About/>
                
            </div>
        </>
    )
}