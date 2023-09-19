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
	getGlobalCompositeOperation,
	getShadowColor,
	getStrokeColor,
	setImagePosition,
} from "../utils/draw";
import { Vector2d } from "konva/lib/types";
import { Group } from "konva/lib/Group";
import { Rect } from "konva/lib/shapes/Rect";
import { generateRandomNumber } from "../utils/random";
import { Path } from "konva/lib/shapes/Path";
import { Circle } from "konva/lib/shapes/Circle";

const width = window.innerWidth;
const height = window.innerHeight;

export interface BrushConfigType {
	stroke: BrushColorEnum | string;
	mode: BrushModesEnum;
	strokeWidth: OneToTwentyType;
}

interface StoryContextType {
	startDrawMode: () => void;
	stopDrawMode: () => void;
	setBrushColor: (color: BrushColorEnum | string) => void;
	setBrushMode: (mode: BrushModesEnum) => void;
	undoDraw: () => void;
	setBrushStrokeWidth: (strokeWidth: OneToTwentyType) => void;
	isDrawing: boolean;
	registerDrawContainer: (ref: HTMLDivElement) => void;
	registerDrawContainerSetColor: (
		setColor: Dispatch<SetStateAction<BrushColorEnum | string>>
	) => void;
	toggleEyeDropper: () => void;
	downloadStage: () => void;
}

