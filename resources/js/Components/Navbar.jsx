import { Link, usePage } from '@inertiajs/react';

export default function Navbar({ setIsModalOpen }) {
    const { props } = usePage();
    const auth = props.auth || { user: null }; // ✅ Prevent errors if auth is missing
    
    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="text-xl font-bold">
                <Link href="/">PromoEase</Link>
            </div>
            
            <div className="space-x-4 flex items-center">
                {auth.user ? (
                    <>
                        {/* ✅ Show "New Posting" button ONLY if on Dashboard */}
                        {route().current('dashboard') && (
                            <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white">
                                + New Posting
                            </button>
                        )}

                        <Link href={route('dashboard')} className="text-gray-700 hover:text-gray-900">
                            Dashboard
                        </Link>

                        {/* TODO */}
                        <Link href={route('dashboard')} className="hover:underline text-gray-700">
                            Account
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href={route('login')} className="text-gray-700 hover:text-gray-900">
                            Login
                        </Link>
                        <Link href={route('register')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}