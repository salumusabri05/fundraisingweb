"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Page() {
    // A simple donation page placeholder.
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username="salumusabri05" />
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold mb-6">Donate Now</h1>
                <p>This page is dedicated to collecting donations for various fundraisers.</p>
                <Link href="/fundraising/public" className="mt-4 inline-block text-blue-600">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}