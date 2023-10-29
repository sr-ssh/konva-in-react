import { ReactNode, createContext, memo, useEffect, useRef } from "react";
import Konva from "konva";
import { Line } from "konva/lib/shapes/Line";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import {
	BrushColorEnum,
	BrushModesEnum,
	OneToTwentyType,
} from "../@types/drawType";
import {
	addBackgroundImage,
	drawClock,
	drawColorPickerShape,
	drawEmoji,
	drawEmojiSlider,
	drawHashtag,
	drawLine,
	drawLink,
	drawMention,
	drawPoll,
	drawRect,
	drawSVG,
	rgbToHex,
	setHashtagColor,
} from "../utils/konvaUtils";
import { Vector2d } from "konva/lib/types";
import { Group } from "konva/lib/Group";
import { Rect } from "konva/lib/shapes/Rect";
import { Path } from "konva/lib/shapes/Path";
import { Circle } from "konva/lib/shapes/Circle";
import { smokeSVG } from "../assets/svg/smokeSVG";
import { Shape } from "konva/lib/Shape";
import { EventType, useEvent } from "../hooks/useEvent";
import { usePageMangerContext } from "../hooks/usePageMangerContext";
import {
	emojiSliderColors,
	hashtagColors,
	linkColors,
	mentionColors,
} from "../utils/widgetColors";
import { ClockEnum } from "../@types/widgetType";
import { trashBottom, trashHeight, trashWidth } from "../pages/TrashPage";
import { useAnimate } from "../hooks/useAnimate";

const width = window.innerWidth;
const height = window.innerHeight;

export interface BrushConfigType {
	stroke: BrushColorEnum | string;
	mode: BrushModesEnum;
	strokeWidth: OneToTwentyType;
}

export enum StoryContextModes {
	IsColorPicking = "isColorPicking",
	IsAddingText = "isAddingText",
	IsDefault = "isDefault",
	IsDragging = "isDragging",
	IsEditingText = "isEditingText",
	IsDrawing = "isDrawing",
	IsPainting = "isPainting",
	IsHashtagEditing = "isHashtagEditing",
	IsMentionEditing = "isMentionEditing",
	IsEmojiSliderEditing = "isEmojiSliderEditing",
	IsPollEditing = "isPollEditing",
	IsInTrash = "isInTrash",
}
interface StoryContextType {
	startDrawMode: () => void;
	stopDrawMode: () => void;
	setBrushColor: (color: BrushColorEnum | string) => void;
	setBrushMode: (mode: BrushModesEnum) => void;
	undoDraw: () => void;
	setBrushStrokeWidth: (strokeWidth: OneToTwentyType) => void;
	isDrawing: boolean;
	registerDrawContainerSetColor: (setColor: (color: string) => void) => void;
	toggleEyeDropper: () => void;
	downloadStage: () => void;
	addText: (defaultText?: string, color?: string) => void;
	getBrushColor: string;
	addHashtag: (text?: string) => void;
	addMention: (text?: string) => void;
	addEmojiSlider: (
		text?: string,
		emoji?: string,
		defaultValue?: number,
		colorsIndex?: number
	) => void;
	addPoll: (
		question?: string,
		leftOption?: string,
		rightOption?: string
	) => void;
	addClock: () => void;
	addEmoji: (emoji: string) => void;
	popAndSaveShape: (name: string) => any;
	addLink: (text: string) => void;
	getStrokeWidth: () => OneToTwentyType;
	addStoryImage: (src: string) => void;
}

export const StoryContext = createContext<StoryContextType>({
	startDrawMode: () => {},
	stopDrawMode: () => {},
	setBrushColor: (color: BrushColorEnum | string) => {},
	setBrushMode: (mode: BrushModesEnum) => {},
	undoDraw: () => {},
	setBrushStrokeWidth: (strokeWidth: OneToTwentyType) => {},
	isDrawing: false,
	registerDrawContainerSetColor: (setColor: (color: string) => void) => {},
	toggleEyeDropper: () => {},
	downloadStage: () => {},
	addText: (defaultText?: string, color?: string) => {},
	getBrushColor: "",
	addHashtag: (text?: string) => {},
	addMention: (text?: string) => {},
	addEmojiSlider: (
		text?: string,
		emoji?: string,
		defaultValue?: number,
		colorsIndex?: number
	) => {},
	addPoll: (
		question?: string,
		leftOption?: string,
		rightOption?: string
	) => {},
	addClock: () => {},
	addEmoji: (emoji: string) => {},
	addLink: (text: string) => {},
	popAndSaveShape: (name: string) => {},
	getStrokeWidth: () => 1,
	addStoryImage: (src: string) => {},
});

