import React, { FC, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useStoryContext } from "../../hooks/useStoryContext";
import { BrushColorEnum } from "../../@types/drawType";
import { getColorBrightness } from "../../utils/konvaUtils";

type ColorStyleProps = { position?: any };
const ColorsStyle = styled.div<ColorStyleProps>((props) => ({
	position: props.position ? props.position : "absolute",
	bottom: 0,
	alignItems: "center",
	zIndex: 2,
	color: "#fff",
	padding: "8px 8px 10px",
	paddingInlineEnd: 41,
	direction: "ltr",
	overflowX: "auto",
	whiteSpace: "nowrap",
	width: "-webkit-fill-available",
	background: "linear-gradient(to top, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0))",
	"::-webkit-scrollbar": {
		display: "none",
	},
	msOverflowStyle: "none",
	scrollbarWidth: "none",
}));
const ColorStyle = styled.div(({ color }) => ({
	backgroundColor: color,
	borderRadius: "50%",
	height: 26,
	margin: "6px",
	padding: 0,
	width: 26,
	border: "1px solid #fff",
	display: "inline-block",
	zIndex: 3,
}));
const ColorPicker = styled(ColorStyle)({
	position: "absolute",
	bottom: 13,
	right: 0,
	width: 31,
	height: 31,
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
});

type ColorsSectionPropsType = {
	position?: string;
	getColor?: (color: string) => void;
};
const ColorsSection: FC<ColorsSectionPropsType> = ({ position, getColor }) => {
	let colorRef = useRef<string>(BrushColorEnum.White);

	const {
		setBrushColor,
		toggleEyeDropper,
		registerDrawContainerSetColor,
		getBrushColor,
	} = useStoryContext();

	const [color, setColor] = React.useState<string>(getBrushColor);

	const brushColorHandler = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		color: BrushColorEnum | string
	) => {
		e.stopPropagation();
		setBrushColor(color);
		setColor(color);
		getColor?.(color);
		colorRef.current = color;
	};

	useEffect(() => {
		registerDrawContainerSetColor((newColor) => {
			console.log("new color", newColor);
			setColor(newColor);
			colorRef.current = newColor;
		});
	}, [registerDrawContainerSetColor]);

	useEffect(() => {
		setColor(getBrushColor);
		console.log("getBrushColor", getBrushColor);
	}, [getBrushColor]);

	console.log("color", color, colorRef.current);

	return (
		<>
			<ColorPicker
				color={color}
				onClick={(e) => {
					e.stopPropagation();
					toggleEyeDropper();
				}}
			>
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
			<ColorsStyle position={position}>
				{Object.values(BrushColorEnum).map((item) => (
					<ColorStyle
						key={item}
						onClick={(e) => brushColorHandler(e, item)}
						color={item}
					/>
				))}
			</ColorsStyle>
		</>
	);
};

export default ColorsSection;
