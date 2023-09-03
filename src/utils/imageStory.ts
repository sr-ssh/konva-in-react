import Konva from "konva";

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

export const addStoryImage = () => {

  Konva.hitOnDragEnabled = true;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
  });

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

  //===================================================================================
  
  Konva.capturePointerEventsEnabled = true;

  var rotateLayer = new Konva.Layer();
  stage.add(rotateLayer);

  var originalAttrs = {
    x: stage.width() / 2,
    y: stage.height() / 2,
    scaleX: 1,
    scaleY: 1,
    draggable: true,
    rotation: 0,
  };

  var group = new Konva.Group(originalAttrs);
  rotateLayer.add(group);

  var size = 200;

  var rect = new Konva.Rect({
    width: size,
    height: size,
    fill: 'black',
    offsetX: size / 2,
    offsetY: size / 2,
    cornerRadius: 5,
    shadowBlur: 10,
    shadowColor: 'grey',
  });
  group.add(rect);

  var defaultText = 'Try\ndrag, swipe, pinch zoom, rotate, press...';
  var text = new Konva.Text({
    text: defaultText,
    x: -size / 2,
    width: size,
    align: 'center',
  });
  group.add(text);

  // attach modified version of Hammer.js
  // "domEvents" property will allow triggering events on group
  // instead of "hammertime" instance
  var hammertime = new Hammer(group as any, { domEvents: true });

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

  var oldRotation = 0;
  var startScale = 0;
  group.on('rotatestart', function (ev) {
    oldRotation = ev.evt.gesture.rotation;
    startScale = rect.scaleX();
    group.stopDrag();
    group.draggable(false);
    text.text('rotating...');
  });

  group.on('rotate', function (ev) {
    var delta = oldRotation - ev.evt.gesture.rotation;
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

}