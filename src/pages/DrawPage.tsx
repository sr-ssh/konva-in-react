import React, { FC, memo, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useStoryContext } from "../hooks/useStoryContext";
import {
	BrushColorEnum,
	BrushModesEnum,
	OneToTwentyType,
} from "../@types/drawType";
import { HeaderStyle } from "../components/Header";
import { getColorBrightness } from "../utils/draw";

const BrushSection = styled.div({
	display: "flex",
	gap: 0,
});
const BrushStyle = styled.div({
	backgroundImage: "url(/assets/images/icons.png)",
	backgroundRepeat: "no-repeat",
	height: 44,
	width: 44,
	backgroundSize: "179px 179px",
});
type EraserStyleProps = {
	isActive: boolean;
};
const EraserStyle = styled(BrushStyle)<EraserStyleProps>((props) => ({
	backgroundPosition: props.isActive ? "-90px 0" : "-90px -45px",
}));
const NeonBrushStyle = styled(BrushStyle)<EraserStyleProps>((props) => ({
	backgroundPosition: props.isActive ? "0 -90px" : "-45px -90px",
}));
const HighlighterBrushStyle = styled(BrushStyle)<EraserStyleProps>((props) => ({
	backgroundPosition: props.isActive ? "0 0" : "-45px 0",
}));
const PenStyle = styled(BrushStyle)<EraserStyleProps>((props) => ({
	backgroundPosition: props.isActive ? "-90px -90px" : "-135px 0",
}));
const HeartStyle = styled.div<EraserStyleProps>((props) => ({
	backgroundImage: props.isActive
		? "url(/assets/images/heart_filled.png)"
		: "url(/assets/images/heart_outline.png)",
	backgroundRepeat: "no-repeat",
	height: 44,
	width: 44,
	backgroundSize: 44,
}));
const ColorsStyle = styled.div({
	position: "absolute",
	bottom: 10,
	alignItems: "center",
	zIndex: 2,
	color: "#fff",
	padding: "8px 8px 0",
	paddingInlineEnd: 41,
	direction: "ltr",
	overflowX: "auto",
	whiteSpace: "nowrap",
	width: "-webkit-fill-available",
	"::-webkit-scrollbar": {
		display: "none",
	},
	"-ms-overflow-style": "none",
	scrollbarWidth: "none",
});
const ColorStyle = styled.div(({ color }) => ({
	backgroundColor: color,
	borderRadius: "50%",
	height: 26,
	margin: "6px",
	padding: 0,
	width: 26,
	border: "1px solid #fff",
	display: "inline-block",
}));
const ColorPicker = styled(ColorStyle)({
	position: "fixed",
	bottom: 13,
	right: 0,
	width: 31,
	height: 31,
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
});
const RangeBackgroundStyle = styled.div({
	left: "14px",
	pointerEvents: "none",
	position: "absolute",
	top: "50%",
	transform: "translate(0%, -50%)",
	zIndex: 2,
	div: {
		top: window.innerHeight / 2,
		left: -window.innerWidth / 2 + 20,
		alignItems: "stretch",
		border: 0,
		borderLeft: "14px solid transparent",
		borderRight: "14px solid transparent",
		borderTop: "280px solid rgba(181, 181, 181, .3)",
		boxSizing: "border-box",
		display: "flex",
		flexDirection: "column",
		flexShrink: 0,
		font: "inherit",
		fontSize: "100%",
		height: 0,
		margin: 0,
		padding: 0,
		verticalAlign: "baseline",
		width: 0,
		zIndex: 3,
		div: {
			alignItems: "stretch",
			border: "0",
			borderLeft: "12px solid transparent",
			borderRight: "12px solid transparent",
			borderTop: "276px solid rgba(255, 255, 255, 0.425)",
			boxSizing: "border-box",
			display: "flex",
			flexDirection: "column",
			flexShrink: 0,
			font: "inherit",
			fontSize: "100%",
			height: 0,
			left: "-12px",
			margin: 0,
			padding: 0,
			verticalAlign: "baseline",
			width: 0,
			zIndex: 3,
			position: "absolute",
			top: 2,
			right: 2,
		},
	},
});
const RangeStyle = styled.input({
	WebkitAppearance: "none",
	width: 280 + 28,
	background: "transparent",
	position: "absolute",
	transform: "rotate(-90deg)",
	top: (window.innerHeight - 28) / 2,
	left: -128,
	zIndex: 2,
	height: 28,
	"&::-webkit-slider-runnable-track": {
		width: 280,
		height: 28,
		cursor: "pointer",
	},
	"&::-webkit-slider-thumb": {
		WebkitAppearance: "none",
		border: "1px solid rgb(22, 22, 22)",
		height: 28,
		width: 28,
		borderRadius: "50%",
		background: "rgb(255, 255, 255)",
		cursor: "pointer",
		// boxShadow: "1px 1px 1px #000000, 0px 0px 1px #0d0d0d",
	},
});

