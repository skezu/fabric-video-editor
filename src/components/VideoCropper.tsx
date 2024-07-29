import React, { useRef, useEffect, useState } from "react";
import { Rnd } from "react-rnd";



interface VideoCropperProps {
    videoUrl: string;
    onCrop: (crop: { x: number; y: number; width: number; height: number }) => void;
    aspectRatio: string; // Add aspectRatio prop
}

const VideoCropper: React.FC<VideoCropperProps> = ({ videoUrl, onCrop, aspectRatio }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const rndRef = useRef<any>(null); // Add ref for RND component

    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });

    // Calculate aspect ratio based on prop
    // const aspectRatioArray = aspectRatio === "original" ? [9, 16] : Number(aspectRatio.split(":"));
    const aspectRatioArray = aspectRatio === "original" ? [9, 16] : Array.from(aspectRatio.split(":").map(Number));
    const calculatedAspectRatio = aspectRatioArray[0] / aspectRatioArray[1];

    useEffect(() => {
        if (videoRef.current) {
            setVideoWidth(videoRef.current.videoWidth);
            setVideoHeight(videoRef.current.videoHeight);
            videoRef.current.currentTime = 0;

            // Set initial crop based on video dimensions and aspect ratio
            const initialWidth = videoWidth;
            const initialHeight = initialWidth / calculatedAspectRatio;
            setCrop({
                x: (videoWidth - initialWidth) / 2,
                y: (videoHeight - initialHeight) / 2,
                width: initialWidth,
                height: initialHeight,
            });
        }
    }, [videoUrl, videoWidth, videoHeight]);

    // Update RND component when aspect ratio changes
    useEffect(() => {
        if (rndRef.current) {
            rndRef.current.updateSize({ width: crop.width, height: crop.height });
        }
    }, [aspectRatio, crop.width, crop.height]);

    useEffect(() => {
        onCrop(crop);
    }, [crop]);

    const handleDragStop = (x: number, y: number) => {
        setCrop({ ...crop, x, y });
    }

    const handleResizeStop = (width: number, height: number) => {
        setCrop({ ...crop, width, height });
    };

    return (
        <div>
            <video
                ref={videoRef}
                src={videoUrl}
                width="100%"
                height="100%"
                controls
                onLoadedMetadata={() => {
                    if (videoRef.current) {
                        setVideoWidth(videoRef.current.videoWidth);
                        setVideoHeight(videoRef.current.videoHeight);
                        videoRef.current.currentTime = 0;
                    }
                }}
            />
            <Rnd
                ref={rndRef} // Add ref to RND component
                bounds={"parent"}
                size={{ width: crop.width, height: crop.height }}
                position={{ x: crop.x, y: crop.y }}
                onDragStop={(e, d) => {
                    handleDragStop(d.x, d.y);
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    handleResizeStop(Number(ref.style.width), Number(ref.style.height));
                }}
                lockAspectRatio={true} // Lock aspect ratio for resizing
                enableResizing={{ top: false, bottom: false, left: true, right: true }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: '100%', // Take full width of parent RND component
                        height: '100%', // Take full height of parent RND component
                        border: "2px dashed #00bcd4",
                        cursor: "move",
                    }}
                ></div>
            </Rnd>
        </div>
    );
};

export default VideoCropper;