export const StoryContextProvider = memo(
	({ children }: { children: ReactNode }) => {
		const drawShapeRef = useRef<(Group | Line)[]>([]);
		let stageRef = useRef<Stage>();
		let layerRef = useRef<Layer>();
		let drawLayerRef = useRef<Layer>();
		let backgroundLayerRef = useRef<Layer>();
		let clockLayerRef = useRef<Layer>();
		let isDrawModeOn = useRef<boolean>(false);
		let isDrawing = useRef<boolean>(false);
		let isEyeDropping = useRef<boolean>(false);
		const colorPickerSVG = useRef<{
			group: Group;
			path: Path;
			circle: Circle;
			color?: string;
		}>();
		let brushConfig = useRef<BrushConfigType>({
			mode: BrushModesEnum.Pen,
			strokeWidth: 10,
			stroke: BrushColorEnum.White,
		});
		let drawContainerSetColor = useRef<(newColor: string) => void>();
		let currentEditingShapeRef = useRef<any>();
		let clockAttrsRef = useRef<any>();
		let draggingNode = useRef<any>();
		let tweenRef = useRef<string>("");
		let isInTrashRef = useRef<boolean>(false);
		let diffRef = useRef<{ x: number; y: number }>();
		let cancelAnimation = useRef<() => void>();
		let lastScaleRef = useRef<number>(1);
		let maxScaleRef = useRef<number>(1);
		let lastPoppedShape = useRef<any>();
		let lastHashtagColorIndexRef = useRef<number>(0);
		let lastLinkColorIndexRef = useRef<number>(0);

		const { listenTap } = useEvent();
		const { setMode } = usePageMangerContext();
		const { requestAnimate, cancelAnimate } = useAnimate();

		const registerDrawContainerSetColor = (
			setColor: (color: string) => void
		) => {
			drawContainerSetColor.current = setColor;
		};

		const getStage = () => {
			// Konva.pixelRatio = 1;
			if (!stageRef.current) {
				return new Konva.Stage({
					container: "container",
					width: width,
					height: height,
				});
			}
			return stageRef.current;
		};

		const getLayer = () => {
			if (!layerRef.current) {
				layerRef.current = new Konva.Layer();
				const stage = getStage();
				stage.add(layerRef.current);
				return layerRef.current;
			}
			return layerRef.current;
		};

		const getBackgroundLayer = () => {
			if (!backgroundLayerRef.current) {
				backgroundLayerRef.current = new Konva.Layer();
				const stage = getStage();
				stage.add(backgroundLayerRef.current);
				backgroundLayerRef.current.listening(false);
				return backgroundLayerRef.current;
			}
			backgroundLayerRef.current.listening(false);
			return backgroundLayerRef.current;
		};

		const getDrawLayer = () => {
			if (!drawLayerRef.current) {
				drawLayerRef.current = new Konva.Layer();
				const stage = getStage();
				stage.add(drawLayerRef.current);
				drawLayerRef.current.listening(false);
				return drawLayerRef.current;
			}
			drawLayerRef.current.listening(false);
			return drawLayerRef.current;
		};

		const getClockLayer = () => {
			if (!clockLayerRef.current) {
				clockLayerRef.current = new Konva.Layer();
				const stage = getStage();
				stage.add(clockLayerRef.current);
				return clockLayerRef.current;
			}
			return clockLayerRef.current;
		};

		const addStoryImage = (src: string) => {
			stageRef.current = getStage();
			const layer = getBackgroundLayer();
			layer.add(addBackgroundImage(src));
		};

		const drawWithAccuracy = async (
			drawCallback: (x: number, y: number) => Rect | Promise<any>,
			group: Group,
			accuracy: number,
			pos?: Vector2d | null,
			lastPoint?: Vector2d | null,
			config?: { connected?: boolean }
		) => {
			let konvaNode;
			let maxDistance =
				lastPoint &&
				pos &&
				Math.max(
					Math.abs(lastPoint.x - pos.x),
					Math.abs(lastPoint.y - pos.y)
				);
			if (config && config.connected && lastPoint && pos && maxDistance) {
				let y = lastPoint.y + (pos.y - lastPoint.y) / maxDistance;
				let x = lastPoint.x + (pos.x - lastPoint.x) / maxDistance;
				for (let i = 0; i < maxDistance; i += accuracy) {
					konvaNode = await drawCallback(x, y);

					konvaNode && group.add(konvaNode);
					x += ((pos.x - lastPoint.x) / maxDistance) * accuracy;
					y += ((pos.y - lastPoint.y) / maxDistance) * accuracy;
				}
			} else {
				konvaNode = pos && (await drawCallback(pos.x, pos.y));

				konvaNode && group.add(konvaNode);
			}
		};

		const drawShape = (
			group: Group,
			pos?: Vector2d | null,
			lastPoint?: Vector2d | null,
			config?: { connected?: boolean }
		) => {
			if (brushConfig.current.mode === BrushModesEnum.Heart) {
				drawWithAccuracy(
					(x, y) =>
						drawSVG(
							x,
							y,
							group,
							brushConfig.current.strokeWidth,
							() => smokeSVG(brushConfig.current.stroke)
						),
					group,
					10,
					pos,
					lastPoint,
					config
				);
			} else {
				drawWithAccuracy(
					(x, y) => drawRect(x, y, brushConfig.current),
					group,
					2,
					pos,
					lastPoint,
					config
				);
			}
		};

		const getColorPickerShape = () => {
			let layer = getDrawLayer();

			if (
				colorPickerSVG.current &&
				colorPickerSVG.current.group &&
				colorPickerSVG.current.path &&
				colorPickerSVG.current.circle
			) {
				return colorPickerSVG.current;
			}

			colorPickerSVG.current = drawColorPickerShape();
			layer.add(colorPickerSVG.current.group);
			return colorPickerSVG.current;
		};

		const drawEyeDropperSVG = (x: number, y: number) => {
			let colorPicker = getColorPickerShape();
			colorPicker.group.hide();

			let imageData = stageRef.current
				?.toCanvas()
				.getContext("2d")
				?.getImageData(x, y, 1, 1).data;

			colorPicker.group.show();
			let layer = getDrawLayer();
			colorPicker.group.zIndex(layer.getChildren().length - 1);

			let rgbaColor =
				imageData && rgbToHex(imageData[0], imageData[1], imageData[2]);

			if (rgbaColor) {
				colorPicker.group.setAttrs({ x: x - 24.875, y: y - 91.5 });
				colorPicker.path.setAttrs({ fill: rgbaColor });
				colorPicker.circle.setAttrs({ fill: rgbaColor });
				colorPicker.color = rgbaColor;
			}
		};

		const colorDropper = (pos?: Vector2d | null) => {
			if (!isEyeDropping.current) {
				return;
			}
			pos && drawEyeDropperSVG(pos.x, pos.y);
		};

		const toggleEyeDropper = (status?: boolean) => {
			if (status === undefined || status === true) {
				setMode(StoryContextModes.IsColorPicking, true);
			}
			if (status === false) {
				colorPickerSVG.current?.group?.hide();
				isEyeDropping.current = false;
				brushConfig.current.stroke =
					colorPickerSVG.current?.color || brushConfig.current.stroke;
				if (
					colorPickerSVG.current?.color &&
					drawContainerSetColor?.current
				) {
					drawContainerSetColor.current(colorPickerSVG.current.color);
				}
				if (isDrawModeOn.current) {
					startDrawMode();
				}
				!isDrawModeOn.current &&
					startTextMode(colorPickerSVG.current?.color);
				return;
			}
			isEyeDropping.current = !isEyeDropping.current;
			if (isEyeDropping.current) {
				const x = width / 2;
				const y = height / 2;
				drawEyeDropperSVG(x, y);
			}
		};

		const draw = () => {
			const layer = getDrawLayer();

			let lastLine: Line;
			let lastPoint: Vector2d | undefined | null;
			let group: Group;

			stageRef.current?.on("mousedown touchstart", function (e) {
				let pos = stageRef.current?.getPointerPosition();
				if (isEyeDropping.current) {
					colorDropper(pos);
					setMode(StoryContextModes.IsColorPicking, true);
					return;
				}
				if (!isDrawModeOn.current) {
					return;
				}

				lastPoint = pos;
				isDrawing.current = true;
				setMode(StoryContextModes.IsPainting, true);
				if (
					brushConfig.current.mode === BrushModesEnum.Highlighter ||
					brushConfig.current.mode === BrushModesEnum.Heart
				) {
					group = new Konva.Group(
						brushConfig.current.mode === BrushModesEnum.Highlighter
							? { opacity: 0.5 }
							: {}
					);
					drawShape(group, pos);
					layer.add(group);
				} else {
					lastLine = drawLine(brushConfig.current, pos);
					layer.add(lastLine);
				}
			});

			stageRef.current?.on("mouseup touchend", function () {
				if (isEyeDropping.current) {
					toggleEyeDropper(false);
					isEyeDropping.current = false;
				}
				if (!isDrawModeOn.current) {
					return;
				}
				isDrawing.current = false;
				setMode(StoryContextModes.IsPainting, false);

				if (
					brushConfig.current.mode === BrushModesEnum.Highlighter ||
					brushConfig.current.mode === BrushModesEnum.Heart
				) {
					drawShapeRef.current.push(group);
				} else {
					if (!drawShapeRef.current.length) {
						setMode(StoryContextModes.IsDrawing, true, {
							hasLine: true,
						});
					}
					drawShapeRef.current.push(lastLine);
				}
			});

			stageRef.current?.on("mousemove touchmove", function (e) {
				const pos = stageRef.current?.getPointerPosition();

				colorDropper(pos);
				if (!isDrawModeOn.current) {
					return;
				}
				if (!isDrawing.current || isEyeDropping.current) {
					return;
				}

				e.evt.preventDefault();

				if (
					brushConfig.current.mode === BrushModesEnum.Highlighter ||
					brushConfig.current.mode === BrushModesEnum.Heart
				) {
					brushConfig.current.mode === BrushModesEnum.Highlighter &&
						group.cache();
					drawShape(group, pos, lastPoint, { connected: true });
					lastPoint = pos;
				} else {
					let newPoints =
						pos && lastLine.points().concat([pos.x, pos.y]);
					newPoints && lastLine.points(newPoints);
				}
			});
		};

		const startDrawMode = () => {
			isDrawModeOn.current = true;
			getLayer().listening(false);
			setMode(StoryContextModes.IsDrawing, true);
		};

		const startTextMode = (color?: string) => {
			setMode(StoryContextModes.IsEditingText, true, {
				text: " ",
				color: color || BrushColorEnum.White,
			});
		};

		const stopDrawMode = () => {
			isDrawModeOn.current = false;
			getLayer().listening(true);
			setMode(StoryContextModes.IsDrawing, false);
		};

		const setBrushColor = (color: BrushColorEnum | string) => {
			brushConfig.current.stroke = color;
		};

		const setBrushMode = (mode: BrushModesEnum) => {
			brushConfig.current.mode = mode;
		};

		const setBrushStrokeWidth = (strokeWidth: OneToTwentyType) => {
			brushConfig.current.strokeWidth = strokeWidth;
		};

		const getStrokeWidth = () => {
			return brushConfig.current.strokeWidth;
		};

		const undoDraw = () => {
			if (drawShapeRef.current.length < 1) {
				return;
			}
			drawShapeRef.current[drawShapeRef.current.length - 1].remove();
			drawShapeRef.current.splice(drawShapeRef.current.length - 1, 1);
			if (drawShapeRef.current.length === 0) {
				setMode(StoryContextModes.IsDrawing, true, { hasLine: false });
			}
		};

		const downloadStage = () => {
			const stage = getStage();
			const dataURL = stage.toDataURL({
				width,
				height,
				mimeType: "image/jpeg",
				pixelRatio: 3,
			});

			const downloadLink = document.createElement("a");
			downloadLink.href = dataURL;
			downloadLink.download = "story_image.png"; // Specify the desired filename
			downloadLink.click();
		};

		const isInTrash = (pos: Vector2d) => {
			if (
				pos.x > (width - trashWidth) / 2 &&
				pos.x < (width + trashWidth) / 2 &&
				pos.y > height - trashHeight - trashBottom &&
				pos.y < height - trashBottom
			) {
				setMode(StoryContextModes.IsInTrash, true, { status: true });
				return true;
			}
			setMode(StoryContextModes.IsInTrash, true, { status: false });

			return false;
		};

		const addInteractivity = (
			shape: Shape | Group,
			name: string,
			tabHandler: (ev: Event) => void,
			customLayer?: Layer,
			isClock?: boolean
		) => {
			Konva.capturePointerEventsEnabled = true;
			let layer: Layer;
			if (customLayer) {
				layer = customLayer;
			} else {
				layer = getLayer();
			}
			const stage = getStage();
			const currentEditingShape = currentEditingShapeRef.current;
			const clockAttrs = clockAttrsRef.current;

			let originalAttrs = {
				...(isClock && clockAttrs
					? {
							scaleX: clockAttrs.scaleX,
							scaleY: clockAttrs.scaleY,
							rotation: clockAttrs.rotation,
							x: clockAttrs.x,
							y: clockAttrs.y,
					  }
					: currentEditingShape
					? {
							scaleX: currentEditingShape.scaleX,
							scaleY: currentEditingShape.scaleY,
							rotation: currentEditingShape.rotation,
							x: currentEditingShape.x,
							y: currentEditingShape.y,
					  }
					: {
							scaleX: 1,
							scaleY: 1,
							rotation: 0,
							x: stage.width() / 2,
							y: stage.height() / 2,
					  }),
				name,
			};

			let group = new Konva.Group(originalAttrs);
			layer.add(group);

			group.add(shape);

			let hammerTime = new Hammer(group as any, { domEvents: true });

			hammerTime.get("rotate").set({ enable: true });

			let oldRotation = 0;
			let startScaleX = 0;
			group.on("rotatestart", function (ev) {
				oldRotation = ev.evt.gesture.rotation;
				startScaleX = group.scaleX();
			});

			group.on("rotate", function (ev) {
				const gestureRotation = ev.evt.gesture.rotation;
				let delta = oldRotation - gestureRotation;
				oldRotation = gestureRotation;
				if (Math.abs(delta) < 20) {
					group.rotate(-delta);
				}

				const gestureScale = ev.evt.gesture.scale;
				if (gestureScale !== 1) {
					const scale = startScaleX * gestureScale;
					group.scaleX(scale);
					group.scaleY(scale);
					lastScaleRef.current = scale;
					maxScaleRef.current = scale;
				}
			});

			group.on("touchstart mousedown", function (ev) {
				stageRef.current?.on("touchmove mousemove", touchMove);
				let pos = stageRef.current?.getPointerPosition();
				group.zIndex(layer.getChildren().length - 1);
				draggingNode.current = group;
				if (pos) {
					diffRef.current = {
						x: pos.x - group.x(),
						y: pos.y - group.y(),
					};
				}
			});

			group.on("touchend mouseup", function (ev) {
				stageRef.current?.off("touchmove mousemove", touchMove);
				if (draggingNode.current) {
					let pos = stageRef.current?.getPointerPosition();
					if (pos && isInTrash(pos)) {
						if (draggingNode.current.name() === "hashtag") {
							lastHashtagColorIndexRef.current = 0;
						}
						if (draggingNode.current.name() === "link") {
							lastLinkColorIndexRef.current = 0;
						}
						draggingNode.current.remove();
					}
				}
				diffRef.current = undefined;
				draggingNode.current = null;
				setMode(StoryContextModes.IsDragging, false);
			});

			const touchMove = (e: any) => {
				setMode(StoryContextModes.IsDragging, true);
				if (!draggingNode.current) {
					return;
				}
				let startPos = stageRef.current?.getPointerPosition()!;
				const inTrash = isInTrash(startPos);
				if (
					!isInTrashRef.current &&
					inTrash &&
					tweenRef.current !== "scaleIn"
				) {
					isInTrashRef.current = true;
					if (cancelAnimation.current) {
						cancelAnimate(cancelAnimation.current);
					}
					tweenRef.current = "scaleIn";
					let lastScale = lastScaleRef.current;
					cancelAnimation.current = requestAnimate(
						150,
						(t: number) => {
							let pos = stageRef.current?.getPointerPosition();
							const scale = 0.2 + (1 - t) * (lastScale - 0.2);
							lastScaleRef.current = scale;

							if (pos) {
								group.setAttrs({
									scaleX: scale,
									scaleY: scale,
									x:
										pos.x -
										((diffRef.current?.x || 0) /
											maxScaleRef.current) *
											scale,
									y:
										pos.y -
										((diffRef.current?.y || 0) /
											maxScaleRef.current) *
											scale,
								});
							}
						},
						() => {
							tweenRef.current = "";
						}
					);
				} else if (
					isInTrashRef.current &&
					!inTrash &&
					tweenRef.current !== "scaleOut"
				) {
					isInTrashRef.current = false;
					tweenRef.current = "scaleOut";
					if (cancelAnimation.current) {
						cancelAnimate(cancelAnimation.current);
					}
					let lastScale = lastScaleRef.current;
					cancelAnimation.current = requestAnimate(
						150,
						(t: number) => {
							let pos = stageRef.current?.getPointerPosition();
							const scale =
								lastScale +
								t * (maxScaleRef.current - lastScale);
							lastScaleRef.current = scale;
							if (pos) {
								group.setAttrs({
									scaleX: scale,
									scaleY: scale,
									x:
										pos.x -
										((diffRef.current?.x || 0) /
											maxScaleRef.current) *
											scale,
									y:
										pos.y -
										((diffRef.current?.y || 0) /
											maxScaleRef.current) *
											scale,
								});
							}
						},
						() => {
							tweenRef.current = "";
						}
					);
				} else if (
					isInTrashRef.current &&
					inTrash &&
					!tweenRef.current
				) {
					let pos = stageRef.current?.getPointerPosition();
					if (pos) {
						group.setAttrs({
							x:
								pos.x -
								(diffRef.current?.x || 0) * group.scaleX(),
							y:
								pos.y -
								(diffRef.current?.y || 0) * group.scaleX(),
						});
					}
				} else if (tweenRef.current === "") {
					let pos = stageRef.current?.getPointerPosition();
					if (pos) {
						group.setAttrs({
							x: pos.x - (diffRef.current?.x || 0),
							y: pos.y - (diffRef.current?.y || 0),
						});
					}
				}
			};

			listenTap(group as any, EventType.Tap, tabHandler);

			if (currentEditingShape) {
				currentEditingShapeRef.current = null;
			}
			if (isClock) {
				clockAttrsRef.current = null;
			}
		};

		const popShape = (name: string) => {
			const layer = getLayer();
			const foundShape = layer.findOne(`.${name}`);
			const shapeAttrs = foundShape?.getAttrs();
			foundShape?.destroy();
			return shapeAttrs;
		};

		const popAndSaveShape = (name: string) => {
			const layer = getLayer();
			const foundShape = layer.findOne(`.${name}`);
			const shapeAttrs = foundShape?.getAttrs();
			foundShape?.destroy();
			if (shapeAttrs) {
				lastPoppedShape.current = shapeAttrs;
				if (name === "hashtag") {
					lastPoppedShape.current.lastColorIndex =
						lastHashtagColorIndexRef.current;
				}
				if (name === "link") {
					lastPoppedShape.current.lastColorIndex =
						lastLinkColorIndexRef.current;
				}
				return lastPoppedShape.current;
			}
		};

		const addText = (defaultText?: string, color?: string) => {
			const name = new Date().toISOString();
			setMode(StoryContextModes.IsAddingText, true);
			if (defaultText && color) {
				let size = 200;

				let text = new Konva.Text({
					text: defaultText,
					fill: color,
					x: -size / 2,
					width: size,
					align: "center",
					fontSize: 30,
					padding: 20,
				});
				addInteractivity(text, name, function (ev) {
					currentEditingShapeRef.current = popShape(name);

					setMode(StoryContextModes.IsEditingText, true, {
						text: defaultText,
						color,
					});
				});
			}
			setMode(StoryContextModes.IsAddingText, false);
		};

		const changeWidgetColor = (
			group: Group,
			colorArray: { color: (string | number)[]; fill: string }[],
			i: number,
			setI?: React.MutableRefObject<number>
		) => {
			return function () {
				i = (i + 1) % colorArray.length;
				if (setI) {
					setI.current = i;
				}
				setHashtagColor(group, colorArray[i].color, colorArray[i].fill);
			};
		};

		const addHashtag = (text?: string) => {
			let i = lastHashtagColorIndexRef.current || 0;
			if (lastPoppedShape.current?.name === "hashtag") {
				currentEditingShapeRef.current = lastPoppedShape.current;
			}
			if (text) {
				const hashtag = drawHashtag(
					text,
					hashtagColors[i].color,
					hashtagColors[i].fill
				);
				addInteractivity(
					hashtag,
					"hashtag",
					changeWidgetColor(
						hashtag,
						hashtagColors,
						i,
						lastHashtagColorIndexRef
					)
				);
			}
			setMode(StoryContextModes.IsHashtagEditing, false);
		};

		const addMention = (text?: string) => {
			if (text) {
				const mention = drawMention(
					text,
					mentionColors[0].color,
					mentionColors[0].fill
				);
				addInteractivity(
					mention,
					"mention",
					changeWidgetColor(mention, mentionColors, 0)
				);
			}
			setMode(StoryContextModes.IsMentionEditing, false);
		};

		const addLink = (text: string) => {
			let i = lastLinkColorIndexRef.current || 0;
			if (lastPoppedShape.current?.name === "link") {
				currentEditingShapeRef.current = lastPoppedShape.current;
			}
			const link = drawLink(
				linkColors[i].color,
				linkColors[i].fill,
				text
			);
			addInteractivity(
				link,
				"link",
				changeWidgetColor(link, linkColors, i, lastLinkColorIndexRef)
			);
		};

		const addPoll = (
			question?: string,
			leftOption?: string,
			rightOption?: string
		) => {
			const poll = drawPoll(
				question || "",
				leftOption || "YES",
				rightOption || "NO"
			);
			addInteractivity(poll, "poll", () => {
				currentEditingShapeRef.current = popShape("poll");
				setMode(StoryContextModes.IsPollEditing, true, {
					question,
					leftOption: leftOption || "YES",
					rightOption: rightOption || "NO",
				});
			});
			setMode(StoryContextModes.IsPollEditing, false);
		};

		const addEmojiSlider = (
			text?: string,
			emoji?: string,
			defaultValue?: number,
			colorsIndex?: number
		) => {
			if (emoji && defaultValue && colorsIndex !== undefined) {
				const emojiSlider = drawEmojiSlider(
					emojiSliderColors[colorsIndex],
					defaultValue,
					emoji,
					text
				);
				addInteractivity(emojiSlider, "emoji-slider", () => {
					currentEditingShapeRef.current = popShape("emoji-slider");
					setMode(StoryContextModes.IsEmojiSliderEditing, true, {
						text,
						emoji,
						defaultValue,
						colorsIndex,
					});
				});
			}
			setMode(StoryContextModes.IsEmojiSliderEditing, false);
		};

		const addClock = (type: ClockEnum = ClockEnum.Card) => {
			let clockType = type;
			const clock = drawClock(Date.now(), type);
			const clockLayer = getClockLayer();
			clockLayer.children?.forEach((node) => node.remove());
			addInteractivity(
				clock as Group,
				"clock",
				() => {
					clockLayer.children?.forEach((node) => {
						clockAttrsRef.current = node.getAttrs();
						node.remove();
					});
					if (clockType === ClockEnum.Card) {
						clockType = ClockEnum.Clock;
					} else if (clockType === ClockEnum.Clock) {
						clockType = ClockEnum.Normal;
					} else if (clockType === ClockEnum.Normal) {
						clockType = ClockEnum.Card;
					}
					addClock(clockType);
				},
				clockLayer,
				true
			);
		};

		const addEmoji = (emoji: string) => {
			const emojiNode = drawEmoji(emoji);
			addInteractivity(emojiNode, "emoji", () => {});
		};

		useEffect(() => {
			stageRef.current = getStage();
			// addStoryImage("assets/images/longPic.png");
			draw();

			return () => {
				stageRef.current?.off("mousedown touchstart");
				stageRef.current?.off("mouseup touchend");
				stageRef.current?.off("mousemove touchmove");
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<StoryContext.Provider
				value={{
					startDrawMode,
					stopDrawMode,
					setBrushColor,
					setBrushMode,
					undoDraw,
					setBrushStrokeWidth,
					isDrawing: isDrawing.current,
					toggleEyeDropper,
					downloadStage,
					registerDrawContainerSetColor,
					addText,
					getBrushColor: brushConfig.current.stroke,
					getStrokeWidth,
					addHashtag,
					addMention,
					addEmojiSlider,
					addPoll,
					addClock,
					addEmoji,
					addLink,
					popAndSaveShape,
					addStoryImage,
				}}
			>
				{children}
			</StoryContext.Provider>
		);
	}
);
