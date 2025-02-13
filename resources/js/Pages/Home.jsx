import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react'; 

export default function Home() {
    return (
        <div>
            <Navbar auth={false} />
            
            <header className="bg-gray-100 text-center py-20">
                <h1 className="text-4xl font-bold">Effortless Social Media Marketing</h1>
                <p className="mt-4 text-gray-600">
                    Upload a photo, generate captions with AI, and post across platforms with one click!
                </p>
                <Link
                    href={route('register')}
                    className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded"
                >
                    Get Started
                </Link>
            </header>

            <Footer />
        </div>
    );
}