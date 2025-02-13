import { usePage } from '@inertiajs/react';
import { useState } from "react";
import UploadModal from '@/Components/UploadModal';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function Dashboard() {
    const { auth } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <Navbar />
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold">Welcome, {auth.user.name}!</h1>
                <p className="mt-4 text-gray-600">Manage your uploaded photos and AI-generated captions.</p>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    New Posting
                </button>
            </div>

            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <Footer />
        </div>
    );
}