import React from 'react'
import BookingComponent from './BookingComponent'
import "../App.css"
function HeadersComponent() {
    const navlinks =["Home", "About","Services", "contact us"]
    return (

        <div className="w-screen md:py-2  bg-center bg-cover bg-place h-100 sm:py-0" >
            <nav className="px-2 rounded sm:px-4 sm:py-2 bg-slate-800 dark:bg-slate-800 md:w-700 md:py-2 md:mx-auto md:my-2 sm:mx-auto">
                <div className="container flex flex-wrap items-center justify-between mx-auto">
                    <a href="#" className="flex items-center sm:mx-2">
                        <span className="self-center mx-2 text-xl font-semibold text-white whitespace-nowrap dark:text-white">Hotelia</span>
                    </a>
                    <div className="flex md:order-2">
                        <button type="button" className=" my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Book a Room</button>
                        <button data-collapse-toggle="mobile-menu-4" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-4" aria-expanded="false">
                            <span className="sr-only">
                                Open main menu
                            </span>
                            <svg className="w-6 h-6" fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" >
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-4">
                        <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">


                            {
                            navlinks.map((link, idx)=>
                                    <li key={idx}>
                                    <a href="#" className="header-nav-links"
                                        aria-current="page">{link}</a>
                                </li>
                                
                            )}
                           
                           
                        </ul>
                    </div>
                </div>
            </nav>
            <BookingComponent />



        </div>


    )
}

export default HeadersComponent