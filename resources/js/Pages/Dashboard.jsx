import { useState, useEffect } from "react";
import UploadModal from '@/Components/UploadModal';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // 🔹 Fetch posts from API with pagination
    const fetchPosts = (page = 1) => {
        fetch(`/api/posts?page=${page}`)
            .then(response => response.json())
            .then(data => {
                console.log("📥 API response:", data); // Debugging
                setPosts(data.data);
                setCurrentPage(data.current_page);
                setLastPage(data.last_page);
            })
            .catch(error => console.error("Error fetching posts:", error));
    };

    // 🔹 Fetch posts when the component mounts
    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div>
            {/* 🔥 Pass setIsModalOpen to Navbar */}
            <Navbar setIsModalOpen={setIsModalOpen} />

            <div className="container mx-auto px-4 py-10">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <h1 className="text-3xl font-bold">Welcome!</h1>
                        <p className="mt-4 text-gray-600">Manage your uploaded photos and AI-generated captions.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold"
                        >
                            + New Posting
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 
                            className="text-2xl font-semibold mb-4 cursor-pointer hover:underline"
                            onClick={() => fetchPosts(1)} // 🔥 Reset to page 1 when clicked
                        >
                            Your Posts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {posts.map(post => (
                                <div key={post.id} className="border rounded-lg shadow p-4">
                                    <img src={`/storage/${post.upload.image_path}`} alt="Uploaded" className="w-full h-40 object-cover rounded-md" />
                                    <p className="mt-2 text-gray-700 font-bold">
                                        <a href={`https://www.${post.platform_name}.com`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {post.platform_name}
                                        </a>
                                    </p>
                                    <p className="text-sm text-gray-500">{post.caption}</p>
                                    <p className="text-sm text-gray-400">
                                        Posted on: {post.created_at ? new Date(post.created_at).toLocaleString() : "No date available"}
                                    </p>
                                    <span className={`mt-2 block text-sm font-bold ${post.status === 'posted' ? 'text-green-500' : post.status === 'failed' ? 'text-red-500' : 'text-yellow-500'}`}>
                                        {post.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* 🔹 Pagination Controls */}
                        <div className="flex justify-between mt-6">
                            <button 
                                disabled={currentPage === 1} 
                                onClick={() => fetchPosts(currentPage - 1)} 
                                className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            >
                                Previous
                            </button>

                            <span className="text-gray-700">Page {currentPage} of {lastPage}</span>

                            <button 
                                disabled={currentPage === lastPage} 
                                onClick={() => fetchPosts(currentPage + 1)} 
                                className={`px-4 py-2 rounded ${currentPage === lastPage ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />

            {/* 🔹 Upload Modal with auto-close after success */}
            <UploadModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    fetchPosts(currentPage); // ✅ Keeps user on the same page after posting
                }}
            />
        </div>
    );
}