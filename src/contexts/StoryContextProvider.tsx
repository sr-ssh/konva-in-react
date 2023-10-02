import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	memo,
	useEffect,
	useRef,
} from "react";
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
	drawColorPickerShape,
	drawHashtag,
	drawLine,
	drawRect,
	drawSVG,
	rgbToHex,
} from "../utils/konvaUtils";
import { Vector2d } from "konva/lib/types";
import { Group } from "konva/lib/Group";
import { Rect } from "konva/lib/shapes/Rect";
import { Path } from "konva/lib/shapes/Path";
import { Circle } from "konva/lib/shapes/Circle";
import { smokeSVG } from "../assets/svg/smokeSVG";
import { Shape } from "konva/lib/Shape";
import { EventType, useEvent } from "../hooks/useEvent";

const width = window.innerWidth;
const height = window.innerHeight;

export interface BrushConfigType {
	stroke: BrushColorEnum | string;
	mode: BrushModesEnum;
	strokeWidth: OneToTwentyType;
}

interface StoryContextType {
	startDrawMode: () => void;
	startTextMode: () => void;
	stopDrawMode: () => void;
	setBrushColor: (color: BrushColorEnum | string) => void;
	setBrushMode: (mode: BrushModesEnum) => void;
	undoDraw: () => void;
	setBrushStrokeWidth: (strokeWidth: OneToTwentyType) => void;
	isDrawing: boolean;
	registerDrawContainer: (ref: HTMLDivElement) => void;
	registerStoryContainer: (ref: HTMLDivElement) => void;
	registerDrawContainerSetColor: (
		setColor: Dispatch<SetStateAction<BrushColorEnum | string>>
	) => void;
	toggleEyeDropper: () => void;
	downloadStage: () => void;
	addText: (defaultText?: string, color?: string) => void;
	registerTextContainer: (
		ref: HTMLDivElement,
		handleText: (text: string, color: string) => void
	) => void;
}

export const StoryContext = createContext<StoryContextType>({
	startDrawMode: () => {},
	startTextMode: () => {},
	stopDrawMode: () => {},
	setBrushColor: (color: BrushColorEnum | string) => {},
	setBrushMode: (mode: BrushModesEnum) => {},
	undoDraw: () => {},
	setBrushStrokeWidth: (strokeWidth: OneToTwentyType) => {},
	isDrawing: false,
	registerDrawContainer: (ref: HTMLDivElement) => {},
	registerStoryContainer: (ref: HTMLDivElement) => {},
	registerDrawContainerSetColor: (
		setColor: Dispatch<SetStateAction<BrushColorEnum | string>>
	) => {},
	toggleEyeDropper: () => {},
	downloadStage: () => {},
	addText: (defaultText?: string, color?: string) => {},
	registerTextContainer: (
		ref: HTMLDivElement,
		handleText: (text: string, color: string) => void
	) => {},
});

