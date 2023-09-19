import React, { FC, memo } from "react";
import styled from "@emotion/styled";
import { useStoryContext } from "../../hooks/useStoryContext";
import { OneToTwentyType } from "../../@types/drawType";

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

const RangeInputSection: FC = () => {
	const { setBrushStrokeWidth } = useStoryContext();

	return (
		<>
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
		</>
	);
};

export default RangeInputSection;
