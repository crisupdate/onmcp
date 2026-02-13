import Link from 'next/link'
import { Fragment, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import Image from 'next/image'
import BrandBadge from './brandBadge'

const navigation = {
    pages: [
        { name: 'Solutions', href: '/' },
        { name: 'Technology', href: '/#technology' },
        { name: 'App', href: '/#app' },
        { name: 'About', href: '/#app' },
        { name: 'Contact', href: '/#app' },
    ],
  }

export default function Footer() {
    const [open, setOpen] = useState(false);
    
    return (
    <>
        <div className="z-20 bottom-0 w-full">
            {/* Mobile menu */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 flex z-40" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className="relative max-w-[12rem] w-full bg-white shadow-xl pb-12 flex flex-col gap-12 justify-between overflow-y-auto p-4 rounded-r-3xl">
                    <div
                    className="rounded-md inline-flex items-center justify-left outline-none"
                    onClick={() => setOpen(false)} // change isNavOpen state to false to close the menu
                    >
                        <svg
                        className="h-8 w-8 text-gray-800"
                        viewBox="0 10 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                            {/* <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" /> */}
                            
                            <line x1="18" y1="18" x2="6" y2="18" className='my-auto'/>
                        </svg>
                    </div>

                    

                    {/* Links */}
                    <Tab.Group as="div" className="mt-2">
                        <Tab.Panels as={Fragment}>  
                        <div className="space-y-2 cursor-pointer">
                            <>
                                {navigation.pages.map((page) => (
                                <div key={page.name} className="text-left" onClick={() => setOpen(false)}>
                                    <Link href={page.href} className="px-8 py-2 block text-gray-800 hover:text-[#50c8ff]">
                                        {page.name}
                                    </Link>
                                </div>
                                ))}
                                
                            </> 
                        </div>
                        </Tab.Panels>
                    </Tab.Group>   
                    <div className='h-8 w-8'/>            

                    
                    </div>
                </Transition.Child>
                </Dialog>
            </Transition.Root>

            <header className="relative w-full bg-gray-800">

                <nav aria-label="Bottom" className="mx-auto max-w-6xl px-8">
                {/* backdrop-blur-sm */}
                <div className="">
                    <div className="h-10 flex items-center justify-between mt4">
                    
                    {/* <div className='align-middle text-xs text-white inline-flex max-w-xs'>
                        Powered by 
                            <Link href='/' className='content-center relative w-14 mx-[4px]'>
                                <Image
                                    fill
                                    objectFit='contain'
                                    src="/assets/icon/logocco-sm.png"
                                    alt="Logo"
                                />
                            </Link>
                        development team
                    </div> */}
                    <BrandBadge/>
                    
                    <div>
                    
                    <div className="HAMBURGER-ICON" onClick={() => setOpen(true)}>
                        <button className="focus:outline-none pb-2 rounded-md text-white flex">
                            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 0000 M20 12H10M8 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                </path>
                            </svg>
                        </button>
                    </div>  
                    </div>

                    </div>
                </div>
                </nav>
            </header>
        </div>

    </>
    );
}