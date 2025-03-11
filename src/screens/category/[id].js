"use client";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function CategoryPage() {
    const router = useRouter();
    const { id } = router.query;
    // Display category details and related fundraisers/projects (placeholder)
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username="salumusabri05" />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">Category: {id}</h1>
                <p>This page will show the projects and fundraisers related to this category.</p>
                <Link href="/" className="inline-block mt-4 text-blue-600">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}