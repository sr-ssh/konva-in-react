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
	getGlobalCompositeOperation,
	getShadowColor,
	getStrokeColor,
	setImagePosition,
} from "../utils/drawColors";

const width = window.innerWidth;
const height = window.innerHeight;

interface StoryContextType {
	startDraw: () => void;
	stopDraw: () => void;
	setBrushColor: (color: BrushColorEnum) => void;
	setBrushMode: (mode: BrushModesEnum) => void;
	undoDraw: () => void;
	setBrushStrokeWidth: (strokeWidth: OneToTwentyType) => void;
}

export const StoryContext = createContext<StoryContextType>({
	startDraw: () => {},
	stopDraw: () => {},
	setBrushColor: (color: BrushColorEnum) => {},
	setBrushMode: (mode: BrushModesEnum) => {},
	undoDraw: () => {},
	setBrushStrokeWidth: (strokeWidth: OneToTwentyType) => {},
});

export const StoryContextProvider = memo(
	({ children }: { children: ReactNode }) => {
		const drawShapeRef = useRef<Line[]>([]);

		let stageRef = useRef<Stage>();
		let layerRef = useRef<Layer>();
		let drawLayerRef = useRef<Layer>();
		let isDrawing = useRef<boolean>(false);
		let brushConfig = useRef<{
			stroke: BrushColorEnum;
			mode: BrushModesEnum;
			strokeWidth: OneToTwentyType;
		}>({
			mode: BrushModesEnum.Pen,
			strokeWidth: 10,
			stroke: BrushColorEnum.White,
		});

		const getStage = () => {
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

		const getDrawLayer = () => {
			if (!drawLayerRef.current) {
				drawLayerRef.current = new Konva.Layer();
				const stage = getStage();
				stage.add(drawLayerRef.current);
				return drawLayerRef.current;
			}
			return drawLayerRef.current;
		};

		const addStoryImage = () => {
			const layer = getLayer();
			Konva.hitOnDragEnabled = true;

			let imageObj = new Image();
			imageObj.src = "assets/images/black.jpeg";
			let konvaImage = new Konva.Image({
				image: imageObj,
			});
			konvaImage.setAttrs({
				...setImagePosition(imageObj),
				name: "storyImage",
			});
			layer.add(konvaImage);
		};

		const draw = () => {
			const layer = getDrawLayer();

			let isPaint = false;
			let lastLine: Line;

			let imageObj = new Image();
			imageObj.src = "assets/images/longPic.png";

			stageRef.current?.on("mousedown touchstart", function (e) {
				console.log(
					getStrokeColor(
						brushConfig.current?.stroke,
						brushConfig.current?.mode
					),
					getShadowColor(brushConfig.current.stroke),
					brushConfig.current.mode === BrushModesEnum.Neon
				);
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
					stroke: getStrokeColor(
						brushConfig.current?.stroke,
						brushConfig.current?.mode
					),
					strokeWidth: brushConfig.current?.strokeWidth,
					globalCompositeOperation: getGlobalCompositeOperation(
						brushConfig.current.mode
					),
					// round cap for smoother lines
					lineCap: "round",
					lineJoin: "round",
					...(brushConfig.current.mode === BrushModesEnum.Neon && {
						shadowColor: getShadowColor(brushConfig.current.stroke),
						hasShadow: true,
						shadowBlur: 10,
						fillAfterStrokeEnabled: true,
						shadowForStrokeEnabled: true,
						...(pos && {
							shadowOffset: { x: 0, y: 0 },
						}),
					}),
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
				console.log(drawShapeRef.current);
			});

			// and core function - drawing
			stageRef.current?.on("mousemove touchmove", function (e) {
				console.log("first");
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

		const setBrushColor = (color: BrushColorEnum) => {
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

		useEffect(() => {
			stageRef.current = getStage();
			addStoryImage();
			draw();
			return () => {
				stageRef.current?.off("mousedown touchstart");
				stageRef.current?.off("mouseup touchend");
				stageRef.current?.off("mousemove touchmove");
			};
		}, []);

		return (
			<StoryContext.Provider
				value={{
					startDraw,
					stopDraw,
					setBrushColor,
					setBrushMode,
					undoDraw,
					setBrushStrokeWidth,
				}}
			>
				{children}
			</StoryContext.Provider>
		);
	}
);
