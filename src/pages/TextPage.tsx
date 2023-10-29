import React, { useEffect, useRef, useState } from "react";
import ColorsSection from "../sections/drawPage/ColorsSection";
import styled from "@emotion/styled";
import HeaderSection from "../sections/textPage/HeaderSection";
import { BrushColorEnum } from "../@types/drawType";
import TextSection, {
	PInputStylePropsType,
} from "../sections/textPage/TextSection";
import {
	PageAttrs,
	PageTypeEnum,
} from "../contexts/PageManagerContextProvider";
import { isIOS } from "../utils/widgetUtils";
import { useStoryContext } from "../hooks/useStoryContext";
import usePageWithShow from "../hooks/usePageWithShow";

type ContainerStyleProps = { height: string };
const ContainerStyle = styled.div<ContainerStyleProps>(({ height }) => ({
	position: "relative",
	display: "grid",
	width: "100%",
	height: height,
	flexDirection: "column",
	overflow: "hidden",
	transition: "height .3s ease",
}));

const TextPage = () => {
	let [dynamicHeight, setDynamicHeight] = useState("100%");
	let [text, setText] = useState("");
	let [textStyle, setTextStyle] = useState<PInputStylePropsType>({
		color: BrushColorEnum.White,
		backgroundColor: "transparent",
		borderRadius: 0,
		hasOpacity: false,
	});

	const containerRef = useRef<HTMLDivElement>(null);
	const textRef = React.useRef<HTMLSpanElement>(null);

	const { addText } = useStoryContext();

	if (isIOS()) {
		visualViewport?.addEventListener("resize", () => {
			const height = window.visualViewport?.height;
			if (containerRef.current && height && height < window.innerHeight) {
				containerRef.current.style.height = height + "px";
			}
			window.scrollTo(0, 0);
			document.body.scrollTop = 0;
			document.body.style.height = height + "px";
		});
	} else {
		window.addEventListener("resize", () => {
			const height = window.visualViewport?.height;
			setDynamicHeight(height ? height + "px" : "100%");
			document.body.style.height = height + "px";
		});
	}

	const handlePage = ({ text, color }: Partial<PageAttrs>) => {
		if (text && color) {
			setText(text);
			setTextStyle({ ...textStyle, color: color });
			textRef.current?.focus();
		}
	};

	useEffect(() => {
		textRef.current?.focus();
	}, [textStyle]);

	const show = usePageWithShow(PageTypeEnum.Text, false, handlePage);

	if (!show) {
		return <></>;
	}

	return (
		<div
			onClick={() => {
				addText(textRef.current?.innerText, textStyle.color);
			}}
			style={{
				background: "rgba(0, 0, 0, .5)",
				border: "none",
				boxSizing: "border-box",
				// height: dynamicHeight,
				touchAction: "none",
				inset: 0,
				overflow: "hidden",
				position: "absolute",
				top: 0,
				verticalAlign: "baseline",
				zIndex: 3,
				outline: "none",
			}}
		>
			<ContainerStyle ref={containerRef} height={dynamicHeight}>
				<HeaderSection
					inputRef={textRef}
					setTextStyle={setTextStyle}
					textStyle={textStyle}
				/>
				<TextSection
					textRef={textRef}
					containerRef={containerRef}
					textStyle={textStyle}
					text={text}
				/>
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
