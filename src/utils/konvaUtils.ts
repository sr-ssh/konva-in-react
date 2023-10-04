import Konva from "konva";
import { BrushColorEnum, BrushModesEnum, OneToTwentyType } from "../@types/drawType";
import { Group } from "konva/lib/Group";
import { generateRandomNumber } from "./random";
import { Vector2d } from "konva/lib/types";
import { BrushConfigType } from "../contexts/StoryContextProvider";

const width = window.innerWidth;
const height = window.innerHeight;

const hashtagTextName = "hashtag-text"
const hashtagBackgroundName = "hashtag-background"

const mentionTextName = "mention-text"
const mentionBackgroundName = "mention-background"

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export const getShadowColor = (stroke: BrushColorEnum | string) => {
  if (stroke === BrushColorEnum.Black || stroke === "rgba(0,0,0,1)") {
    return BrushColorEnum.Purple_700
  } else return stroke
}

export const getStrokeColor = (stroke?: BrushColorEnum | string, mode?: BrushModesEnum) => {
  if (mode === BrushModesEnum.Neon) {
    if (stroke === BrushColorEnum.Black || stroke === "rgba(0,0,0,1)") {
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

export const addBackgroundImage = () => {
  Konva.hitOnDragEnabled = true;

  let imageObj = new Image();
  imageObj.src = "assets/images/longPic.png";
  let konvaImage = new Konva.Image({
    image: imageObj,
  });
  konvaImage.setAttrs({
    ...setImagePosition(imageObj),
    name: "storyImage",
  });

  return konvaImage;
};


export const drawRect = (x: number, y: number, brushConfig: { stroke: BrushColorEnum | string, strokeWidth: OneToTwentyType }) => {
  return new Konva.Rect({
    width: 8,
    height: brushConfig.strokeWidth + 15,
    fill: brushConfig.stroke,
    cornerRadius: 5,
    rotation: 5 * 45,
    x,
    y,
  });
};

const randomWidth = (strokeWidth: OneToTwentyType) => {
  return generateRandomNumber(
    (strokeWidth || 0) + 15,
    (strokeWidth || 0) + 8
  );
};

export const drawSVG = (
  x: number,
  y: number,
  group: Group,
  strokeWidth: OneToTwentyType,
  getSVG: () => string
) => {
  let width = randomWidth(strokeWidth);

  const SVG = getSVG();
  const url = "data:image/svg+xml;base64," + window.btoa(SVG);

  return new Promise((resolve, reject) => {
    Konva.Image.fromURL(url, (image) => {
      image.setAttrs({
        width: width,
        height: width,
        x: x - width / 2,
        y: y - width / 2,
      });
      resolve(image);
    });
  });
};

export const drawLine = (brushConfig: BrushConfigType, pos?: Vector2d | null) => {
  const line = new Konva.Line({
    stroke: getStrokeColor(
      brushConfig?.stroke,
      brushConfig?.mode
    ),
    strokeWidth: brushConfig?.strokeWidth,
    globalCompositeOperation: getGlobalCompositeOperation(
      brushConfig.mode
    ),
    lineCap: "round",
    lineJoin: "round",
    ...(brushConfig.mode === BrushModesEnum.Neon && {
      shadowColor: getShadowColor(brushConfig.stroke),
      hasShadow: true,
      shadowBlur: 10,
      fillAfterStrokeEnabled: true,
      shadowForStrokeEnabled: true,
      shadowOffset: { x: 0, y: 0 },
    }),
    ...(pos && { points: [pos.x, pos.y, pos.x, pos.y] }),
  });
  return line;
};

export const drawColorPickerShape = () => {

  const group = new Konva.Group({
    scaleX: 0.25,
    scaleY: 0.25,
    zIndex: 4,
  });

  const path1 = new Konva.Path({
    data: "M99.5001 253.812L23.7144 164.553C8.48697 146.605 0.0991211 123.791 0.0991211 100.313C0.0991211 45.5015 44.691 0.912392 99.5001 0.912392C154.309 0.912392 198.904 45.5043 198.904 100.313C198.904 123.791 190.516 146.605 175.286 164.553L99.5001 253.812Z",
    shadowColor: "black",
    hasShadow: true,
    shadowBlur: 10,
    zIndex: 4,
    shadowOffset: { x: 0, y: 0 },
  });
  group.add(path1);

  const path2 = new Konva.Path({
    data: "M99.5001 253.812L23.7144 164.553C8.48697 146.605 0.0991211 123.791 0.0991211 100.313C0.0991211 45.5015 44.691 0.912392 99.5001 0.912392C154.309 0.912392 198.904 45.5043 198.904 100.313C198.904 123.791 190.516 146.605 175.286 164.553L99.5001 253.812ZM99.5001 9.1766C49.246 9.1766 8.36333 50.0593 8.36333 100.313C8.36333 121.835 16.0543 142.75 30.0144 159.205L99.5001 241.047L168.986 159.205C182.949 142.753 190.64 121.835 190.64 100.313C190.637 50.0593 149.754 9.1766 99.5001 9.1766Z",
    zIndex: 4,
    fill: "#fff",
  });
  group.add(path2);

  const circle1 = new Konva.Circle({
    x: 100,
    y: 341,
    radius: 25,
    zIndex: 4,
    fill: "#D9D9D9",
  });
  group.add(circle1);

  const circle2 = new Konva.Circle({
    x: 100,
    y: 341,
    radius: 25,
    shadowColor: "black",
    hasShadow: true,
    shadowBlur: 10,
    zIndex: 4,
    shadowOffset: { x: 0, y: 0 },
  });
  group.add(circle2);

  const circle3 = new Konva.Circle({
    x: 100,
    y: 341,
    radius: 21.5,
    stroke: "#fff",
    zIndex: 4,
    strokeWidth: 7,
  });
  group.add(circle3);

  return { group, path: path1, circle: circle2 }
};

const degreeToKonva = (degree: number, width: number, height: number) => {
  // Compute angle in radians - CSS starts from 180 degrees and goes clockwise
  // Math functions start from 0 and go anti-clockwise so we use 180 - angleInDeg to convert between the two
  const angle = ((180 - degree) / 180) * Math.PI

  // This computes the length such that the start/stop points will be at the corners
  const length =
    Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle))

  // Compute the actual x,y points based on the angle, length of the gradient line and the center of the div
  const halfX = (Math.sin(angle) * length) / 2.0
  const halfY = (Math.cos(angle) * length) / 2.0
  const cx = width / 2.0
  const cy = height / 2.0
  return {
    x1: cx - halfX,
    y1: cy - halfY,
    x2: cx + halfX,
    y2: cy + halfY,
  }
}

const drawTextWithBackground = (gradient: any, defaultText: string, background: string) => {
  let originalAttrs = {
    scaleX: 1,
    scaleY: 1,
    draggable: true,
    rotation: 0,
  };

  let group = new Konva.Group(originalAttrs);

  let tmp = new Konva.Text({ text: `#${defaultText}`, fontSize: 40, })

  const textWidth = tmp.width()
  const textHeight = tmp.height()
  const gradientPoints = degreeToKonva(90, textWidth, textHeight)

  let text = new Konva.Text({
    text: defaultText,
    fillLinearGradientStartPoint: { x: gradientPoints.x1, y: gradientPoints.y1 },
    fillLinearGradientEndPoint: { x: gradientPoints.x2, y: gradientPoints.y2 },
    fillLinearGradientColorStops: gradient,
    align: "center",
    justify: "center",
    fontSize: 40,
    name: hashtagTextName,
    offsetX: textWidth / 2 - 10,
    offsetY: textHeight / 2 - 5,
  });
  group.add(text);
  let rect = new Konva.Rect({
    width: textWidth,
    height: textHeight + 10,
    fill: background,
    offsetX: textWidth / 2,
    offsetY: textHeight / 2,
    cornerRadius: 5,
    name: hashtagBackgroundName
  });
  group.add(rect);

  tmp.destroy()

  text.zIndex(2)

  return group
}

export const drawHashtag = (gradient: any, background: string) => {
  let defaultText = "هشتگ سمپل"
  return drawTextWithBackground(gradient, '#' + defaultText, background)
}

export const drawMention = (gradient: any, background: string) => {
  let defaultText = "sdfesftewfe"
  return drawTextWithBackground(gradient, '@' + defaultText, background)
}

export const drawLink = (gradient: any, background: string) => {
  let defaultText = "mylink"
  return drawTextWithBackground(gradient, '🔗' + defaultText, background)
}

export const changeTextColorByName = (textName: string, backgroundName: string, group: Group, gradient: any, background: string) => {
  group.children?.forEach(item => {
    if (item.name() === textName) {
      item.setAttrs({ fillLinearGradientColorStops: gradient })
    }
    if (item.name() === backgroundName) {
      item.setAttrs({ fill: background })
    }
  })
}

export const setHashtagColor = (hashtag: Group, gradient: any, background: string) => {
  changeTextColorByName(hashtagTextName, hashtagBackgroundName, hashtag, gradient, background)
}

export const setMentionColor = (mention: Group, gradient: any, background: string) => {
  changeTextColorByName(mentionTextName, mentionBackgroundName, mention, gradient, background)
}