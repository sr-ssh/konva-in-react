import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { useStoryContext } from "../../hooks/useStoryContext";
import { OneToTwentyType } from "../../@types/drawType";

type RangePropsType = { height: number };
const RangeBackgroundStyle = styled.div<RangePropsType>((props) => ({
	left: "14px",
	pointerEvents: "none",
	position: "absolute",
	top: props.height / 2,
	transform: "translate(0%, -50%)",
	zIndex: 2,
	div: {
		top: (window.visualViewport?.height || window.innerHeight) / 2,
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
}));
const RangeStyle = styled.input<RangePropsType>((props) => ({
	WebkitAppearance: "none",
	width: 280 + 28,
	background: "transparent",
	position: "absolute",
	transform: "rotate(-90deg)",
	top: (props.height - 28) / 2,
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
}));

const RangeInputSection: FC = () => {
	let [dynamicHeight, setDynamicHeight] = useState(window.innerHeight);

	const { setBrushStrokeWidth } = useStoryContext();

	window.addEventListener("resize", () => {
		const height = window.visualViewport?.height;
		setDynamicHeight(height ? height : window.innerHeight);
	});

	return (
		<>
			<RangeBackgroundStyle height={dynamicHeight}>
				<div>
					<div></div>
				</div>
			</RangeBackgroundStyle>
			<RangeStyle
				height={dynamicHeight}
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
