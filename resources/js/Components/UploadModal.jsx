import { useState } from "react";
import { useForm } from "@inertiajs/react";

// isOpen: Controls whether the modal is visible.
// onClose: Function that closes the modal when the user clicks "Close".
export default function UploadModal({ isOpen, onClose }) {
    // React Hooks are special functions that allow functional components to have state and lifecycle features
    // (things like component mounting, updating, and unmounting).
    // useState(), useEffect(), and useform() are all hooks.

    // useState is a React Hook that allows components to have state
    // If you want state management and automatic re-rendering, you must use useState().
    // Without useState(), you can store values in normal variables (let image = file;),
    // but React will not track changes (does not trigger UI re-rendering when updated).
    // React finds all components using the variable and updates them automatically.

    // let is a JavaScript keyword used to declare a variable that can be reassigned.
    // let is valid within block {} only. var isvalid within function.
    // const, on the other hand, cannot be reassigned.
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const { post, processing } = useForm();
    // you can use only post or only processing if you want.
    // data, setData, processing, errors, reset

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file); // React automatically re-renders any UI that uses 'image'
    }

    // JavaScript is asynchronous and non-blocking all other UI actions
    // async () => {} runs the code inside it asynchronously, but the rest of the UI keeps working.
    // async: Marks a function as asynchronous.
    const generateCaption = async () => {
        if (!image) return alert("Upload an Image and Generate an AI-powered Caption.");
        
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", image);
            
            // await: Waits for an asynchronous operation to finish before moving on.
            // waits within the function only
            // Without await, the code does not wait for fetch().
            
            // fetch() manually sends an HTTP request. (manual API request)
            const response = await fetch("/api/generate-caption", { 
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setCaption(data.caption || "AI caption is cannot be generated.");
        } catch (error) {
            console.error("Fail to generate caption:", error);
        } finally {
            setLoading(false); // Runs whether an error occurred or not
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // post() handles form submissions with Inertia.js including handling CSRF.
        post("/upload", { image, caption }); 
    }

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                {/*
                    fixed: The modal stays in one place even when scrolling.
                    inset-0: Stretches the modal container across the entire screen.
                    w-96: Sets the modal box width inside the container to 96 Tailwind units (384px).
                 */}
                <div className="bg-white p-6 rounded-lg w-96">
                    <h2 className="text-lg font-bold mb-4">Upload New Post</h2>

                    <input type="file" onChange={handleImageChange} accept="image/*" />

                    <button onClick={generateCaption} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                        {loading ? "Generating Caption..." : "AI Caption Generated"}
                    </button>

                    <textarea
                        className="w-full mt-2 p-2 border rounded-md"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        // (e) stands for event object.
                        // updates caption with the user's input.
                        // This makes sure React updates caption when the user types.
                        // onChange allows the user to edit the caption.
                        // Assigning alone would make the text unchangeable.
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                        Posting
                    </button>

                    <button onClick={onClose} className="mt-4 text-gray-500">
                        Close
                    </button>
                </div>
            </div>
        )
    );
}