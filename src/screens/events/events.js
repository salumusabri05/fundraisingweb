"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Events() {
    // This page would list all charity events.
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username="salumusabri05" />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">Upcoming Charity Events</h1>
                {/* Replace with dynamic events content */}
                <p>All upcoming charity events will be listed here.</p>
                <Link href="/" className="inline-block mt-4 text-blue-600">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}