import Image from 'next/image'
import ContactForm from './Forms/ContactForm'
import MobileApp from './MobileApp'
import JoinWL from './Forms/JoinWL'

export default function Technology() {
    return (
        <>
            <div id='technology' className="p-8 bg-white relative overflow-hidden">
                {/* <div className=''>
                    <Image
                        src='/assets/UXWEB/3d-tech.png'
                        className="absolute -left-60 top-[20%] sm:-bottom-12 brightness-[105%]"
                        alt=''
                        // layout='fill'
                        objectFit='cover'
                        width={600}
                        height={600}
                    />
                </div> */}
                <h1  className="mt-[8vw] lg:mt-[10vh] text-3xl text-center font-bold sm:text-4xl">
                    How it works
                </h1>
                {/* <h2 className='sm:text-xl mt-6 sm:text-center max-w-2xl mx-auto'>We opperate in areas such as public and private parkings, fast food chains, business private areas, gas/ electric stations and road taxes payment.</h2> */}
                <div className="flex flex-col px-[14vw] sm:px-0 sm:flex-row mt-20 gap-[4vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
                    
                    <div className="z-10 bg-white w-full rounded-[2rem] shadow-perfect shadow-[#50c8ff72] text-sm p-4 md:w-1/3 md:text-base md:p-8 text-center border border-[#50c8ff]">
                        <Image
                            layout="responsive"
                            objectFit="contain"
                            width={'6'}
                            height={'4'}
                            quality={65}
                            src={'/assets/UXWEB/slide1.png'}
                            alt={'Post image'}
                            className="bg-center bg-cover object-cover object-center rounded-tl-xl rounded-b-xl bg-no-repeat"
                        />
                        <p>1. Registration. Link your car’s license plate with your bank account in the OCCO Access app.
                        </p>
                    </div>
                    <div className="z-10 bg-white w-full rounded-[2rem] shadow-perfect shadow-[#50c8ff72] text-sm p-4 md:w-1/3 md:text-base md:p-8 text-center border border-[#50c8ff]">
                        <Image
                            layout="responsive"
                            objectFit="contain"
                            width={'6'}
                            height={'4'}
                            quality={65}
                            src={'/assets/UXWEB/slide2.png'}
                            alt={'Post image'}
                            className="bg-center bg-cover object-cover object-center rounded-tl-xl rounded-b-xl bg-no-repeat"
                        />
                        <p>2. Detection. When you approach the parking lot, our camera scans the license plate, logs the entry time and opens the gate.</p>
                    </div>
                    <div className="z-10 bg-white w-full rounded-[2rem] shadow-perfect shadow-[#50c8ff72] text-sm p-4 md:w-1/3 md:text-base md:p-8 text-center border border-[#50c8ff]">
                        <Image
                            layout="responsive"
                            objectFit="contain"
                            width={'6'}
                            height={'4'}
                            quality={65}
                            src={'/assets/UXWEB/slide3.png'}
                            alt={'Post image'}
                            className="bg-center bg-cover object-cover object-center rounded-tl-xl rounded-b-xl bg-no-repeat"
                        />
                        <p>3. Payment. On exit the camera scans the plate and sends a payment confirmation.
                        </p>
                    </div>
                </div>

                {/* MobileApp */}
                <div className='z-0'>
                    <Image
                        src='/assets/UXWEB/3d-contact.png'
                        className="absolute -right-60 top-[80%] md:top-[56%] brightness-[105%]"
                        alt=''
                        // layout='fill'
                        objectFit='cover'
                        width={550}
                        height={550}
                    />
                </div>

                <div className='max-w-4xl mx-auto mt-60'>
                    <h2 className='text-lg sm:text-2xl font-semibold sm:text-left relative z-10'>
                    Key advantages of OCCO Access:
                    </h2>

                    <br/><br/>
                        <b className='text-xl'>1. Better user experience:</b> 
                        <p>Ease and intuitive process for any driver, with no need for tickets, cash or banking cards. Instant, automatic payments eliminate queues, delays, and frustration.
                        </p><br/>
                        <b className='text-xl'>2. Fraud prevention and Improved security:</b> 
                        <p>Encrypted direct bank transactions reduce fraud by eliminating card and cash related risks.</p><br/>
                        <b className='text-xl'>3. Faster turnover:</b>
                        <p>Quick entry and exit via license plate recognition improves parking efficiency, reduces congestion and waiting times, especially during peak hours.</p><br/>
                        <b className='text-xl'>4. Smart pricing</b>
                        <p>Digital system enables smarter pricing strategies (e.g. peak pricing,  pre-booking, extending parking time). Automatic payments upon exit prevent unpaid stays and customer penalties.</p>
                </div>       
                
                <div id='app' className="mt-20 md:mt-60 mx-auto md:max-w-4xl lg:max-w-5xl xl:max-w-6xl flex flex-col-reverse gap-8 md:flex-row justify-between overflow-hidden">
                    <div className="mx-auto md:ml-20 my-auto z-0">
                        <Image
                            src='/assets/UXWEB/wood-phone.png'
                            className="z-[-2] h-auto w-60 rounded-br-[4rem]"
                            alt=''
                            // layout='fill'
                            objectFit='cover'
                            width={500}
                            height={500}
                        />
                    </div>
                    <div className="my-auto z-0">
                        <h1 className="text-3xl text-left font-bold sm:text-4xl">
                            OCCO Access app is coming soon!
                        </h1>
                        <h2 className='sm:text-xl sm:text-left max-w-2xl mx-auto mt-6'>
                            In the app you can create an account and use our services for free.<br/>
                            Connect your payment details and car number plate.<br/>
                            Feel free to use any of our partners services.<br/>
                            <i>Let the barriers open in front of you.</i>
                        </h2>
                        <JoinWL/>
                    </div>
                </div> 

                {/* About */}
                <div id='about' className="mt-20 md:mt-40 mx-auto md:max-w-4xl lg:max-w-5xl xl:max-w-6xl flex flex-col gap-16 md:gap-8 md:flex-row justify-between md:p-8 overflow-hidden">
                    <div className="my-auto z-0 md:max-w-md">
                        <p className='sm:text-xl sm:text-left max-w-2xl mx-auto mt-6'>
                            OCCO Access is a fintech startup founded to simplify people’s everyday routine using AI. Join us in improving the future of payments!
                        </p>
                    </div>
                    <ContactForm/>                    
                </div> 

            </div>
        </>
    )
}