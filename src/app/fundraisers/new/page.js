"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FaPlus, FaDollarSign, FaImage, FaCalendarAlt, FaInfoCircle, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function NewFundraiser() {
    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [goalAmount, setGoalAmount] = useState("");
    const [endDate, setEndDate] = useState("");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [user, setUser] = useState(null);

    // UI state
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    // Category options
    const categories = [
        "Student Projects",
        "Campus Improvement",
        "Academic Research",
        "Sports Teams",
        "Arts & Culture",
        "Student Emergency",
        "Community Service",
        "Technology",
        "Other"
    ];

    // Get current user on component mount
    useEffect(() => {
        async function getUser() {
            const { data } = await supabase.auth.getUser();
            if (data && data.user) {
                setUser(data.user);
            } else {
                router.push("/auth/login?redirect=/fundraisers/new");
            }
        }
        getUser();

        // Set default end date to 30 days from now
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        setEndDate(thirtyDaysFromNow.toISOString().split('T')[0]);
    }, [router]);

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            setErrors({...errors, image: "Please select an image file"});
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors({...errors, image: "Image must be less than 5MB"});
            return;
        }

        setImage(file);
        setErrors({...errors, image: null});

        // Create a preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) newErrors.title = "Title is required";
        else if (title.length < 5) newErrors.title = "Title must be at least 5 characters";

        if (!description.trim()) newErrors.description = "Description is required";
        else if (description.length < 20) newErrors.description = "Please provide a more detailed description (at least 20 characters)";

        if (!category) newErrors.category = "Please select a category";

        if (!goalAmount) newErrors.goalAmount = "Goal amount is required";
        else if (parseFloat(goalAmount) <= 0) newErrors.goalAmount = "Goal amount must be greater than zero";

        if (!endDate) newErrors.endDate = "End date is required";
        else {
            const selectedDate = new Date(endDate);
            const today = new Date();
            if (selectedDate <= today) newErrors.endDate = "End date must be in the future";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Create fundraiser
    async function handleCreateFundraiser() {
        if (!validateForm()) return;

        setLoading(true);

        try {
            let uploadedImageUrl = null;

            // Upload image if provided
            if (image) {
                const fileName = `fundraiser-${Date.now()}-${image.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('fundraiser-images')
                    .upload(fileName, image);

                if (uploadError) throw uploadError;

                // Get public URL for the uploaded image
                const { data: { publicUrl } } = supabase.storage
                    .from('fundraiser-images')
                    .getPublicUrl(fileName);

                uploadedImageUrl = publicUrl;
            }

            // Insert fundraiser data
            const { data, error } = await supabase.from("fundraisers").insert([
                {
                    title,
                    description,
                    category,
                    goal_amount: parseFloat(goalAmount),
                    end_date: endDate,
                    image_url: uploadedImageUrl,
                    created_by: user.id,
                    amount_raised: 0, // Starting with 0
                }
            ]).select();

            if (error) throw error;

            router.push(`/fundraisers/${data[0].id}`);
        } catch (error) {
            console.error("Error creating fundraiser:", error);
            alert("Failed to create fundraiser. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-10">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full mr-4">
                        <FaPlus className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Start Your Fundraiser</h1>
                        <p className="text-gray-600">Make a difference in the university community</p>
                    </div>
                </div>

                {/* Form instructions */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaInfoCircle className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Before you begin</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>Creating a compelling fundraiser increases your chances of success. Be sure to:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Write a clear, specific title</li>
                                    <li>Provide detailed information about your cause</li>
                                    <li>Set a realistic funding goal</li>
                                    <li>Add a high-quality image (recommended)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                            Fundraiser Title*
                        </label>
                        <input
                            id="title"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            type="text"
                            placeholder="E.g., Engineering Club Robot Competition Fund"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                            Category*
                        </label>
                        <select
                            id="category"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                            Description*
                        </label>
                        <textarea
                            id="description"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32`}
                            placeholder="Explain your cause, how the funds will be used, and why it matters. Be specific to build trust with potential donors."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        <p className="text-xs text-gray-500 mt-1">Minimum 20 characters. A detailed description increases your chances of receiving donations.</p>
                    </div>

                    {/* Row with goal amount and end date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Goal Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="goalAmount">
                                Goal Amount ($)*
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaDollarSign className="text-gray-500" />
                                </div>
                                <input
                                    id="goalAmount"
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.goalAmount ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    type="number"
                                    placeholder="1000"
                                    value={goalAmount}
                                    onChange={(e) => setGoalAmount(e.target.value)}
                                />
                            </div>
                            {errors.goalAmount && <p className="mt-1 text-sm text-red-500">{errors.goalAmount}</p>}
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endDate">
                                End Date*
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCalendarAlt className="text-gray-500" />
                                </div>
                                <input
                                    id="endDate"
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
                            <p className="text-xs text-gray-500 mt-1">Campaign duration is typically 1-30 days</p>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fundraiser Image <span className="text-gray-500">(Recommended)</span>
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                                {previewUrl ? (
                                    <div className="mb-4">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="mx-auto h-40 w-auto object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImage(null);
                                                setPreviewUrl("");
                                            }}
                                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="text-sm text-gray-500">
                                            <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                                Upload an image
                                            </span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                )}

                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />

                                {!previewUrl && (
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                    >
                                        <span className="inline-block px-3 py-1 border border-blue-600 rounded-md mt-2">
                                            Browse files
                                        </span>
                                    </label>
                                )}

                                {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Fundraisers with images receive 5x more donations on average
                        </p>
                    </div>

                    {/* Terms and Submit */}
                    <div>
                        <div className="bg-gray-50 p-4 rounded text-sm text-gray-600 mb-4">
                            By creating this fundraiser, you agree to our <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. All fundraisers must comply with university guidelines.
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href="#"
                                className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                onClick={handleCreateFundraiser}
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin inline mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Fundraiser"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips and Best Practices */}
            <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tips for a Successful Fundraiser</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-medium text-green-700">Set a realistic goal</h3>
                        <p className="text-sm text-gray-600">Consider your network size and how much each person might donate.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-medium text-green-700">Share your story</h3>
                        <p className="text-sm text-gray-600">Personal stories drive emotional connections and increase donations.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-medium text-green-700">Promote on social media</h3>
                        <p className="text-sm text-gray-600">Use your network to reach potential donors and share updates.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-medium text-green-700">Update supporters</h3>
                        <p className="text-sm text-gray-600">Keep donors engaged with progress updates and thank them often.</p>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <Link href="#" className="text-blue-600 hover:underline text-sm">
                        View our complete fundraising guide →
                    </Link>
                </div>
            </div>
        </div>
    );
}