// TODO add sections

type DrawPageTypes = {
	setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
};

const DrawPage: FC<DrawPageTypes> = ({ setIsDrawing }) => {
	const [brush, setBrush] = React.useState<BrushModesEnum>(
		BrushModesEnum.Pen
	);
	const [color, setColor] = React.useState<BrushColorEnum | string>(
		BrushColorEnum.White
	);

	const drawPageRef = useRef(null);

	const {
		stopDrawMode,
		setBrushColor,
		setBrushMode,
		undoDraw,
		setBrushStrokeWidth,
		isDrawing,
		registerDrawContainer,
		toggleEyeDropper,
	} = useStoryContext();

	const brushColorHandler = (color: BrushColorEnum | string) => {
		setBrushColor(color);
		setColor(color);
	};

	useEffect(() => {
		drawPageRef.current &&
			registerDrawContainer(drawPageRef.current, setColor);
	}, [drawPageRef, registerDrawContainer]);

	if (isDrawing) {
		return <></>;
	}

	return (
		<div ref={drawPageRef}>
			<HeaderStyle>
				<div
					style={{ marginInline: 6 }}
					onClick={() => {
						stopDrawMode();
						setIsDrawing(false);
					}}
				>
					<img
						src="assets/images/check.png"
						alt="check"
						width={39}
						height={39}
					/>
				</div>
				<div>
					<BrushSection>
						<HeartStyle
							isActive={brush === BrushModesEnum.Heart}
							onClick={(e) => {
								setBrushMode(BrushModesEnum.Heart);
								setBrush(BrushModesEnum.Heart);
							}}
						/>
						<EraserStyle
							isActive={brush === BrushModesEnum.Eraser}
							onClick={(e) => {
								setBrushMode(BrushModesEnum.Eraser);
								setBrush(BrushModesEnum.Eraser);
							}}
						/>
						<NeonBrushStyle
							isActive={brush === BrushModesEnum.Neon}
							onClick={() => {
								setBrushMode(BrushModesEnum.Neon);
								setBrush(BrushModesEnum.Neon);
							}}
						/>
						<HighlighterBrushStyle
							isActive={brush === BrushModesEnum.Highlighter}
							onClick={() => {
								setBrushMode(BrushModesEnum.Highlighter);
								setBrush(BrushModesEnum.Highlighter);
							}}
						/>
						<PenStyle
							isActive={brush === BrushModesEnum.Pen}
							onClick={() => {
								setBrushMode(BrushModesEnum.Pen);
								setBrush(BrushModesEnum.Pen);
							}}
						/>
					</BrushSection>
				</div>
				<div style={{ marginInline: 6 }} onClick={() => undoDraw()}>
					<img
						src="assets/images/undo.png"
						alt="undo"
						width={39}
						height={39}
					/>
				</div>
			</HeaderStyle>
			<ColorsStyle>
				<ColorPicker color={color} onClick={() => toggleEyeDropper()}>
					<img
						src="assets/images/eyedropper.png"
						alt="eyedropper"
						width={31}
						height={31}
						style={{
							filter: getColorBrightness(color)
								? "invert(1)"
								: "none",
						}}
					/>
				</ColorPicker>
				{Object.values(BrushColorEnum).map((item) => (
					<ColorStyle
						onClick={() => brushColorHandler(item)}
						color={item}
					/>
				))}
			</ColorsStyle>
			<RangeBackgroundStyle>
				<div>
					<div></div>
				</div>
			</RangeBackgroundStyle>
			<RangeStyle
				dir="ltr"
				type="range"
				min={1}
				max={20}
				defaultValue={10}
				onChange={(e) =>
					setBrushStrokeWidth(
						parseInt(e.target.value) as OneToTwentyType
					)
				}
			/>
		</div>
	);
};

export default memo(DrawPage);
