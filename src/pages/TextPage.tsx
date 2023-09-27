import React, { FC, useEffect, useState } from "react";
import ColorsSection from "../sections/drawPage/ColorsSection";
import styled from "@emotion/styled";
import RangeInputSection from "../sections/drawPage/RangeInputSection";
import HeaderSection from "../sections/textPage/HeaderSection";
import { BrushColorEnum } from "../@types/drawType";
import TextSection, {
	PInputStylePropsType,
} from "../sections/textPage/TextSection";

type AddTextProps = {
	close: (text: string) => void;
};

type ContainerStyleProps = { height: string };
const ContainerStyle = styled.div<ContainerStyleProps>(({ height }) => ({
	position: "relative",
	display: "grid",
	width: "100%",
	height: height,
	flexDirection: "column",
	overflow: "hidden",
}));
const TextPage: FC<AddTextProps> = ({ close }) => {
	const textRef = React.useRef<HTMLParagraphElement>(null);
	let [dynamicHeight, setDynamicHeight] = useState("100%");
	let [textStyle, setTextStyle] = useState<PInputStylePropsType>({
		color: BrushColorEnum.White,
		backgroundColor: "transparent",
		borderRadius: 0,
		hasOpacity: false,
	});

	window.addEventListener("resize", () => {
		const height = window.visualViewport?.height;
		setDynamicHeight(height ? height + "px" : "100%");
	});

	useEffect(() => {
		textRef.current?.focus();
	}, []);

	return (
		<div
			// onClick={() =>
			// 	pRef.current?.innerText && close(pRef.current?.innerText)
			// }
			style={{
				background: "rgba(0, 0, 0, .5)",
				border: "none",
				boxSizing: "border-box",
				height: "100%",
				inset: 0,
				overflow: "hidden",
				position: "absolute",
				top: 0,
				verticalAlign: "baseline",
				zIndex: 3,
				outline: "none",
			}}
		>
			<ContainerStyle height={dynamicHeight}>
				<HeaderSection
					inputRef={textRef}
					setTextStyle={setTextStyle}
					textStyle={textStyle}
				/>
				<TextSection textRef={textRef} textStyle={textStyle} />
				<RangeInputSection />
				<ColorsSection
					position="absolute"
					getColor={(color: string) => {
						setTextStyle({
							...textStyle,
							color,
							...(textStyle.backgroundColor !== "transparent" && {
								backgroundColor: color,
							}),
						});
						textRef.current?.focus();
					}}
				/>
			</ContainerStyle>
		</div>
	);
};

export default TextPage;
