"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar({ username }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div>
                    <Link href="/" className="text-2xl font-bold">
                        University Fundraising
                    </Link>
                </div>
                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <ul className="flex space-x-6">
                        <li>
                            <Link href="/" className="hover:text-blue-200">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-200">
                                Fundraisers
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-200">
                                Donate
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-200">
                                Announcements
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-200">
                                Events
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-blue-200">
                                Scholarships
                            </Link>
                        </li>
                    </ul>
                </div>
                {/* User Greeting / Login - Desktop */}
                <div className="hidden md:block">
                    {username ? (
                        <span className="font-medium">Welcome, {username}!</span>
                    ) : (
                        <Link href="#" className="hover:text-blue-200">
                            Login
                        </Link>
                    )}
                </div>
                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="focus:outline-none hover:text-blue-200"
                    >
                        {isMobileMenuOpen ? (
                            // Close Icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            // Hamburger Icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-blue-600">
                    <ul className="px-4 pt-4 pb-6 space-y-4">
                        <li>
                            <Link href="/" className="block hover:text-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="block hover:text-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                Fundraisers
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="block hover:text-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                Donate
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="block hover:text-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                Announcements
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="block hover:text-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                Events
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="block hover:text-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                Scholarships
                            </Link>
                        </li>
                        <li>
                            {username ? (
                                <span className="block font-medium">Welcome, {username}!</span>
                            ) : (
                                <Link href="#" className="block hover:text-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                    Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}