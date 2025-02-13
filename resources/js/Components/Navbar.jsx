import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { auth } = usePage().props;
    
    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="text-xl font-bold">
                <Link href="/">PromoEase</Link>
            </div>
            
            <div className="space-x-4">
                {auth.user ? (
                    <Link href={route('dashboard')} className="text-gray-700 hover:text-gray-900">
                        Dashboard
                    </Link>

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