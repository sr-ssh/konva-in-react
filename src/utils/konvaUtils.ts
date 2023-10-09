import Konva from "konva";
import { BrushColorEnum, BrushModesEnum, OneToTwentyType } from "../@types/drawType";
import { Group } from "konva/lib/Group";
import { generateRandomNumber } from "./random";
import { Vector2d } from "konva/lib/types";
import { BrushConfigType } from "../contexts/StoryContextProvider";
import { EmojiSliderColorsType, optionLeftGradient, optionRightGradient } from "./widgetColors";
import { ClockEnum } from "../@types/widgetType";

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

  let tmp = new Konva.Text({ text: `#${defaultText}`, fontSize: 40, })

  const textWidth = tmp.width()
  const textHeight = tmp.height()

  let originalAttrs = {
    x: -textWidth / 2
  };

  let group = new Konva.Group(originalAttrs);

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
    offsetX: -10,
    offsetY: -5,
  });
  group.add(text);
  let rect = new Konva.Rect({
    width: textWidth,
    height: textHeight + 10,
    fill: background,
    // offsetX: textWidth / 2,
    // offsetY: textHeight / 2,
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

const drawPollOptions = (text: string, gradientColor: any, gradientPoints: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}, fontSize: number, pollWidth: number, optionsHeight: number, offsetX?: number) => {
  let optionNode = new Konva.Text({
    text,
    fillLinearGradientStartPoint: { x: gradientPoints.x1, y: gradientPoints.y1 },
    fillLinearGradientEndPoint: { x: gradientPoints.x2, y: gradientPoints.y2 },
    fillLinearGradientColorStops: gradientColor,
    align: "center",
    justify: "center",
    fontSize: fontSize,
    width: pollWidth / 2,
    textWrap: 'word', // Enable word wrapping
    textWrapWidth: pollWidth / 2,// Set the initial wrap width
    offsetX,
  });
  let tmp = new Konva.Text({ text, fontSize })
  while (tmp.width() > pollWidth) {
    fontSize--; // Decrease the font size
    optionNode.fontSize(fontSize);
    tmp.fontSize(fontSize)
  }
  // it needs the exact font family to be accurate
  optionNode.offsetY((-optionsHeight + optionNode.height()) / 2)
  return optionNode
}

export const drawPoll = (question: string, leftOption: string = "YES", rightOption: string = "NO") => {
  const pollWidth = width * 3 / 5
  const optionsHeight = 65;
  let fontSize = 35

  let originalAttrs = {
    x: -pollWidth / 2
  };

  let group = new Konva.Group(originalAttrs);

  let rect = new Konva.Rect({
    width: pollWidth,
    height: optionsHeight + 10,
    fill: "#fff",
    cornerRadius: 10,
  });
  group.add(rect);
  let line = new Konva.Line({
    stroke: "#e0e0e0",
    strokeWidth: 3,
    points: [pollWidth / 2, 0, pollWidth / 2, optionsHeight + 10]
  })
  group.add(line)

  const tmp = new Konva.Text({ text: question, fontSize: 20 })
  const questionTexWidth = tmp.width()
  let conditionalOffsetX = 0
  if (pollWidth - 36 >= questionTexWidth) {
    conditionalOffsetX = 135
  } else
    if (pollWidth - 36 < questionTexWidth && questionTexWidth < width - 50) {
      conditionalOffsetX = (width + 50 - questionTexWidth) / 2
    } else if (questionTexWidth >= width - 50) {
      conditionalOffsetX = 50
    }
  const questionNode = new Konva.Text({
    text: question,
    fontSize: 20,
    fill: "#fff",
    align: "right",
    width: width - 50,
    offsetX: conditionalOffsetX,
  })
  questionNode.offsetY(questionNode.height() + 20)
  group.add(questionNode)

  const gradientPoints = degreeToKonva(90, pollWidth / 2, optionsHeight)

  group.add(drawPollOptions(leftOption, optionLeftGradient, gradientPoints, fontSize, pollWidth, optionsHeight));
  group.add(drawPollOptions(rightOption, optionRightGradient, gradientPoints, fontSize, pollWidth, optionsHeight, -pollWidth / 2));

  return group
}

export const drawEmojiSlider = (colorProps: EmojiSliderColorsType, percent: number, emoji: any, text?: string) => {
  const emojiSliderWidth = width * 2 / 3
  const emojiSliderHeight = 64

  let originalAttrs = {
    x: -emojiSliderWidth / 2,
  };
  let group = new Konva.Group(originalAttrs);

  let textNode
  if (text) {
    textNode = new Konva.Text({
      text,
      fontSize: 20,
      fill: colorProps.textColor,
      width: emojiSliderWidth - 35,
      y: 20,
      align: "right",
      x: 17.5,
      lineHeight: 1.2
    })
  }

  const backgroundRect = new Konva.Rect({
    width: emojiSliderWidth,
    height: emojiSliderHeight + 25 + (textNode?.height() || 0),
    fill: colorProps.backgroundColor,
    cornerRadius: 17,
  })
  group.add(backgroundRect)
  textNode && group.add(textNode)

  const rangeWidth = emojiSliderWidth - 45
  const rangeTrackNode = new Konva.Rect({
    width: rangeWidth,
    height: 9,
    fill: colorProps.rangeTrackColor,
    cornerRadius: 20,
    y: (backgroundRect.height() - 45),
    x: 22.5
  })
  group.add(rangeTrackNode)

  const gradientPoints = degreeToKonva(180, emojiSliderWidth / 2, 10)
  const sliderWidth = percent * rangeWidth / 100
  const rangeSliderNode = new Konva.Rect({
    width: sliderWidth,
    height: 9,
    ...(colorProps.isGradient ? {
      fillLinearGradientStartPoint: { x: gradientPoints.x1, y: gradientPoints.y1 },
      fillLinearGradientEndPoint: { x: gradientPoints.x2, y: gradientPoints.y2 },
      fillLinearGradientColorStops: colorProps.rangeSliderColor as any,
    } : { fill: colorProps.rangeSliderColor as any }),
    cornerRadius: 20,
    y: rangeTrackNode.y(),
    x: 22.5
  })
  group.add(rangeSliderNode)

  const emojiNode = new Konva.Text({
    text: emoji,
    fontSize: 33,
    x: rangeSliderNode.x() + sliderWidth,
  })
  emojiNode.y(rangeSliderNode.y() + (rangeSliderNode.height() / 2) - (emojiNode.height() / 2))
  emojiNode.x(rangeSliderNode.x() + sliderWidth - (emojiNode.width() / 2))
  group.add(emojiNode)

  return group
}

const drawNormalClock = (hour: number, minute: number) => {

  const text = new Konva.Text({
    text: `${Math.floor(hour / 10)}${Math.floor(hour % 10)}:${Math.floor(minute / 10)}${Math.floor(minute % 10)}`,
    fontSize: 80,
    fill: "#ffffff",
    fontFamily: "AvenyTRegular"
  })
  const clockWidth = text.width()

  const group = new Konva.Group({ x: -clockWidth / 2 })
  group.add(text)

  return group
}

const drawOneCardClock = (time: number, cardWidth: number, x: number) => {
  const text = new Konva.Text({
    text: time.toString(),
    fontSize: 80,
    fill: "#ffffff",
    fontFamily: "AvenyTRegular",
    height: 76,
    width: cardWidth,
    align: "center",
    verticalAlign: "center"
  })

  const textBackground = new Konva.Rect({
    height: 76,
    width: cardWidth,
    fill: "rgba(143, 143, 143, 0.319)",
    cornerRadius: 10,
    offsetY: 5
  })

  const group = new Konva.Group({ x })
  group.add(textBackground)
  group.add(text)

  return group
}

const drawCardClock = (hour: number, minute: number) => {
  const cardWidth = 50
  const group = new Konva.Group({})
  group.add(drawOneCardClock(Math.floor(hour / 10), cardWidth, -cardWidth * 2 - 4))
  group.add(drawOneCardClock(Math.floor(hour % 10), cardWidth, -cardWidth - 3))
  group.add(drawOneCardClock(Math.floor(minute / 10), cardWidth, 3))
  group.add(drawOneCardClock(Math.floor(minute % 10), cardWidth, cardWidth + 4))

  let line = new Konva.Line({
    stroke: "#ffffff",
    strokeWidth: 2,
    globalCompositeOperation: "destination-out",
    points: [-(cardWidth * 2 + 4), 76 / 2 - 6, cardWidth * 2 + 4, 76 / 2 - 6]
  })
  group.add(line)

  return group
}
const degreesToRadians = (degrees: number) => {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

const drawRoundClock = (hour: number, minute: number) => {
  const group = new Konva.Group({})

  const circle = new Konva.Circle({
    radius: 90,
    fill: "rgba(143, 143, 143, 0.319)",
    x: 8,
    y: 8
  })
  group.add(circle)

  const startRadian = 1.0472
  const diffRad = 0.523599
  for (let i = 1; i <= 12; i++) {
    const clockNumber = new Konva.Text({
      text: i.toString(),
      fill: "#ffffff",
      x: Math.cos(startRadian - ((i - 1) * diffRad)) * 70,
      y: -Math.sin(startRadian - ((i - 1) * diffRad)) * 70,
      fontFamily: "AvenyTRegular",
      fontSize: 25
    })
    group.add(clockNumber)
  }

  const clockCenter = new Konva.Circle({
    radius: 4,
    fill: "#ffffff",
    x: 8,
    y: 8
  })
  group.add(clockCenter)

  const hourHandAngle = degreesToRadians((hour * -30) + 90 - (minute / 2))
  const hourHand = new Konva.Line({
    stroke: "#ffffff",
    strokeWidth: 3,
    lineCap: "round",
    points: [8, 8, Math.cos(hourHandAngle) * 15, -Math.sin(hourHandAngle) * 15]
  })
  group.add(hourHand)

  const minuteHandAngle = degreesToRadians((minute * -6) + 90)
  const minuteHand = new Konva.Line({
    stroke: "#ffffff",
    strokeWidth: 3,
    lineCap: "round",
    points: [8, 8, Math.cos(minuteHandAngle) * 50, -Math.sin(minuteHandAngle) * 50]
  })
  group.add(minuteHand)

  return group
}

export const drawClock = (timestamp: number, type: ClockEnum) => {

  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (type === ClockEnum.Normal) {
    return drawNormalClock(hours, minutes)
  } else if (type === ClockEnum.Card) {
    return drawCardClock(hours, minutes)
  } else if (type === ClockEnum.Clock) {
    return drawRoundClock(hours, minutes)
  }
}

export const drawEmoji = (emoji: string) => {
  const emojiNode = new Konva.Text({
    text: emoji,
    fontSize: 30,
  })
  const group = new Konva.Group({ x: -emojiNode.width() / 2 })
  group.add(emojiNode)
  return group
}