import Image from 'next/image'
import ContactForm from './Forms/ContactForm'

export default function About() {
    return (
        <>
            <div className="p-8 mt-20 bg-white overflow-hidden">  
                <div className="mx-auto md:max-w-4xl lg:max-w-5xl xl:max-w-6xl flex flex-col gap-16 md:gap-8 md:flex-row justify-between p-8 overflow-hidden">
                    <div className="my-auto z-0 md:max-w-md">
                        <h1 className="text-3xl text-left font-bold sm:text-4xl">About us</h1>
                        <h2 className='sm:text-xl sm:text-left max-w-2xl mx-auto mt-6'>OCCO is a tech project founded by a team that sees the opportunities of new technologies and wants to simplify people's everyday routine using artificial intelligence.</h2>
                    </div>
                    <ContactForm/>                    
                </div> 
            </div>
        </>
    )
}