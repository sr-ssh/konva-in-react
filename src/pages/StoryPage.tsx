import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import AddText from "./AddText";
import { useStoryContext } from "../hooks/useStoryContext";
import { BrushModesEnum } from "../@types/drawType";

const rangeHeight = 276;

const HeaderStyle = styled.div({
	position: "absolute",
	top: 0,
	width: "100%",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	zIndex: 2,
	color: "#fff",
	padding: "8px 8px 0",
	div: { display: "flex", gap: 12, alignItems: "center" },
});
const FooterStyle = styled.div({
	position: "absolute",
	bottom: 0,
	marginBottom: 20,
	display: "flex",
	justifyContent: "center",
	color: "#fff",
	zIndex: 2,
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
	WebkitAppearance:
		"none" /* Hides the slider so that custom slider can be made */,
	width: 280 + 28 /* Specific width is required for Firefox. */,
	background: "transparent" /* Otherwise white in Chrome */,
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

function StoryPage() {
	const [textView, setTextView] = React.useState(false);
	const [isDrawing, setIsDrawing] = React.useState(false);
	const [brush, setBrush] = React.useState<BrushModesEnum>(
		BrushModesEnum.Pen
	);

	const { startDraw, stopDraw, setBrushColor, setBrushMode } =
		useStoryContext();

	const closeAddText = (text: string) => {
		setTextView(false);
		// addText(text);
	};

	return (
		<>
			{textView ? <AddText close={closeAddText} /> : null}
			{isDrawing ? (
				<div>
					<HeaderStyle>
						<div>
							<span style={{ marginInline: 6 }}>Done</span>
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
									isActive={
										brush === BrushModesEnum.Highlighter
									}
									onClick={() => {
										setBrushMode(
											BrushModesEnum.Highlighter
										);
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

						<div style={{ marginInline: 6 }}>Undo</div>
					</HeaderStyle>
					<ColorsStyle>
						<ColorStyle
							onClick={() => setBrushColor("white")}
							color="white"
						/>
						<ColorStyle
							onClick={() => setBrushColor("black")}
							color="black"
						/>
						<ColorStyle
							onClick={() => setBrushColor("rgb(88, 195, 34)")}
							color="rgb(88, 195, 34)"
						/>
						<ColorStyle
							onClick={() => setBrushColor("rgb(0, 149, 246)")}
							color="rgb(0, 149, 246)"
						/>
						<ColorStyle
							onClick={() => setBrushColor("rgb(163, 7, 186)")}
							color="rgb(163, 7, 186)"
						/>
						<ColorStyle
							onClick={() => setBrushColor("rgb(209, 8, 105)")}
							color="rgb(209, 8, 105)"
						/>
						<ColorStyle
							onClick={() => setBrushColor("rgb(253, 141, 50)")}
							color="rgb(253, 141, 50)"
						/>
						<ColorStyle
							onClick={() => setBrushColor("rgb(253, 203, 92)")}
							color="rgb(253, 203, 92)"
						/>
					</ColorsStyle>
					<RangeBackgroundStyle>
						<div>
							<div></div>
						</div>
					</RangeBackgroundStyle>
					<RangeStyle type="range" />
				</div>
			) : (
				<div>
					<HeaderStyle>
						<div>
							<p>write</p>
							<p
								onClick={() => {
									setIsDrawing(true);
									startDraw();
								}}
							>
								draw
							</p>
							<p>stickers</p>
						</div>
						<div>X</div>
					</HeaderStyle>
					<FooterStyle>add to your story</FooterStyle>
				</div>
			)}
		</>
	);
}

export default StoryPage;