export const StoryContext = createContext<StoryContextType>({
	startDrawMode: () => {},
	stopDrawMode: () => {},
	setBrushColor: (color: BrushColorEnum | string) => {},
	setBrushMode: (mode: BrushModesEnum) => {},
	undoDraw: () => {},
	setBrushStrokeWidth: (strokeWidth: OneToTwentyType) => {},
	isDrawing: false,
	registerDrawContainer: (ref: HTMLDivElement) => {},
	registerDrawContainerSetColor: (
		setColor: Dispatch<SetStateAction<BrushColorEnum | string>>
	) => {},
	toggleEyeDropper: () => {},
	downloadStage: () => {},
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
		let drawContainerRef = useRef<HTMLDivElement>();
		let drawContainerSetColor =
			useRef<Dispatch<SetStateAction<BrushColorEnum | string>>>();

		const registerDrawContainer = (ref: HTMLDivElement) => {
			drawContainerRef.current = ref;
		};

		const registerDrawContainerSetColor = (
			setColor: Dispatch<SetStateAction<BrushColorEnum | string>>
		) => {
			drawContainerSetColor.current = setColor;
		};

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
			imageObj.src = "assets/images/p1.jpg";
			let konvaImage = new Konva.Image({
				image: imageObj,
			});
			konvaImage.setAttrs({
				...setImagePosition(imageObj),
				name: "storyImage",
			});
			layer.add(konvaImage);
		};

		const randomWidth = () => {
			return generateRandomNumber(
				(brushConfig.current.strokeWidth || 0) + 15,
				(brushConfig.current.strokeWidth || 0) + 8
			);
		};

		const drawRect = (x: number, y: number) => {
			return new Konva.Rect({
				width: 8,
				height: brushConfig.current.strokeWidth + 15,
				fill: brushConfig.current.stroke,
				cornerRadius: 5,
				rotation: 5 * 45,
				x,
				y,
			});
		};

		const drawSVG = (x: number, y: number, group: Group) => {
			let width = randomWidth();

			const SVG = `<?xml version="1.0" standalone="no"?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
       width="1280.000000pt" height="1280.000000pt" viewBox="0 0 1280.000000 1280.000000"
       preserveAspectRatio="xMidYMid meet" style="transform: rotate(${generateRandomNumber(
			0,
			360
		)}deg);">
      <metadata>
      Created by potrace 1.15, written by Peter Selinger 2001-2017
      </metadata>
      <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
      fill="${brushConfig.current.stroke}" stroke="none">
      <path d="M11331 11544 c-747 -65 -1419 -278 -2023 -641 -655 -393 -1210 -946
      -1677 -1673 -380 -590 -748 -1442 -961 -2228 -35 -127 -65 -231 -67 -229 -9 9
      -133 878 -144 1005 -13 163 -7 630 11 757 59 425 166 740 338 999 72 108 222
      258 332 331 122 82 194 115 360 166 160 49 237 86 290 139 57 57 71 89 62 141
      -6 37 -13 47 -42 61 -101 51 -268 -2 -458 -146 -372 -279 -597 -597 -761
      -1078 -136 -400 -218 -861 -209 -1175 l5 -153 -39 0 c-21 0 -38 3 -38 8 0 112
      -36 569 -51 662 -95 558 -301 1060 -576 1400 -99 122 -332 343 -427 405 -174
      114 -306 125 -416 36 l-25 -20 20 -37 c41 -77 154 -151 480 -316 281 -142 328
      -172 418 -267 187 -199 330 -484 422 -836 61 -235 110 -591 122 -882 l6 -163
      -42 -59 c-23 -33 -48 -76 -56 -95 -19 -45 -19 -180 0 -266 24 -107 18 -162
      -36 -391 -27 -117 -52 -215 -54 -217 -2 -3 -7 9 -11 24 -90 400 -230 812 -430
      1264 -87 198 -319 666 -413 834 -809 1443 -1990 2341 -3392 2580 -229 39 -413
      56 -691 63 l-258 6 0 -79 c0 -43 5 -153 10 -244 154 -2522 965 -4535 2186
      -5426 463 -337 949 -510 1504 -533 96 -4 168 -10 160 -13 -8 -4 -104 -29 -212
      -57 -218 -55 -321 -96 -495 -197 -683 -397 -1042 -1043 -1248 -2248 -59 -346
      -69 -467 -70 -811 0 -350 29 -754 85 -1160 16 -121 30 -226 30 -232 0 -21 28
      -15 149 33 310 124 615 309 906 553 127 106 401 384 525 531 451 540 863 1253
      1194 2067 131 322 307 846 435 1293 l56 198 0 -342 c0 -420 23 -661 99 -1021
      39 -182 160 -626 167 -612 9 17 82 437 129 745 45 296 74 677 75 964 0 97 1
      176 1 175 1 -1 34 -112 74 -247 134 -458 309 -965 431 -1247 78 -181 296 -616
      417 -834 315 -565 604 -961 972 -1330 285 -286 549 -492 888 -692 112 -67 464
      -247 481 -247 5 0 12 33 15 72 14 179 37 461 56 673 27 310 38 625 29 825 -7
      160 -64 683 -95 865 -19 112 -80 349 -135 520 -120 376 -276 687 -481 958 -86
      114 -283 308 -405 400 -251 187 -583 352 -794 395 l-94 19 105 7 c58 4 191 18
      295 32 384 50 823 207 1115 398 300 196 646 532 907 881 460 614 840 1489
      1062 2448 74 321 235 1179 281 1497 44 305 89 817 90 1018 0 16 -260 14 -469
      -4z m94 -536 c-3 -24 -12 -106 -21 -183 -60 -535 -211 -1148 -394 -1601 -76
      -186 -201 -430 -291 -563 -178 -267 -340 -401 -569 -472 -98 -31 -299 -33
      -400 -6 -259 71 -468 275 -586 571 -118 295 -90 642 80 1001 255 537 700 908
      1366 1139 158 55 632 148 792 155 27 1 27 0 23 -41z m-9845 6 c294 -42 565
      -125 829 -254 556 -271 934 -681 1115 -1207 94 -273 102 -558 24 -788 -26 -74
      -90 -205 -131 -265 -107 -157 -288 -284 -477 -336 -90 -25 -300 -25 -390 -1
      -118 31 -243 102 -337 191 -455 430 -786 1378 -927 2650 l-4 39 96 -7 c53 -4
      144 -14 202 -22z m7316 -1030 c113 -256 91 -714 -49 -1006 -55 -117 -140 -230
      -249 -334 -137 -131 -257 -214 -588 -404 -325 -187 -520 -331 -695 -511 -130
      -134 -183 -209 -277 -393 l-77 -151 -1 86 c0 98 17 207 61 389 32 137 99 352
      127 415 l18 40 29 -78 c15 -43 31 -74 35 -70 4 4 20 69 35 143 40 198 89 333
      176 481 42 73 158 223 166 215 3 -2 -7 -50 -21 -106 -14 -56 -28 -138 -31
      -183 l-6 -82 68 135 c133 261 280 482 376 565 50 43 123 84 114 63 -58 -133
      -94 -277 -85 -338 2 -21 8 -14 34 40 38 80 90 144 170 207 62 51 241 149 251
      139 3 -3 -9 -38 -27 -78 -35 -79 -72 -179 -67 -184 2 -2 27 29 57 69 30 39 95
      115 143 167 101 108 186 231 221 317 50 121 60 179 60 345 1 87 2 158 4 158 2
      0 14 -25 28 -56z m-5071 -136 c0 -132 3 -163 23 -228 34 -109 100 -230 190
      -350 91 -120 264 -308 270 -291 5 16 -25 103 -69 199 -21 45 -36 82 -33 82 15
      0 140 -70 202 -113 98 -67 175 -154 220 -249 20 -42 41 -77 45 -77 21 -2 -19
      220 -59 326 -13 35 -20 63 -15 63 14 0 100 -72 152 -126 143 -150 302 -414
      367 -607 10 -31 22 -61 27 -65 14 -14 -7 153 -35 266 l-28 114 45 -44 c155
      -152 289 -447 324 -713 15 -111 25 -112 60 -7 l23 67 43 -135 c119 -367 149
      -497 158 -694 l5 -111 -24 66 c-62 172 -161 323 -306 470 -156 157 -316 274
      -730 534 -378 237 -475 307 -618 448 -316 310 -410 764 -260 1260 11 37 21 67
      21 67 1 0 2 -69 2 -152z m665 -1834 c257 -42 504 -160 726 -347 294 -247 553
      -691 669 -1147 35 -138 56 -232 52 -236 -2 -2 -41 78 -88 178 -148 321 -302
      522 -507 661 -179 122 -386 161 -575 108 -99 -27 -139 -47 -257 -130 -128 -90
      -151 -104 -158 -96 -4 4 -7 43 -6 88 0 69 7 101 42 201 23 66 40 122 37 124
      -8 9 -127 -82 -189 -145 -174 -176 -289 -442 -312 -723 -4 -44 -10 -80 -13
      -80 -3 0 -21 21 -40 45 -36 49 -72 132 -117 268 -15 48 -31 87 -35 87 -10 0
      -30 -137 -36 -255 -13 -251 58 -514 191 -699 57 -79 175 -193 250 -241 53 -34
      144 -79 201 -99 35 -13 -4 -26 -76 -26 -69 0 -209 32 -307 70 -256 99 -482
      314 -617 588 -94 191 -129 346 -129 572 1 241 52 458 159 675 108 220 266 379
      482 486 42 21 98 37 177 51 64 10 133 26 154 34 44 17 176 12 322 -12z m4025
      15 c194 -24 366 -84 503 -178 281 -190 468 -552 489 -945 16 -300 -100 -713
      -263 -942 -181 -255 -486 -405 -824 -404 l-85 0 56 24 c131 53 247 133 355
      241 125 126 215 284 254 446 34 141 21 431 -26 588 l-17 56 -22 -93 c-26 -109
      -98 -307 -124 -342 l-19 -24 -7 49 c-46 339 -135 560 -299 742 -63 69 -210
      181 -214 162 -1 -8 17 -102 42 -209 24 -107 42 -197 40 -199 -2 -3 -49 27
      -104 65 -159 110 -215 142 -298 171 -66 23 -93 27 -192 27 -103 0 -124 -3
      -202 -31 -151 -53 -294 -157 -435 -315 -96 -109 -182 -243 -272 -428 -48 -96
      -81 -154 -81 -140 0 14 11 73 25 133 66 292 211 602 400 857 151 202 309 354
      498 480 107 71 133 84 290 136 232 78 354 95 532 73z m-6199 -372 c357 -133
      637 -150 853 -51 30 13 56 23 58 21 2 -2 -17 -46 -41 -98 -138 -294 -199 -555
      -200 -844 0 -229 36 -411 118 -604 l35 -81 -37 15 c-111 46 -276 187 -383 327
      -116 152 -198 302 -417 764 -132 279 -172 345 -361 595 -72 95 -131 176 -131
      180 0 4 87 -34 193 -86 105 -51 246 -113 313 -138z m8502 144 c-150 -183 -324
      -483 -468 -806 -98 -218 -202 -422 -262 -511 -69 -104 -191 -229 -327 -338
      -144 -114 -191 -149 -196 -145 -1 2 23 76 56 165 93 257 121 446 100 664 -16
      156 -34 242 -86 395 -39 119 -143 363 -167 393 -16 19 2 15 83 -18 116 -48
      185 -63 289 -62 169 1 399 54 637 148 120 47 323 146 378 183 17 12 31 21 33
      21 2 0 -30 -40 -70 -89z m-5830 -917 c315 -64 659 -419 880 -908 52 -115 137
      -354 129 -363 -2 -2 -62 60 -132 138 -183 201 -286 279 -435 329 -149 51 -234
      45 -467 -31 -134 -44 -170 -52 -238 -53 -66 0 -90 4 -136 26 -200 92 -255 332
      -134 584 34 71 117 173 159 196 36 20 250 96 274 97 13 0 58 -6 100 -15z
      m2923 -68 c116 -36 233 -123 285 -212 53 -90 67 -150 68 -289 1 -159 -15 -217
      -78 -280 -81 -80 -170 -84 -422 -19 -167 43 -187 47 -304 46 -102 0 -143 -5
      -224 -26 -229 -60 -406 -184 -496 -347 -16 -30 -30 -48 -30 -41 0 38 110 335
      170 457 143 293 313 498 520 627 68 43 95 53 190 74 41 9 82 21 90 26 20 12
      174 2 231 -16z m-354 -958 c131 -27 180 -33 290 -33 73 0 133 -3 133 -7 0 -3
      -24 -27 -52 -51 -103 -87 -230 -142 -434 -187 -80 -18 -148 -24 -359 -30 -232
      -6 -266 -9 -315 -28 -30 -12 -56 -22 -58 -22 -7 0 41 82 77 130 57 76 134 132
      286 207 l130 64 72 -5 c40 -3 143 -20 230 -38z m-2012 -2 c109 -35 195 -88
      269 -166 51 -54 126 -170 126 -194 0 -4 -17 2 -38 13 -79 41 -118 45 -397 46
      -291 2 -331 7 -453 61 -55 24 -336 194 -330 199 2 2 32 -2 68 -7 125 -18 382
      18 467 67 41 23 185 14 288 -19z m1545 -487 c397 -39 744 -175 948 -373 136
      -131 232 -304 441 -793 224 -524 294 -643 472 -798 50 -44 87 -81 81 -83 -5
      -1 -62 18 -126 42 -307 119 -590 304 -848 554 -128 125 -178 192 -338 457
      -214 353 -370 570 -532 740 -122 128 -181 173 -288 221 -47 21 -89 41 -95 46
      -10 9 118 3 285 -13z m-1254 -20 c-244 -84 -505 -387 -936 -1083 -106 -172
      -179 -266 -310 -396 -175 -176 -374 -316 -595 -421 -108 -51 -268 -112 -325
      -124 -34 -7 -33 -6 50 81 231 241 335 416 523 885 184 456 264 581 470 738
      211 159 433 255 706 306 146 27 201 33 326 34 l150 0 -59 -20z m1224 -236
      c192 -183 322 -427 380 -715 22 -107 22 -146 -10 -621 -11 -164 0 -383 25
      -527 8 -47 15 -87 15 -89 0 -13 -40 34 -75 89 -91 140 -179 342 -241 555 -45
      155 -61 257 -69 435 -7 170 -46 475 -81 643 -25 119 -70 261 -105 329 -11 21
      -19 40 -19 43 0 14 100 -65 180 -142z m-1273 70 c-93 -186 -134 -397 -152
      -778 -7 -163 -29 -330 -60 -461 -50 -210 -142 -459 -226 -608 -41 -72 -118
      -180 -124 -174 -2 2 3 30 11 63 24 97 28 326 10 556 -29 373 -19 562 41 754
      48 155 116 277 225 410 41 49 296 304 306 305 1 0 -13 -30 -31 -67z m1873
      -1008 c141 -208 279 -551 334 -830 22 -115 33 -208 56 -490 34 -398 58 -512
      152 -698 l50 -100 -44 32 c-203 149 -381 355 -478 556 -47 96 -101 257 -126
      380 -22 104 -26 414 -10 800 10 237 2 333 -34 443 l-19 57 35 -40 c20 -22 58
      -71 84 -110z m-2545 4 l-36 -124 12 -455 c12 -454 12 -455 -10 -565 -86 -428
      -308 -784 -592 -948 -25 -15 -48 -27 -52 -27 -3 0 6 20 19 44 14 25 38 80 54
      124 59 163 85 300 120 642 54 526 111 741 284 1075 62 120 223 371 233 362 1
      -2 -13 -59 -32 -128z m4021 -1300 c279 -134 460 -727 481 -1573 l6 -239 -129
      67 c-420 220 -672 421 -837 664 -156 232 -194 461 -112 695 58 168 160 282
      330 370 99 51 115 57 155 52 25 -3 73 -19 106 -36z m-5413 16 c104 -27 176
      -71 267 -164 136 -137 202 -292 204 -481 1 -114 -13 -177 -65 -289 -126 -271
      -358 -500 -731 -719 -114 -68 -309 -172 -321 -172 -11 0 -3 339 14 560 46 617
      195 1021 454 1231 67 55 85 58 178 34z"/>
      </g>
      </svg>
      `;
			const url = "data:image/svg+xml;base64," + window.btoa(SVG);

			Konva.Image.fromURL(url, (image) => {
				image.setAttrs({
					width: width,
					height: width,
					x: x - width / 2,
					y: y - width / 2,
				});
				group.add(image);
			});
		};

		const drawWithAccuracy = (
			drawCallback: (x: number, y: number) => Rect | void,
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
					konvaNode = drawCallback(x, y);

					konvaNode && group.add(konvaNode);
					x += ((pos.x - lastPoint.x) / maxDistance) * accuracy;
					y += ((pos.y - lastPoint.y) / maxDistance) * accuracy;
				}
			} else {
				konvaNode = pos && drawCallback(pos.x, pos.y);

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
					(x, y) => drawSVG(x, y, group),
					group,
					10,
					pos,
					lastPoint,
					config
				);
			} else {
				drawWithAccuracy(
					(x, y) => drawRect(x, y),
					group,
					2,
					pos,
					lastPoint,
					config
				);
			}
		};

		const drawLine = (layer: Layer, pos?: Vector2d | null) => {
			const line = new Konva.Line({
				stroke: getStrokeColor(
					brushConfig.current?.stroke,
					brushConfig.current?.mode
				),
				strokeWidth: brushConfig.current?.strokeWidth,
				globalCompositeOperation: getGlobalCompositeOperation(
					brushConfig.current.mode
				),
				lineCap: "round",
				lineJoin: "round",
				...(brushConfig.current.mode === BrushModesEnum.Neon && {
					shadowColor: getShadowColor(brushConfig.current.stroke),
					hasShadow: true,
					shadowBlur: 10,
					fillAfterStrokeEnabled: true,
					shadowForStrokeEnabled: true,
					shadowOffset: { x: 0, y: 0 },
				}),
				...(pos && { points: [pos.x, pos.y, pos.x, pos.y] }),
			});
			layer.add(line);
			return line;
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
					lastLine = drawLine(layer, pos);
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

		const colorDropper = (pos?: Vector2d | null) => {
			if (!isEyeDropping.current) {
				return;
			}
			pos && drawEyeDropperSVG(pos.x, pos.y);
		};

		const startDrawMode = () => {
			isDrawModeOn.current = true;
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

		const toggleEyeDropper = (status?: boolean) => {
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
				console.log(colorPickerSVG.current);
				return;
			}
			isEyeDropping.current = !isEyeDropping.current;
			if (isEyeDropping.current) {
				const x = width / 2;
				const y = height / 2;
				drawEyeDropperSVG(x, y);
			}
		};

		const drawEyeDropperSVG = (x: number, y: number) => {
			let colorPicker = getColorPickerSVG();
			colorPicker.group.hide();

			var imageData = stageRef.current
				?.toCanvas()
				.getContext("2d")
				?.getImageData(x, y, 1, 1).data;

			colorPicker.group.show();
			let layer = getDrawLayer();
			colorPicker.group.zIndex(layer.getChildren().length - 1);

			let rgbaColor =
				imageData &&
				"rgba(" +
					imageData[0] +
					"," +
					imageData[1] +
					"," +
					imageData[2] +
					",1)";

			if (rgbaColor) {
				colorPicker.group.setAttrs({ x: x - 24.875, y: y - 91.5 });
				colorPicker.path.setAttrs({ fill: rgbaColor });
				colorPicker.circle.setAttrs({ fill: rgbaColor });
				colorPicker.color = rgbaColor;
			}
		};

		const getColorPickerSVG = () => {
			let layer = getDrawLayer();

			if (
				colorPickerSVG.current &&
				colorPickerSVG.current.group &&
				colorPickerSVG.current.path &&
				colorPickerSVG.current.circle
			) {
				return colorPickerSVG.current;
			}

			const group = new Konva.Group({
				scaleX: 0.25,
				scaleY: 0.25,
				zIndex: 4,
			});
			layer.add(group);
			console.log(group.zIndex(), layer);
			group.zIndex(1);

			console.log(group.zIndex(), layer);

			const path1 = new Konva.Path({
				data: "M99.5001 253.812L23.7144 164.553C8.48697 146.605 0.0991211 123.791 0.0991211 100.313C0.0991211 45.5015 44.691 0.912392 99.5001 0.912392C154.309 0.912392 198.904 45.5043 198.904 100.313C198.904 123.791 190.516 146.605 175.286 164.553L99.5001 253.812Z",
				shadowColor: "black",
				hasShadow: true,
				shadowBlur: 10,
				zIndex: 4,
				shadowOffset: { x: 0, y: 0 },
			});
			path1.zIndex(1);
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

			colorPickerSVG.current = { group, path: path1, circle: circle2 };
			return colorPickerSVG.current;
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
			downloadLink.download = "stage_image.png"; // Specify the desired filename
			downloadLink.click();
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
					startDrawMode,
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
				}}
			>
				{children}
			</StoryContext.Provider>
		);
	}
);
