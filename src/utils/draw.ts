import { BrushColorEnum, BrushModesEnum } from "../@types/drawType";

export const getShadowColor = (stroke: BrushColorEnum) => {
  if (stroke === BrushColorEnum.Black) {
    return BrushColorEnum.Purple_700
  } else return stroke
}

export const getStrokeColor = (stroke?: BrushColorEnum, mode?: BrushModesEnum) => {
  if (mode === BrushModesEnum.Neon) {
    if (stroke === BrushColorEnum.Black) {
      return stroke
    } else return BrushColorEnum.White
  }
  return stroke
}

export const getGlobalCompositeOperation = (mode?: BrushModesEnum) => {
  if (mode === BrushModesEnum.Eraser) {
    return "destination-out"
  } else if (mode === BrushModesEnum.Pen) {
    return "source-over"
  }
  return "source-over"
}

export const setImagePosition = (imageObj: HTMLImageElement) => {
  const imageWidth = imageObj.width;
  const imageHeight = imageObj.height;

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    x: imageWidth > width ? -(imageWidth - width) / 2 : 0,
    y: imageHeight > height ? -(imageHeight - height) / 2 : 0,
    ...(imageHeight > height && { width }),
    ...(imageWidth > width && { height }),
  };
};

export const getColorBrightness = (color: string) => {
  // Remove any leading "#" from the color string
  color = color.replace(/^#/, '');

  // Convert the color to its RGB components
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  // Calculate the brightness using the relative luminance formula
  // (0.299 * R + 0.587 * G + 0.114 * B)
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Define a threshold to determine whether the color is closer to black or white
  const threshold = 0.5; // You can adjust this value as needed

  // Compare the brightness to the threshold and return a result

  if (brightness < threshold) {
    // black
    return true;
  } else {
    // white
    return false;
  }
}


