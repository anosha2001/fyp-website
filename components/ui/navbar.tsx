"use client";

import Link from "next/link";
import Logo from "./logo";

const navLinks = [
    { name: "Home", path: "/" },
    { name: "History", path: "/history" },
    { name: "Settings", path: "/settings" },
    { name: "Logout", path: "/signin" },
];

export default function Navbar() {
    return (
        // <nav className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm">
        //     <div className="container mx-auto flex items-center">
        //         {/* Left-aligned Logo */}
        //         <div className="mr-auto">
        //             <Logo />
        //         </div>

        //         {/* Centered Navigation Links */}
        //         <div className="flex-grow flex justify-center">
        //             <ul className="flex space-x-6 text-lg font-medium">
        //                 {navLinks.map((link) => (
        //                     <li key={link.path}>
        //                         <Link
        //                             href={link.path}
        //                             className="px-4 py-2 hover:text-blue-400 transition-colors"
        //                         >
        //                             {link.name}
        //                         </Link>
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //     </div>
        // </nav>

        <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-full px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Desktop sign in links */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`px-4 py-2 hover:text-blue-400 transition-colors`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
    );
}