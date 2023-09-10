import React, { FC, memo } from "react";
import styled from "@emotion/styled";
import { useStoryContext } from "../hooks/useStoryContext";
import {
	BrushColorEnum,
	BrushModesEnum,
	OneToTwentyType,
} from "../@types/drawType";
import { HeaderStyle } from "../components/Header";

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
const ColorsStyle = styled.div({
	position: "absolute",
	top: 70,
	width: "100%",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	zIndex: 2,
	color: "#fff",
	padding: "8px 8px 0",
});
const ColorStyle = styled.div(({ color }) => ({
	backgroundColor: color,
	borderRadius: "50%",
	height: 26,
	margin: "6px 10px",
	padding: 0,
	width: 26,
}));
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
		borderTop: "280px solid rgba(168, 168, 168, .3)",
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
			borderTop: "276px solid rgba(18, 18, 18, .65)",
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
		border: "1px solid rgb(239, 239, 239)",
		height: 28,
		width: 28,
		borderRadius: "50%",
		background: "rgb(18, 18, 18)",
		cursor: "pointer",
		boxShadow: "1px 1px 1px #000000, 0px 0px 1px #0d0d0d",
	},
});

type DrawPageTypes = {
	setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
};

const DrawPage: FC<DrawPageTypes> = ({ setIsDrawing }) => {
	const [brush, setBrush] = React.useState<BrushModesEnum>(
		BrushModesEnum.Pen
	);

	const {
		stopDraw,
		setBrushColor,
		setBrushMode,
		undoDraw,
		setBrushStrokeWidth,
	} = useStoryContext();

	return (
		<div>
			<HeaderStyle>
				<div>
					<span
						style={{ marginInline: 6 }}
						onClick={() => {
							stopDraw();
							setIsDrawing(false);
						}}
					>
						Done
					</span>
					<div>
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
					</div>
				</div>

				<div style={{ marginInline: 6 }} onClick={() => undoDraw()}>
					Undo
				</div>
			</HeaderStyle>
			<ColorsStyle>
				<ColorStyle
					onClick={() => setBrushColor(BrushColorEnum.White)}
					color={BrushColorEnum.White}
				/>
				<ColorStyle
					onClick={() => setBrushColor(BrushColorEnum.Black)}
					color={BrushColorEnum.Black}
				/>
				<ColorStyle
					onClick={() => setBrushColor(BrushColorEnum.Green)}
					color={BrushColorEnum.Green}
				/>
				<ColorStyle
					onClick={() => setBrushColor(BrushColorEnum.Blue)}
					color={BrushColorEnum.Blue}
				/>
				<ColorStyle
					onClick={() => setBrushColor(BrushColorEnum.Purple)}
					color={BrushColorEnum.Purple}
				/>
				<ColorStyle
					onClick={() => setBrushColor(BrushColorEnum.Pink)}
					color={BrushColorEnum.Pink}
				/>
				<ColorStyle
					onClick={() => setBrushColor(BrushColorEnum.Orange)}
					color={BrushColorEnum.Orange}
				/>
				<ColorStyle
					onClick={() => setBrushColor(BrushColorEnum.Yellow)}
					color={BrushColorEnum.Yellow}
				/>
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
