import { EditorElement, EffecType } from "@/types";
import { fabric } from "fabric";
// https://jsfiddle.net/i_prikot/pw7yhaLf/

export const CoverImage = fabric.util.createClass(fabric.Image, {
  type: "coverImage",

  customFilter: "none",
  disableCrop: false,
  cropWidth: 0,
  cropHeight: 0,

  initialize(element: HTMLImageElement | HTMLVideoElement, options: any) {
    options = options || {};

    this.customCrop = {
      cropX: options.cropX || 0,
      cropY: options.cropY || 0,
      cropWidth: options.cropWidth || 0,
      cropHeight: options.cropHeight || 0,
    };
    options = Object.assign(
      {
        cropHeight: this.height,
        cropWidth: this.width,
      },
      options
    );
    this.callSuper("initialize", element, options);
  },

  getCrop(
    image: { width: number; height: number },
    size: { width: number; height: number }
  ) {
    const width = size.width;
    const height = size.height;
    const aspectRatio = width / height;

    let newWidth;
    let newHeight;

    const imageRatio = image.width / image.height;

    if (aspectRatio >= imageRatio) {
      newWidth = image.width;
      newHeight = image.width / aspectRatio;
    } else {
      newWidth = image.height * aspectRatio;
      newHeight = image.height;
    }
    const x = (image.width - newWidth) / 2;
    const y = (image.height - newHeight) / 2;
    return {
      cropX: x,
      cropY: y,
      cropWidth: newWidth,
      cropHeight: newHeight,
    };
  },

  setCustomCrop(
    cropX: number,
    cropY: number,
    cropWidth: number,
    cropHeight: number
  ) {
    this.customCrop = { cropX, cropY, cropWidth, cropHeight };
    this.dirty = true;
    this.canvas?.requestRenderAll();
  },

  _render(ctx: CanvasRenderingContext2D) {
    if (this.disableCrop) {
      this.callSuper("_render", ctx);
      return;
    }
    const width = this.width;
    const height = this.height;
    let crop;
    if (this.customCrop.cropWidth && this.customCrop.cropHeight) {
      crop = this.customCrop;
    } else {
      crop = this.getCrop(this.getOriginalSize(), {
        width: this.getScaledWidth(),
        height: this.getScaledHeight(),
      });
    }

    const image = this._element as HTMLImageElement;
    if (!image) return;
    const imageScaledX = image.width / image.naturalWidth;
    const imageScaledY = image.height / image.naturalHeight;

    const { cropX, cropY, cropWidth, cropHeight } =
      crop.cropX !== undefined &&
      crop.cropY !== undefined &&
      crop.cropWidth !== undefined &&
      crop.cropHeight !== undefined
        ? crop
        : {
            cropX: crop.cropX * imageScaledX,
            cropY: crop.cropY * imageScaledY,
            cropWidth: crop.cropWidth * imageScaledX,
            cropHeight: crop.cropHeight * imageScaledY,
          };

    
    ctx.save();
    const customFilter: EffecType = this.customFilter;
    ctx.filter = getFilterFromEffectType(customFilter);
    ctx.drawImage(
      this._element,
      Math.max(cropX, 0),
      Math.max(cropY, 0),
      Math.max(1, cropWidth),
      Math.max(1, cropHeight),
      -width / 2,
      -height / 2,
      Math.max(0, width),
      Math.max(0, height)
    );
    ctx.filter = "none";
    ctx.restore();
  },
});

