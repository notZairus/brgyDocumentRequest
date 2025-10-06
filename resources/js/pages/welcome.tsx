import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { FileText, UserRoundPlus } from "lucide-react";


export default function Welcome() {

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            <div className="bg-white w-full min-h-dvh relative">
                <header className="w-full z-10 bg-matictic h-20 flex items-center justify-center lg:justify-between px-24 py-4 shadow fixed">
                    <div className="aspect-square h-full bg-red-400 overflow-hidden rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all" >
                        <img src="/logo_matictic.jpg" alt="matictic logo" className="w-full object-fit" />
                    </div>
                    <div className="lg:flex items-center gap-12 hidden text-white">

                        <nav className="space-x-5 text-lg">
                            <Link href="#home">Home</Link>
                            <Link href="#about">About</Link>
                            <Link href="#features">Features</Link>
                            <Link href="#services">Services</Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link href="/login" >
                                <Button size="lg" variant="secondary" className="text-white cursor-pointer border-white border-2 bg-transparent hover:bg-black/25 ">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer">
                                    Register
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <p id="home"></p>

                <main className="w-full pt-32 lg:pt-20 bg-matictic/5">
                    <section className="mt-20">
                        <div className="w-full h-full flex flex-col lg:flex-row gap-8 max-w-11/12 lg:max-w-[960px] mx-auto">
                            <div className="flex-1 flex flex-col  justify-center">
                                <h1 className="text-5xl font-bold text-matictic w-full">
                                    <span className="text-yellow-400 font-black text-5xl"><span className='text-6xl'>R</span>EQ<span className='text-6xl'>M</span>ATIC</span>
                                    <br/>
                                    Matictic Document Request Platform</h1>
                                <p className="text-black/80 text-xl tracking-wider mt-4">Digital Document Request Platform for Matictic Residents</p>
                                <div className="mt-8 flex items-center gap-4">
                                    <Link as="button" href="/dashboard" className="text-matictic lg:text-lg flex items-center gap-2 hover:bg-yellow-500 transition-all bg-yellow-400 border-2 border-yellow-400 px-4 py-2 rounded-md" >
                                        <FileText size={24} />
                                        Request Document
                                    </Link>
                                    <Link as="button" href="/register" className="text-matictic lg:text-lg flex items-center gap-2 hover:bg-black/5 transition-all border-2 border-matictic px-4 py-2 rounded-md" >
                                        <UserRoundPlus size={24} />
                                        Register Now
                                    </Link>
                                </div>
                            </div>
                            <div className="flex-1 items-center justify-center flex">
                                <div className="aspect-square w-4/5 rounded-full overflow-hidden bg-transparent">
                                    <img src="/logo_matictic.jpg" alt="matictic-logo" className="blur-[1px]"/>
                                </div>

                            {/* FILL  */}

                            </div>
                        </div>
                    </section>

                    <section className="w-full" >
                        <p id="about" className="pt-20"></p>
                        <div className="bg-yellow-400 py-12">
                            <h1 className="text-center text-4xl text-matictic font-bold" >About The Platform</h1>
                            <p className="text-black/80 text-xl tracking-wider mt-4 md:max-w-2/3 max-w-10/12 text-center mx-auto">The Barangay Matictic Document Request System is your online gateway to efficient document request process. We've designed this system to make it easy for you to request and obtain essential documents from barangay hall, saving you time and effort.</p>
                        </div>
                    </section>

                    <section className="bg-gray-50 py-16" id="features">
                        <div className="max-w-6xl mx-auto px-6 text-center text-black">
                            <h1 className="text-4xl md:text-5xl font-bold text-matictic mb-6">
                                Key Features
                            </h1>
                            <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                                Discover what makes our system the best choice for your document needs.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Feature Card */}
                                <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform p-8 text-center">
                                    <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-yellow-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">Easy to Use</h2>
                                    <p className="text-gray-600 text-lg">
                                        Requesting documents has never been easier. Our system is designed to be user-friendly so you can quickly and easily request the documents you need.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform p-8 text-center">
                                    <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                        <svg
                                            className="w-8 h-8 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">Fast and Efficient</h2>
                                    <p className="text-gray-600 text-lg">
                                        Our system allows you to request documents online, which saves you time and effort. You can also track the status of your request online.
                                    </p>
                                </div>

                            <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform p-8 text-center">
                                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h13M3 9h4v6H3z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Secure and Reliable</h2>
                                <p className="text-gray-600 text-lg">
                                    We take the security and integrity of your personal information and documents seriously. Our system is designed to ensure that your information is protected and secure.
                                </p>
                            </div>
                            </div>
                        </div>
                    </section>

                    <section className="py-16 bg-yellow-400" id="services">
                        <div className="max-w-5xl mx-auto text-center px-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-matictic mb-4">
                                Our Services
                            </h1>
                            <p className="text-matictic max-w-2xl mx-auto mb-12">
                                We provide essential documents for your needs. Choose from the services below.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                                {/* Service Card */}
                                <div className="bg-white/90 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform p-8 flex flex-col items-center">
                                    <div className="bg-yellow-100 p-4 rounded-full mb-4">
                                        <FileText className="w-8 h-8 text-yellow-500" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800 text-center">
                                        Certificate of Indigency
                                    </h2>
                                </div>

                                <div className="bg-white/90 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform p-8 flex flex-col items-center">
                                    <div className="bg-green-100 p-4 rounded-full mb-4">
                                        <FileText className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800 text-center">
                                        Certificate of Residency
                                    </h2>
                                </div>

                                <div className="bg-white/90 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform p-8 flex flex-col items-center">
                                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                                        <FileText className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800 text-center">
                                        Certificate of Employment
                                    </h2>
                                </div>

                                <div className="bg-white/90 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform p-8 flex flex-col items-center">
                                    <div className="bg-purple-100 p-4 rounded-full mb-4">
                                        <FileText className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800 text-center">
                                        Barangay Clearance
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-matictic w-full items-center justify-center shadow" id="services">
                    <div className="flex items-center justify-center p-4 bg-[#f9fafb]">
                        <p className="tracking-widest text-center text-black">Developed by Group ABC for their research subject.</p>
                    </div>
                    <div className="flex items-center justify-center p-5 bg-matictic">
                        <p className="text-white text-center tracking-wider">
                            Copyright &copy; {new Date().getFullYear()} Barangay Matictic. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
