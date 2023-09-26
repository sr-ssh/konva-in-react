import React, { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { useStoryContext } from "../../hooks/useStoryContext";
import { BrushColorEnum } from "../../@types/drawType";
import { getColorBrightness } from "../../utils/konvaUtils";

const ColorsStyle = styled.div({
	position: "absolute",
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

const ColorsSection: FC = () => {
	const [color, setColor] = React.useState<BrushColorEnum | string>(
		BrushColorEnum.White
	);

	const { setBrushColor, toggleEyeDropper, registerDrawContainerSetColor } =
		useStoryContext();

	const brushColorHandler = (color: BrushColorEnum | string) => {
		setBrushColor(color);
		setColor(color);
	};

	useEffect(() => {
		registerDrawContainerSetColor(setColor);
	}, [registerDrawContainerSetColor]);

	return (
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
	);
};

export default ColorsSection;