export const StoryContextProvider = memo(
	({ children }: { children: ReactNode }) => {
		const drawShapeRef = useRef<(Group | Line)[]>([]);
		let stageRef = useRef<Stage>();
		let layerRef = useRef<Layer>();
		let drawLayerRef = useRef<Layer>();
		let isDrawModeOn = useRef<boolean>(false);
		let isDrawing = useRef<boolean>(false);
		let isEyeDropping = useRef<boolean>(false);
		let showTextContainerRef =
			useRef<(text: string, color: string) => void>();
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
		let storyContainerRef = useRef<HTMLDivElement>();
		let drawContainerRef = useRef<HTMLDivElement>();
		let textContainerRef = useRef<HTMLDivElement>();
		let drawContainerSetColor =
			useRef<Dispatch<SetStateAction<BrushColorEnum | string>>>();
		let currentEditingShapeRef = useRef<any>();
		const { listenTap } = useEvent();

		const registerStoryContainer = (ref: HTMLDivElement) => {
			storyContainerRef.current = ref;
		};

		const registerDrawContainer = (ref: HTMLDivElement) => {
			drawContainerRef.current = ref;
		};

		const registerTextContainer = (
			ref: HTMLDivElement,
			handleText: (text: string, color: string) => void
		) => {
			showTextContainerRef.current = handleText;
			textContainerRef.current = ref;
		};

		const registerDrawContainerSetColor = (
			setColor: Dispatch<SetStateAction<BrushColorEnum | string>>
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
				// layerRef.current.listening(false);
				return layerRef.current;
			}
			// layerRef.current.listening(false);
			return layerRef.current;
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

		const addStoryImage = () => {
			const layer = getLayer();
			layer.add(addBackgroundImage());
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
			if (!isDrawModeOn.current && textContainerRef.current) {
				textContainerRef.current.style.display = "none";
			}
			if (status === false) {
				colorPickerSVG.current?.group?.hide();
				isEyeDropping.current = false;
				brushConfig.current.stroke =
					colorPickerSVG.current?.color || brushConfig.current.stroke;
				colorPickerSVG.current?.color &&
					drawContainerSetColor?.current &&
					drawContainerSetColor.current(
						colorPickerSVG.current?.color
					);
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
					if (drawContainerRef.current)
						drawContainerRef.current.style.display = "none";
					return;
				}
				if (!isDrawModeOn.current) {
					return;
				}

				lastPoint = pos;
				isDrawing.current = true;
				if (drawContainerRef.current)
					drawContainerRef.current.style.display = "none";

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
				if (drawContainerRef.current)
					drawContainerRef.current.style.display = "block";

				if (
					brushConfig.current.mode === BrushModesEnum.Highlighter ||
					brushConfig.current.mode === BrushModesEnum.Heart
				) {
					drawShapeRef.current.push(group);
				} else if (brushConfig.current.mode !== BrushModesEnum.Eraser) {
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
		};

		const startTextMode = (color?: string) => {
			if (textContainerRef.current) {
				textContainerRef.current.style.display = "block";
			}
			if (showTextContainerRef.current) {
				showTextContainerRef.current("", color || BrushColorEnum.White);
			}
		};

		const stopDrawMode = () => {
			isDrawModeOn.current = false;
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

		const undoDraw = () => {
			if (drawShapeRef.current.length < 1) {
				return;
			}
			drawShapeRef.current[drawShapeRef.current.length - 1].remove();
			drawShapeRef.current.splice(drawShapeRef.current.length - 1, 1);
		};

		const downloadStage = () => {
			const stage = getStage();
			const dataURL = stage.toDataURL({
				width,
				height,
				mimeType: "image/jpeg",
				quality: 1,
			});

			const downloadLink = document.createElement("a");
			downloadLink.href = dataURL;
			downloadLink.download = "story_image.png"; // Specify the desired filename
			downloadLink.click();
		};

		const addInteractivity = (
			shape: Shape,
			name: string,
			tabHandler: (ev: Event) => void
		) => {
			Konva.capturePointerEventsEnabled = true;
			const layer = getLayer();
			const stage = getStage();
			const currentEditingShape = currentEditingShapeRef.current;

			let originalAttrs = {
				x: stage.width() / 2,
				y: stage.height() / 2,
				scaleX: currentEditingShape?.scaleX || 1,
				scaleY: currentEditingShape?.scaleY || 1,
				draggable: true,
				rotation: currentEditingShape?.rotation || 0,
				name,
				...(currentEditingShape && {
					x: currentEditingShape.x,
					y: currentEditingShape.y,
				}),
			};

			let group = new Konva.Group(originalAttrs);
			layer.add(group);

			group.add(shape);

			let hammerTime = new Hammer(group as any, { domEvents: true });

			hammerTime.get("rotate").set({ enable: true });

			let oldRotation = 0;
			let startScaleX = 0;
			let startScaleY = 0;
			group.on("rotatestart", function (ev) {
				oldRotation = ev.evt.gesture.rotation;
				startScaleX = group.scaleX();
				startScaleY = group.scaleY();
				group.stopDrag();
				group.draggable(false);
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
					group.scaleX(startScaleX * gestureScale);
					group.scaleY(startScaleY * gestureScale);
				}
			});

			group.on("rotateend rotatecancel", function (ev) {
				group.draggable(true);
			});

			group.on("dragstart", function (ev) {
				group.zIndex(layer.getChildren().length - 1);
				if (storyContainerRef.current) {
					storyContainerRef.current.style.display = "none";
				}
			});

			group.on("dragend", function (ev) {
				if (storyContainerRef.current) {
					storyContainerRef.current.style.display = "block";
				}
			});

			listenTap(group as any, EventType.Tap, tabHandler);

			if (currentEditingShape) {
				currentEditingShapeRef.current = null;
			}
		};

		const popShape = (name: string) => {
			const layer = getLayer();
			const foundShape = layer.findOne(`.${name}`);
			const shapeAttrs = foundShape?.getAttrs();
			foundShape?.destroy();
			return shapeAttrs;
		};

		const addText = (defaultText?: string, color?: string) => {
			const name = new Date().toISOString();
			if (textContainerRef.current && storyContainerRef.current) {
				storyContainerRef.current.style.display = "block";
				textContainerRef.current.style.display = "none";
			}
			if (defaultText && color) {
				let size = 200;

				let text = new Konva.Text({
					text: defaultText,
					fill: color,
					x: -size / 2,
					width: size,
					align: "center",
					fontSize: 30,
				});
				addInteractivity(text, name, function (ev) {
					currentEditingShapeRef.current = popShape(name);

					if (textContainerRef.current && storyContainerRef.current) {
						textContainerRef.current.style.display = "block";
						storyContainerRef.current.style.display = "none";
					}
					showTextContainerRef.current?.(defaultText, color);
				});
			}
		};

		const drawWidgets = () => {
			const layer = getLayer();
			layer.add(drawHashtag());
		};

		useEffect(() => {
			stageRef.current = getStage();
			addStoryImage();
			draw();
			// drawWidgets();

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
					startTextMode,
					stopDrawMode,
					setBrushColor,
					setBrushMode,
					undoDraw,
					setBrushStrokeWidth,
					isDrawing: isDrawing.current,
					registerDrawContainer,
					toggleEyeDropper,
					downloadStage,
					registerDrawContainerSetColor,
					addText,
					registerTextContainer,
					registerStoryContainer,
				}}
			>
				{children}
			</StoryContext.Provider>
		);
	}
);
