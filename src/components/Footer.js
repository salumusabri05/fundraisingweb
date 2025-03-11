"use client";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="container mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Brand Section */}
                    <div className="mb-4 md:mb-0">
                        <Link href="/">
              <span className="text-xl font-bold text-white cursor-pointer">
                University Fundraising
              </span>
                        </Link>
                        <p className="text-sm mt-2">
                            Empowering Communities, One Campaign at a Time.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex space-x-6">
                        <Link href="../screens/abouts/AboutUs.js">
              <span className="hover:text-white cursor-pointer">
                About Us
              </span>
                        </Link>
                        <Link href="../screens/abouts/AboutUs.js">
              <span className="hover:text-white cursor-pointer">
                Contact
              </span>
                        </Link>
                        <Link href="../screens/abouts/AboutUs.js">
              <span className="hover:text-white cursor-pointer">
                Privacy Policy
              </span>
                        </Link>
                        <Link href="../screens/abouts/AboutUs.js">
              <span className="hover:text-white cursor-pointer">
                Terms of Service
              </span>
                        </Link>
                    </div>

                    {/* Social Media Links */}
                    <div className="mt-4 md:mt-0">
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white"
                            >
                                Twitter
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white"
                            >
                                Facebook
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white"
                            >
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-6 text-center text-sm border-t border-gray-700 pt-4">
                    &copy; {new Date().getFullYear()} University Fundraising. All rights reserved.
                </div>
            </div>
        </footer>
    );
}