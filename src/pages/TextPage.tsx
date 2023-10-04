import React, { FC, useEffect, useState } from "react";
import ColorsSection from "../sections/drawPage/ColorsSection";
import styled from "@emotion/styled";
import HeaderSection from "../sections/textPage/HeaderSection";
import { BrushColorEnum } from "../@types/drawType";
import TextSection, {
	PInputStylePropsType,
} from "../sections/textPage/TextSection";
import { useStoryContext } from "../hooks/useStoryContext";
import { usePageMangerContext } from "../hooks/usePageMangerContext";

type ContainerStyleProps = { height: string };
const ContainerStyle = styled.div<ContainerStyleProps>(({ height }) => ({
	position: "relative",
	display: "grid",
	width: "100%",
	height: height,
	flexDirection: "column",
	overflow: "hidden",
}));

type AddTextProps = {
	close: (text?: string, color?: string) => void;
};

const TextPage: FC<AddTextProps> = ({ close }) => {
	const textRef = React.useRef<HTMLSpanElement>(null);
	const textPageRef = React.useRef<HTMLDivElement>(null);

	let [dynamicHeight, setDynamicHeight] = useState("100%");
	let [show, setShow] = useState(false);
	let [text, setText] = useState("");
	let [textStyle, setTextStyle] = useState<PInputStylePropsType>({
		color: BrushColorEnum.White,
		backgroundColor: "transparent",
		borderRadius: 0,
		hasOpacity: false,
	});

	const { registerTextContainer } = useStoryContext();
	const { registerTextPage } = usePageMangerContext();

	window.addEventListener("resize", () => {
		const height = window.visualViewport?.height;
		setDynamicHeight(height ? height + "px" : "100%");
		document.body.style.height = height + "px";
	});

	const listen = (showPage: boolean) => {
		setShow(showPage);
	};

	useEffect(() => {
		const handleText = (text: string, color: string) => {
			console.log(color);
			setText(text);
			setTextStyle({ ...textStyle, color: color });
			textRef.current?.focus();
		};
		textRef.current?.focus();
		registerTextPage(listen, handleText);
		if (textPageRef.current) {
			registerTextContainer(textPageRef.current, handleText);
		}
	}, [registerTextContainer, registerTextPage, textPageRef, textStyle]);

	// useEffect(() => {
	// 	textRef.current?.focus();
	// }, [textRef.current]);

	if (!show) {
		return <></>;
	}

	return (
		<div
			ref={textPageRef}
			onClick={() => {
				close(textRef.current?.innerText, textStyle.color);
			}}
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
				<TextSection
					textRef={textRef}
					textStyle={textStyle}
					text={text}
				/>
				{/* <RangeInputSection /> */}
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
