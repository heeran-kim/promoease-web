import { useState } from "react";

const PLATFORMS = ["twitter", "instagram", "facebook"]; 

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
    const [loading, setLoading] = useState(false);
    
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const [captions, setCaptions] = useState(
        Object.fromEntries(PLATFORMS.map(platform => [platform, ""]))
    );
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    
    const [processing, setProcessing] = useState(false);
    // you can use only post or only processing if you want.
    // data, setData, processing, errors, reset

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file); // React automatically re-renders any UI that uses 'image'

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    }

    const handlePlatformSelection = (platform) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform)
                ? prev.filter((p) => p !== platform)
                : [...prev, platform]
        );
    };

    const handleCaptionChange = (platform, value) => {
        setCaptions((prev) => ({
            ...prev,
            [platform]: value,
        }));
    }

    // JavaScript is asynchronous and non-blocking all other UI actions
    // async () => {} runs the code inside it asynchronously, but the rest of the UI keeps working.
    // async: Marks a function as asynchronous.
    const generateCaption = async () => {
        if (!image) return alert("Upload an Image and Generate an AI-powered Caption.");
        if (selectedPlatforms.length === 0) return alert("Select at least one platform to generate a caption.");
        
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("selectedPlatforms", JSON.stringify(selectedPlatforms));

            // await: Waits for an asynchronous operation to finish before moving on.
            // waits within the function only
            // Without await, the code does not wait for fetch().
            
            // fetch() manually sends an HTTP request. (manual API request)
            const response = await fetch("/api/generate-caption", { 
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData) || "Failed to generate caption.");
            }

            const data = await response.json();
            const newCaptions = {};
            selectedPlatforms.forEach((platform) => {
                newCaptions[platform] = data.caption;
            });

            setCaptions(newCaptions);
        } catch (error) {
            console.error(error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false); // Runs whether an error occurred or not
        }
    };

    const handleSubmit = async() => {
        if (processing) return;
        if (!image) return alert("Upload an Image and Generate an AI-powered Caption.");
        if (selectedPlatforms.length === 0) return alert("Select at least one platform to upload.");
        
        const emptyCaptionPlatforms = selectedPlatforms.filter((platform) => !captions[platform]);
        if (emptyCaptionPlatforms.length > 0) {
            const confirmUpload = confirm(
                `⚠️ Are you sure you want to upload without a caption for ${emptyCaptionPlatforms.join(", ")}?`
            );
            if (!confirmUpload) return;
        }

        setProcessing(true);
        
        try {
            const formData = new FormData();
            formData.append("image", image);

            const uploadResponse = await fetch('/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: formData,
            });

            if (!uploadResponse.ok) {   
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData) || "Failed to upload image.");
            }
            
            const uploadData = await uploadResponse.json();

            const publishResponse = await fetch('/publish', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    upload_id: uploadData.upload_id,
                    captions,
                    platforms: selectedPlatforms,
                }),
            });

            if (!publishResponse.ok){
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData) || "Failed to publish social media.");
            }
    
            alert("✅ Upload successful!");
            handleClose();
        } catch (error) {
            console.error(error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    }

    const handleClose = () => {
        setImage(null);
        setImagePreview(null);
        setCaptions({});
        setSelectedPlatforms([]);
        setLoading(false);
        setProcessing(false);
        onClose();
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                {/*
                    fixed: The modal stays in one place even when scrolling.
                    inset-0: Stretches the modal container across the entire screen.
                    w-96: Sets the modal box width inside the container to 96 Tailwind units (384px).
                 */}
                <div className="bg-white p-6 rounded-lg w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                    <h2 className="text-lg font-bold mb-4">Upload New Post</h2>

                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-md mb-4" />
                    )}

                    <input type="file" onChange={handleImageChange} accept="image/*" />

                    <button onClick={generateCaption} className="mt-4 bg-blue-500 text-white px-4 py-2 block rounded-md">
                        {loading ? "Generating Caption..." : "Generate Caption"}
                    </button>

                    <div className="mt-4 space-y-2">
                        {PLATFORMS.map((platform) => (
                            <div key={platform} className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePlatformSelection(platform)}
                                    className={`px-4 py-2 rounded-md w-full max-w-[120px] h-10 text-white text-sm text-center flex items-center justify-center
                                        ${selectedPlatforms.includes(platform) ? "bg-blue-500" : "bg-gray-300"}
                                        `}
                                >
                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </button>

                                <textarea
                                    className={`w-full p-2 border rounded-md ${
                                        selectedPlatforms.includes(platform) ? "" : "opacity-50"
                                    }`}
                                    placeholder={`Enter ${platform} caption...`}
                                    value={captions[platform]}
                                    onChange={(e) => handleCaptionChange(platform, e.target.value)}
                                    disabled={!selectedPlatforms.includes(platform)}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className={`mt-4 text-white px-4 py-2 rounded-md 
                            ${processing ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                    >
                        {processing ? "Uploading..." : "Upload Post"}
                    </button>

                    <button onClick={handleClose} className="mt-4 text-gray-500">
                        Close
                    </button>
                </div>
            </div>
        )
    );
}