export const CoverVideo = fabric.util.createClass(fabric.Image, {
  type: "coverVideo",
  customFilter: "none",
  disableCrop: false,
  cropWidth: 0,
  cropHeight: 0,

  initialize(element: HTMLVideoElement, options: any) {
    options = options || {};

    this.customCrop = {
      cropX: options.cropX || 0,
      cropY: options.cropY || 0,
      cropWidth: options.cropWidth || element.videoWidth,
      cropHeight: options.cropHeight || element.videoHeight,
    };
    options = Object.assign(
      {
        cropHeight: this.height,
        cropWidth: this.width,
      },
      options
    );
    this.callSuper("initialize", element, options);
  },

  getCrop(
    image: { width: number; height: number },
    size: { width: number; height: number }
  ) {
    const width = size.width;
    const height = size.height;
    const aspectRatio = width / height;
    let newWidth;
    let newHeight;

    const imageRatio = image.width / image.height;

    if (aspectRatio >= imageRatio) {
      newWidth = image.width;
      newHeight = image.width / aspectRatio;
    } else {
      newWidth = image.height * aspectRatio;
      newHeight = image.height;
    }
    const x = (image.width - newWidth) / 2;
    const y = (image.height - newHeight) / 2;
    return {
      cropX: x,
      cropY: y,
      cropWidth: newWidth,
      cropHeight: newHeight,
    };
  },

  setCustomCrop(
    cropX: number,
    cropY: number,
    cropWidth: number,
    cropHeight: number
  ) {
    this.customCrop = { cropX, cropY, cropWidth, cropHeight };
    this.dirty = true;
    this.canvas?.requestRenderAll();
  },

  _render(ctx: CanvasRenderingContext2D) {
    if (this.disableCrop) {
      this.callSuper("_render", ctx);
      return;
    }
    const width = this.width;
    const height = this.height;
    let crop;
    if (this.customCrop.cropWidth && this.customCrop.cropHeight) {
      crop = this.customCrop;
    } else {
      crop = this.getCrop(this.getOriginalSize(), {
        width: this.getScaledWidth(),
        height: this.getScaledHeight(),
      });
    }

    const video = this._element as HTMLVideoElement;
    const videoScaledX = video.width / video.videoWidth;
    const videoScaledY = video.height / video.videoHeight;

    //console.log("crop", crop)
    const { cropX, cropY, cropWidth, cropHeight } =
      crop.cropX !== undefined &&
      crop.cropY !== undefined &&
      crop.cropWidth !== undefined &&
      crop.cropHeight !== undefined
        ? crop
        : {
            cropX: crop.cropX * videoScaledX,
            cropY: crop.cropY * videoScaledY,
            cropWidth: crop.cropWidth * videoScaledX,
            cropHeight: crop.cropHeight * videoScaledY,
          };

    ctx.save();
    const customFilter: EffecType = this.customFilter;
    ctx.filter = getFilterFromEffectType(customFilter);
    ctx.drawImage(
      this._element,
      Math.max(cropX, 0),
      Math.max(cropY, 0),
      Math.max(1, cropWidth),
      Math.max(1, cropHeight),
      -width / 2,
      -height / 2,
      Math.max(0, width),
      Math.max(0, height)
    );
    ctx.filter = "none";
    ctx.restore();
  },
});

function getFilterFromEffectType(effectType: EffecType) {
  switch (effectType) {
    case "blackAndWhite":
      return "grayscale(100%)";
    case "sepia":
      return "sepia(100%)";
    case "invert":
      return "invert(100%)";
    case "saturate":
      return "saturate(100%)";
    default:
      return "none";
  }
}

declare module "fabric" {
  namespace fabric {
    class CoverVideo extends Image {
      type: "coverVideo";
      disableCrop: boolean;
      cropWidth: number;
      cropHeight: number;

      // Add getCrop method to the CoverVideo typings
      getCrop(
        image: { width: number; height: number },
        size: { width: number; height: number }
      ): {
        cropX: number;
        cropY: number;
        cropWidth: number;
        cropHeight: number;
      };

      setCustomCrop(
        cropX: number,
        cropY: number,
        cropWidth: number,
        cropHeight: number
      ): {
        cropX: number;
        cropY: number;
        cropWidth: number;
        cropHeight: number;
      };
    }
    class CoverImage extends Image {
      type: "coverImage";
      disableCrop: boolean;
      cropWidth: number;
      cropHeight: number;

      // Add getCrop method to the CoverImage typings
      getCrop(
        image: { width: number; height: number },
        size: { width: number; height: number }
      ): {
        cropX: number;
        cropY: number;
        cropWidth: number;
        cropHeight: number;
      };

      setCustomCrop(
        cropX: number,
        cropY: number,
        cropWidth: number,
        cropHeight: number
      ): {
        cropX: number;
        cropY: number;
        cropWidth: number;
        cropHeight: number;
      };
    }
  }
}

fabric.CoverImage = CoverImage;
fabric.CoverVideo = CoverVideo;

export class FabricUitls {
  static getClipMaskRect(editorElement: EditorElement, extraOffset: number) {
    const extraOffsetX = extraOffset / editorElement.placement.scaleX;
    const extraOffsetY = extraOffsetX / editorElement.placement.scaleY;
    const clipRectangle = new fabric.Rect({
      left: editorElement.placement.x - extraOffsetX,
      top: editorElement.placement.y - extraOffsetY,
      width: editorElement.placement.width + extraOffsetX * 2,
      height: editorElement.placement.height + extraOffsetY * 2,
      scaleX: editorElement.placement.scaleX,
      scaleY: editorElement.placement.scaleY,
      absolutePositioned: true,
      fill: "transparent",
      stroke: "transparent",
      opacity: 0.5,
      strokeWidth: 0,
    });
    return clipRectangle;
  }
}
