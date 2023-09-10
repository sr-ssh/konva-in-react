import { BrushColorEnum, BrushModesEnum } from "../@types/drawType";

export const getShadowColor = (stroke: BrushColorEnum) => {
  if (stroke === BrushColorEnum.Black) {
    return BrushColorEnum.Purple
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
  } else if (mode === BrushModesEnum.Pen || mode === BrushModesEnum.Highlighter) {
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