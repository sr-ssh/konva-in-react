import { ReactNode, createContext, memo, useEffect, useRef } from "react";
import Konva from "konva";
import { Line } from "konva/lib/shapes/Line";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { BrushModesEnum } from "../@types/drawType";

const width = window.innerWidth;
const height = window.innerHeight;

interface StoryContextType {
	startDraw: () => void;
	stopDraw: () => void;
	setBrushColor: (color: string) => void;
	setBrushMode: (mode: BrushModesEnum) => void;
}

export const StoryContext = createContext<StoryContextType>({
	startDraw: () => {},
	stopDraw: () => {},
	setBrushColor: (color: string) => {},
	setBrushMode: (mode: BrushModesEnum) => {},
});

export const StoryContextProvider = memo(
	({ children }: { children: ReactNode }) => {
		const drawShapeRef = useRef<Line[]>([]);

		let stageRef = useRef<Stage>();
		let layerRef = useRef<Layer>();
		let drawLayerRef = useRef<Layer>();
		let isDrawing = useRef<boolean>(false);
		let brushConfig = useRef<{ stroke?: string; mode?: BrushModesEnum }>({
			mode: BrushModesEnum.Pen,
		});

		const getStage = () => {
			if (!stageRef.current) {
				return new Konva.Stage({
					container: "container",
					width: width,
					height: height,
					zIndex: 3,
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

		const getDrawLayer = () => {
			if (!drawLayerRef.current) {
				drawLayerRef.current = new Konva.Layer();
				const stage = getStage();
				stage.add(drawLayerRef.current);
				return drawLayerRef.current;
			}
			return drawLayerRef.current;
		};

		const setImagePosition = (imageObj: HTMLImageElement) => {
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

		const addStoryImage = () => {
			const layer = getLayer();
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
			layer.add(konvaImage);
		};

		const draw = (strokeWidth: number = 5) => {
			const layer = getDrawLayer();

			let isPaint = false;
			let lastLine: Line;

			let imageObj = new Image();
			imageObj.src = "assets/images/longPic.png";

			stageRef.current?.on("mousedown touchstart", function (e) {
				console.log(brushConfig.current);
				if (!isDrawing.current) {
					return;
				}
				let pos = stageRef.current?.getPointerPosition();

				if (brushConfig.current.mode === BrushModesEnum.Highlighter) {
					let konvaImage = new Konva.Line({
						stroke: brushConfig.current?.stroke || "#fff",
						...(pos && {
							points: [pos.x, pos.y, pos.x + 12, pos.y - 12],
						}),
					});

					layer.add(konvaImage);
					stageRef.current?.draw();
				}

				imageObj.src = "assets/images/p2.png";
				isPaint = true;
				lastLine = new Konva.Line({
					stroke: brushConfig.current?.stroke || "#fff",
					strokeWidth,
					globalCompositeOperation:
						brushConfig.current.mode === BrushModesEnum.Pen
							? "source-over"
							: "destination-out",
					// round cap for smoother lines
					lineCap: "round",
					lineJoin: "round",

					shadowColor: "rgb(88, 195, 34)",
					shadowOpacity: 1.2,
					shadowBlur: 0.2,
					fillPatternImage: imageObj,
					fillPatternRepeat: "no-repeat",
					// fillPatternScaleX: 0.5, // Adjust the scale as needed
					// fillPatternScaleY: 0.5,
					// add point twice, so we have some drawings even on a simple click
					...(pos && { points: [pos.x, pos.y, pos.x, pos.y] }),
				});
				drawShapeRef.current.push(lastLine);
				layer.add(lastLine);
			});

			stageRef.current?.on("mouseup touchend", function () {
				if (!isDrawing.current) {
					return;
				}
				isPaint = false;
			});

			// and core function - drawing
			stageRef.current?.on("mousemove touchmove", function (e) {
				if (!isDrawing.current) {
					return;
				}
				if (!isPaint) {
					return;
				}

				// prevent scrolling on touch devices
				e.evt.preventDefault();

				const pos = stageRef.current?.getPointerPosition();
				let newPoints = pos && lastLine.points().concat([pos.x, pos.y]);
				newPoints && lastLine.points(newPoints);

				if (brushConfig.current.mode === BrushModesEnum.Highlighter) {
					let konvaImage = new Konva.Line({
						stroke: brushConfig.current?.stroke || "#fff",
						...(pos && {
							points: [pos.x, pos.y, pos.x + 12, pos.y - 12],
						}),
					});
					layer.add(konvaImage);
					stageRef.current?.draw();
				}
			});
		};

		const startDraw = () => {
			isDrawing.current = true;
		};

		const stopDraw = () => {
			isDrawing.current = false;
		};

		const setBrushColor = (color: string) => {
			brushConfig.current.stroke = color;
		};

		const setBrushMode = (mode: BrushModesEnum) => {
			brushConfig.current.mode = mode;
		};

		useEffect(() => {
			stageRef.current = getStage();
			addStoryImage();
			draw();
		}, []);

		return (
			<StoryContext.Provider
				value={{ startDraw, stopDraw, setBrushColor, setBrushMode }}
			>
				{children}
			</StoryContext.Provider>
		);
	}
);
