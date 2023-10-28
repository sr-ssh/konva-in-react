import React, { FC, useEffect, useRef, useState } from "react";
import ColorsSection from "../sections/drawPage/ColorsSection";
import styled from "@emotion/styled";
import HeaderSection from "../sections/textPage/HeaderSection";
import { BrushColorEnum } from "../@types/drawType";
import TextSection, {
	PInputStylePropsType,
} from "../sections/textPage/TextSection";
import { usePageMangerContext } from "../hooks/usePageMangerContext";
import {
	PageAttrs,
	PageTypeEnum,
} from "../contexts/PageManagerContextProvider";
import { isIOS } from "../utils/widgetUtils";

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

type AddTextProps = {
	close: (text?: string, color?: string) => void;
};

const TextPage: FC<AddTextProps> = ({ close }) => {
	let [dynamicHeight, setDynamicHeight] = useState("100%");
	let [colorsBottom, setColorsBottom] = useState(0);
	let [show, setShow] = useState(false);
	let [text, setText] = useState("");
	let [textStyle, setTextStyle] = useState<PInputStylePropsType>({
		color: BrushColorEnum.White,
		backgroundColor: "transparent",
		borderRadius: 0,
		hasOpacity: false,
	});

	const containerRef = useRef<HTMLDivElement>(null);
	const textRef = React.useRef<HTMLSpanElement>(null);
	const { registerPage } = usePageMangerContext();

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

	const listen = (showPage: boolean) => {
		setShow(showPage);
	};

	useEffect(() => {
		const handleText = ({ text, color }: Partial<PageAttrs>) => {
			if (text && color) {
				setText(text);
				setTextStyle({ ...textStyle, color: color });
				textRef.current?.focus();
			}
		};
		textRef.current?.focus();
		registerPage(PageTypeEnum.Text, listen, handleText);
	}, [registerPage, textStyle]);

	if (!show) {
		return <></>;
	}

	return (
		<div
			onClick={() => {
				close(textRef.current?.innerText, textStyle.color);
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
