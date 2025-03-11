"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Announcements() {
    // This page would list all announcements.
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username="salumusabri05" />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">Announcements</h1>
                {/* Replace with dynamic announcement content */}
                <p>Listing of all charity announcements will appear here.</p>
                <Link href="/fundraising/public" className="inline-block mt-4 text-blue-600">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}