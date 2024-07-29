"use client";
import React from "react";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import { Placement, VideoEditorElement, ImageEditorElement } from "@/types";

type AspectRatioType = "16:9" | "4:3" | "3:4" | "1:1" | "9:16" | "original";

const ASPECT_RATIO_TYPE_TO_LABEL: Record<AspectRatioType, string> = {
    "16:9": "16:9",
    "9:16": "9:16",
    "1:1": "1:1",
    "3:4": "3:4",
    "4:3": "4:3",
    original: "Original",
};

export type AspectRatioResourceProps = {
    editorElement: VideoEditorElement | ImageEditorElement;
};
export const AspectRatioResource = observer(
    (props: AspectRatioResourceProps) => {
        const store = React.useContext(StoreContext);
        const handleAspectRatioChange = (
            editorElement: VideoEditorElement | ImageEditorElement,
            aspectRatio: AspectRatioType
        ) => {
            const canvasWidth = store.canvas?.getWidth() ?? 0;
            const canvasHeight = store.canvas?.getHeight() ?? 0;
            let newPlacement: Placement;
            switch (aspectRatio) {
                case "16:9": {
                    newPlacement = {
                        ...editorElement.placement,
                        width: canvasWidth,
                        height: (canvasWidth * 9) / 16,
                        y: canvasHeight / 2 - ((canvasWidth * 9) / 16) / 2, // Calculate vertical center
                    };
                    break;
                }
                case "9:16": {
                    newPlacement = {
                        ...editorElement.placement,
                        width: canvasWidth,
                        height: (canvasWidth * 16) / 9,
                        y: canvasHeight / 2 - ((canvasWidth * 16) / 9) / 2, // Calculate vertical center
                    };
                    break;
                }
                case "1:1": {
                    newPlacement = {
                        ...editorElement.placement,
                        width: canvasWidth,
                        height: (canvasWidth * 1) / 1,
                        y: canvasHeight / 2 - ((canvasWidth * 1) / 1) / 2, // Calculate vertical center
                    };
                    break;
                }
                case "3:4": {
                    newPlacement = {
                        ...editorElement.placement,
                        width: canvasWidth,
                        height: (canvasWidth * 4) / 3,
                        y: canvasHeight / 2 - ((canvasWidth * 4) / 3) / 2, // Calculate vertical center
                    };
                    break;
                }
                case "4:3": {
                    newPlacement = {
                        ...editorElement.placement,
                        width: canvasWidth,
                        height: (canvasWidth * 3) / 4,
                        y: canvasHeight / 2 - ((canvasWidth * 3) / 4) / 2, // Calculate vertical centerr
                    };
                    break;
                }
                case "original": {
                    const mediaElement = document.getElementById(
                        editorElement.properties.elementId
                    ) as HTMLVideoElement | HTMLImageElement;
                    let aspectRatio: number;
                    if (mediaElement instanceof HTMLVideoElement) {
                        aspectRatio = mediaElement.videoWidth / mediaElement.videoHeight;
                    } else {
                        aspectRatio = mediaElement.naturalWidth / mediaElement.naturalHeight;
                    }
                    newPlacement = {
                        ...editorElement.placement,
                        width: canvasWidth,
                        height: canvasWidth / aspectRatio,
                    };
                    break;
                }
                default:
                    throw new Error("Invalid aspect ratio");
            }
            store.updateEditorElement({
                ...editorElement,
                placement: newPlacement,
            });
        };
        return (
            <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative min-h-[100px] p-2">
                <div className="flex flex-row justify-between w-full">
                    <div className="text-white py-1 text-base text-left w-full">
                        {
                            ASPECT_RATIO_TYPE_TO_LABEL[
                            (props.editorElement.properties as { aspectRatio?: AspectRatioType }).aspectRatio ||
                            "original"
                            ]
                        }
                    </div>
                </div>
                {/* Select aspect ratio from drop down */}
                <select
                    className="bg-slate-100 text-black rounded-lg px-2 py-1 ml-2 w-24 text-xs"
                    // @ts-ignore
                    value={
                        (props.editorElement.properties as any).aspectRatio || "original"
                    }
                    onChange={(e) => {
                        const aspectRatio = e.target.value;
                        handleAspectRatioChange(
                            props.editorElement,
                            aspectRatio as AspectRatioType
                        );
                    }}
                >
                    {Object.keys(ASPECT_RATIO_TYPE_TO_LABEL).map((aspectRatio) => {
                        return (
                            <option key={aspectRatio} value={aspectRatio}>
                                {ASPECT_RATIO_TYPE_TO_LABEL[aspectRatio as AspectRatioType]}
                            </option>
                        );
                    })}
                </select>
            </div>
        );
    }
);