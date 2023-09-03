import Konva from "konva";
import { Group } from "konva/lib/Group";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";
import { Line } from "konva/lib/shapes/Line";

const setImagePosition = (imageObj: HTMLImageElement) => {
  const imageWidth = imageObj.width;
  const imageHeight = imageObj.height;

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    x: imageWidth > width ? -(imageWidth - width) / 2 : 0,
    y: imageHeight > height ? -(imageHeight - height) / 2 : 0,
    ...(imageHeight > height && { width }),
    ...(imageWidth > width && { height })
  }
}

const width = window.innerWidth;
const height = window.innerHeight;

let stage: Stage;

const getStage = () => {
  if (!stage) {
    return new Konva.Stage({
      container: 'container',
      width: width,
      height: height,
    });
  }
  return stage;
}

export const addStoryImage = () => {

  Konva.hitOnDragEnabled = true;

  stage = getStage()

  let mainImageLayer = new Konva.Layer();
  stage.add(mainImageLayer);
  let imageObj = new Image();
  imageObj.src = "assets/images/longPic.png"
  let konvaImage = new Konva.Image({
    image: imageObj
  });
  konvaImage.setAttrs({
    ...setImagePosition(imageObj),
    name: 'storyImage',
  });
  mainImageLayer.add(konvaImage);

  // setTimeout(() => {
  //   stage.destroy()
  // }, 3000);

}

export const addGesturedEventNode = () => {
  Konva.capturePointerEventsEnabled = true;
  stage = getStage()

  let rotateLayer = new Konva.Layer();
  stage.add(rotateLayer);

  let originalAttrs = {
    x: stage.width() / 2,
    y: stage.height() / 2,
    scaleX: 1,
    scaleY: 1,
    draggable: true,
    rotation: 0,
  };

  let group = new Konva.Group(originalAttrs);
  rotateLayer.add(group);

  let size = 200;

  let rect = new Konva.Rect({
    width: size,
    height: size,
    fill: 'pink',
    offsetX: size / 2,
    offsetY: size / 2,
    cornerRadius: 5,
    shadowBlur: 10,
    shadowColor: 'grey',
  });
  group.add(rect);

  let defaultText = 'Try\ndrag, swipe, pinch zoom, rotate, press...';
  let text = new Konva.Text({
    text: defaultText,
    x: -size / 2,
    width: size,
    align: 'center',
  });
  group.add(text);

  // attach modified version of Hammer.js
  // "domEvents" property will allow triggering events on group
  // instead of "hammertime" instance
  let hammertime = new Hammer(group as any, { domEvents: true });

  // add rotate gesture
  hammertime.get('rotate').set({ enable: true });

  // now attach all possible events
  group.on('press', function (ev) {
    text.text('Under press');
    rect.to({
      fill: 'green',
    });
  });

  group.on('touchend', function (ev) {
    rect.to({
      fill: 'pink',
    });

    setTimeout(() => {
      text.text(defaultText);
    }, 300);
  });

  group.on('dragend', () => {
    // group.to(Object.assign({}, originalAttrs));
  });

  let oldRotation = 0;
  let startScale = 0;
  group.on('rotatestart', function (ev) {
    oldRotation = ev.evt.gesture.rotation;
    startScale = rect.scaleX();
    group.stopDrag();
    group.draggable(false);
    text.text('rotating...');
  });

  group.on('rotate', function (ev) {
    let delta = oldRotation - ev.evt.gesture.rotation;
    group.rotate(-delta);
    oldRotation = ev.evt.gesture.rotation;
    group.scaleX(startScale * ev.evt.gesture.scale);
    group.scaleY(startScale * ev.evt.gesture.scale);
  });

  group.on('rotateend rotatecancel', function (ev) {
    // group.to(Object.assign({}, originalAttrs));
    text.text(defaultText);
    group.draggable(true);
  });

  // setTimeout(() => {
  //   group.destroy()
  // }, 3000);

}

// const addText = () => {
//   stage = getStage()
//   const textLayer = new Konva.Layer();
//   stage.add(textLayer);

//   const shape = new Konva.Image({
//     x: 10,
//     y: 10,
//     draggable: true,
//     stroke: 'red',
//     scaleX: 1 / window.devicePixelRatio,
//     scaleY: 1 / window.devicePixelRatio,
//     image: new Image()
//   });
//   textLayer.add(shape);

//   function renderText() {
//     // convert DOM into image
//     html2canvas(document.querySelector('.ql-editor'), {
//       backgroundColor: 'rgba(0,0,0,0)',
//     }).then((canvas) => {
//       // show it inside Konva.Image
//       shape.image(canvas);
//     });
//   }

//   // batch updates, so we don't render text too frequently
//   let timeout = null;
//   function requestTextUpdate() {
//     if (timeout) {
//       return;
//     }
//     timeout = setTimeout(function () {
//       timeout = null;
//       renderText();
//     }, 500);
//   }

//   // render text on all changes
//   quill.on('text-change', requestTextUpdate);
//   // make initial rendering
//   renderText();
// }

export const draw = () => {

  stage = getStage()
  let drawLayer = new Konva.Layer();
  stage.add(drawLayer);

  let isPaint = false;
  let mode = 'brush';
  let lastLine: Line;

  stage.on('mousedown touchstart', function (e) {
    isPaint = true;
    let pos = stage.getPointerPosition();
    lastLine = new Konva.Line({
      stroke: '#df4b26',
      strokeWidth: 5,
      globalCompositeOperation:
        mode === 'brush' ? 'source-over' : 'destination-out',
      // round cap for smoother lines
      lineCap: 'round',
      lineJoin: 'round',
      // add point twice, so we have some drawings even on a simple click
      ...(pos && { points: [pos.x, pos.y, pos.x, pos.y] }),
    });
    drawLayer.add(lastLine);
  });

  stage.on('mouseup touchend', function () {
    isPaint = false;
  });

  // and core function - drawing
  stage.on('mousemove touchmove', function (e) {
    if (!isPaint) {
      return;
    }

    // prevent scrolling on touch devices
    e.evt.preventDefault();

    const pos = stage.getPointerPosition();
    let newPoints = pos && lastLine.points().concat([pos.x, pos.y]);
    newPoints && lastLine.points(newPoints);
  });

  let select: any = document.getElementById('tool');
  select?.addEventListener('change', function () {
    mode = select?.value;
  });
}