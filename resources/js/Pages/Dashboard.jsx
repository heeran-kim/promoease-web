import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function Dashboard({ auth }) {
    return (
        <div>
            <Navbar auth={auth} />
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold">Welcome, {auth.user.name}!</h1>
                <p className="mt-4 text-gray-600">Manage your uploaded photos and AI-generated captions.</p>
            </div>
            <Footer />
        </div>
    );
}