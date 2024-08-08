"use client";
import React, { useState, useContext, useRef, useEffect, CSSProperties } from "react";
import { CropSuggestion, EditorElement, Placement } from "@/types";
import { StoreContext } from "@/store";
import { isEditorImageElement, isEditorVideoElement } from "@/store/Store";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { fabric } from "fabric";
import { CoverImage, CoverVideo } from "@/utils/fabric-utils";


interface ReframeModalProps {
    onClose: () => void;
    element: EditorElement;
}

function calculatePixelCrop(cropValues: PixelCrop, imageWidth: number, imageHeight: number, sourceWidth: number, sourceHeight: number) {
    return {
        x: (cropValues.x ?? 0) * sourceWidth / imageWidth,
        y: (cropValues.y ?? 0) * sourceHeight / imageHeight,
        width: (cropValues.width ?? 0) * sourceWidth / imageWidth,
        height: (cropValues.height ?? 0) * sourceHeight / imageHeight,
    };
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

const ReframeModal: React.FC<ReframeModalProps> = ({ onClose, element }) => {
    const store = useContext(StoreContext);
    const [selectedFormat, setSelectedFormat] = useState("9:16"); // Default to 9:16

    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number>(9 / 16);

    const imageRef = useRef<HTMLImageElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [mediaDimensions, setMediaDimensions] = useState({ width: 0, height: 0 });
    const [cropClientDimensions, setCropClientDimensions] = useState({ width: 0, height: 0 });

    const [isLoading, setIsLoading] = useState(false); // Add loading state
    // const API_ENDPOINT = "http://localhost:8000/track_faces/"; // Your API URL
    const API_ENDPOINT = "http://3.74.216.181/track_faces/"; // Your API URL

    // Function to update aspect ratio based on selected format
    const updateAspectToFormat = (format: string) => {
        switch (format) {
            case "3:4":
                setAspect(3 / 4);
                break;
            case "16:9":
                setAspect(16 / 9);
                break;
            case "9:16":
                setAspect(9 / 16);
                break;
            case "1:1":
                setAspect(1);
                break;
            default:
                throw new Error("Invalid aspect ratio");
        }
    };

    useEffect(() => {
        updateAspectToFormat(selectedFormat);
    }, [selectedFormat]);

    const handleApplyReframe = () => {
        if ((isEditorVideoElement(element) || isEditorImageElement(element)) && completedCrop) {
            const canvasWidth = store.canvas?.getWidth() ?? 0;

            // Calculate scaling factor to fit cropped width to canvas width
            const scaleFactor = canvasWidth / completedCrop.width;
            const desiredHeight = completedCrop.height * scaleFactor;

            // Create temporary image element
            const tempImg = document.createElement('img');

            // Get crop data using getCrop()
            const cropData = (isEditorImageElement(element)
                ? new fabric.CoverImage(tempImg, {}).getCrop(mediaDimensions, { width: canvasWidth, height: desiredHeight })
                : new fabric.CoverVideo(document.createElement('video'), {}).getCrop(mediaDimensions, { width: canvasWidth, height: desiredHeight })
            );

            console.log("cropData: ", cropData);

            // Convert completedCrop to pixel values
            const pixelCrop = calculatePixelCrop(completedCrop, cropClientDimensions.width, cropClientDimensions.height, mediaDimensions.width, mediaDimensions.height);
            console.log("completedCrop: ", completedCrop);
            console.log("pixelCrop: ", pixelCrop);
            console.log("scaleFactor: ", scaleFactor);

            // Update the element's Placement with pixel crop information
            const newPlacement: Placement = {
                ...element.placement,
                width: canvasWidth,
                height: desiredHeight,
                x: 0,
                y: (store.canvas?.getHeight() ?? 0) / 2 - desiredHeight / 2,
                cropX: pixelCrop.x, // Use pixelCrop values
                cropY: pixelCrop.y,
                cropWidth: pixelCrop.width, // Use pixelCrop values
                cropHeight: pixelCrop.height, // Use pixelCrop values
            };

            store.updateEditorElement({
                ...element,
                placement: newPlacement,
            });
        }

        onClose();
    };


    const [cropSuggestions, setCropSuggestions] = useState<any[]>([]);
    const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
    const [cropStyle, setCropStyle] = useState<CSSProperties>({});

    // ... (keep other useEffect hooks as they are)

    useEffect(() => {
        var customCrop : CropSuggestion[] = [];
        if ('customCrop' in element.properties && element.properties.customCrop.length > 0) {
            customCrop = element.properties.customCrop;
        }
        if (customCrop.length > 0 && videoRef.current) {
            const updateCropStyle = () => {
                const currentTime = videoRef.current!.currentTime;
                const frameRate = customCrop.length / (videoRef.current!.duration ?? 1);
                const currentFrame = Math.round(currentTime * frameRate);
                const currentSuggestion = customCrop[currentFrame];
                console.log({
                    time: videoRef.current?.currentTime,
                    crop: customCrop[currentFrame],
                });
                if (currentSuggestion) {
                    const scaleFactor = videoRef.current!.clientWidth / currentSuggestion.originalWidth;
                    setCropStyle({
                        position: "absolute",
                        left: `${currentSuggestion.crop.x * scaleFactor}px`,
                        top: `${currentSuggestion.crop.y * scaleFactor}px`,
                        width: `${currentSuggestion.crop.width * scaleFactor}px`,
                        height: `${currentSuggestion.crop.height * scaleFactor}px`,
                        border: "2px solid blue",
                        pointerEvents: "none",
                    });
                }
            };

            videoRef.current.addEventListener('timeupdate', updateCropStyle);
            return () => videoRef.current?.removeEventListener('timeupdate', updateCropStyle);
        }
    }, [videoRef.current?.currentTime,cropSuggestions]);

    const CropSuggestions = () => (
        <div
            style={cropStyle}
        >
        </div>
    );

    // Set up crop area when media dimensions change
    useEffect(() => {
        if (mediaDimensions.width && mediaDimensions.height) {
            const newCrop = centerAspectCrop(mediaDimensions.width, mediaDimensions.height, aspect);
            setCrop(newCrop);
            setCompletedCrop(convertToPixelCrop(newCrop, mediaDimensions.width, mediaDimensions.height));
        }
    }, [mediaDimensions, aspect]);

    // Get media dimensions on load
    useEffect(() => {
        const updateDimensions = () => {
            if (isEditorImageElement(element) && imageRef.current) {
                console.log("imageRef.current: ", {
                    naturalWidth: imageRef.current.naturalWidth,
                    naturalHeight: imageRef.current.naturalHeight,
                    clientWidth: imageRef.current.clientWidth,
                    clientHeight: imageRef.current.clientHeight
                });
                setMediaDimensions({
                    width: imageRef.current.naturalWidth,
                    height: imageRef.current.naturalHeight,
                });
                setCropClientDimensions({
                    width: imageRef.current.clientWidth,
                    height: imageRef.current.clientHeight,
                });
            } else if (isEditorVideoElement(element) && videoRef.current) {
                console.log("videoRef.current: ", {
                    videoWidth: videoRef.current.videoWidth,
                    videoHeight: videoRef.current.videoHeight,
                    clientWidth: videoRef.current.clientWidth,
                    clientHeight: videoRef.current.clientHeight
                });
                setMediaDimensions({
                    width: videoRef.current.videoWidth,
                    height: videoRef.current.videoHeight,
                });
                setCropClientDimensions({
                    width: videoRef.current.clientWidth,
                    height: videoRef.current.clientHeight,
                });
            }
        };

        if (isEditorImageElement(element)) {
            // For images, listen for the 'load' event
            imageRef.current?.addEventListener('load', updateDimensions);
            return () => imageRef.current?.removeEventListener('load', updateDimensions);
        } else if (isEditorVideoElement(element)) {
            // For videos, listen for the 'loadedmetadata' event
            videoRef.current?.addEventListener('loadedmetadata', updateDimensions);
            return () => videoRef.current?.removeEventListener('loadedmetadata', updateDimensions);
        }
    }, [element]);

    // useEffect to set video currentTime if element is a video
    useEffect(() => {
        if (isEditorVideoElement(element) && videoRef.current) {
            videoRef.current.currentTime = (element.elementCurrentTime + element.timeFrame.relativeStart) / 1000;
        }
    }, [element]);

    async function autoCrop() {
        if (!isEditorVideoElement(element)) return;
        setIsLoading(true);
        console.log("Loading...");

        try {
            const videoFile = document.getElementById(element.properties.elementId) as HTMLVideoElement;
            if (videoFile && videoFile.src) {
                const timeStart = element.timeFrame.relativeStart;
                const timeEnd = element.timeFrame.relativeStart + (element.timeFrame.end-element.timeFrame.start);
                const response = await fetch(videoFile.src);
                const blob = await response.blob();
                const formData = new FormData();
                formData.append("file", blob, "video.mp4");

                const apiResponse = await fetch(API_ENDPOINT, {
                    method: "POST",
                    body: formData,
                });

                if (apiResponse.ok) {
                    const data = await apiResponse.json();
                    setCropSuggestions(data);
                    element.properties.customCrop = data;
                    console.log("API Response:", data);
                } else {
                    console.error("Error fetching crop suggestions:", await apiResponse.text());
                }
            }
        } catch (error) {
            console.error("API Request Error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    function manualCrop(): void {
        // Reset the crop value 
        if (!isEditorVideoElement(element)) return;
        element.properties.customCrop = [];
        setCropSuggestions([]);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-lg shadow-lg p-6 relative">
                <h2 className="text-xl font-semibold mb-4">Reframe</h2>

                <div id="2columns-container" className="grid grid-cols-2 gap-4 mb-4">
                    <div id="column-1">

                        <div className="mb-4">
                            <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                                Format
                            </label>
                            <select
                                id="format"
                                value={selectedFormat}
                                onChange={(e) => {
                                    setSelectedFormat(e.target.value);
                                    updateAspectToFormat(e.target.value); // Update crop when format changes
                                }}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="3:4">3:4</option>
                                <option value="16:9">16:9</option>
                                <option value="9:16">9:16</option>
                                <option value="1:1">1:1</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
                                Mode
                            </label>
                            <button className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-left rounded-md bg-gray-100" 
                                style={{ backgroundColor: '#dde4e9' }}
                                onClick={manualCrop}>
                                Recadrage manuel (par défaut)
                            </button>
                            <button className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-left rounded-md bg-gray-100"
                                style={{ backgroundColor: '#dde4e9' }}
                                onClick={autoCrop}>
                                Recadrage automatique
                            </button>

                        </div>
                    </div>

                    <div id="column-2">
                        <div className="relative border border-gray-300 rounded-lg overflow-hidden" style={{ width: '600px', height: '400px' }}>
                            {isEditorImageElement(element) && !isLoading && (
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    keepSelection
                                >
                                    <img
                                        ref={imageRef}
                                        alt={element.name}
                                        src={element.properties.src}
                                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                                    />
                                </ReactCrop>
                            )}
                            {isEditorVideoElement(element) && (
                                <div>
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={aspect}
                                        keepSelection
                                    >
                                        <video
                                            ref={videoRef}
                                            src={element.properties.src}
                                            style={{ width: "100%", height: "100%" }}
                                            controls
                                        />
                                    </ReactCrop>
                                    {/* Display crop suggestions as overlays */}
                                    {!isLoading && cropSuggestions.length > 0 && <CropSuggestions />}
                                    {isLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="spinner" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApplyReframe}
                        type="button"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReframeModal;
