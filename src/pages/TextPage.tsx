import React, { FC, useEffect, useState } from "react";
import ColorsSection from "../sections/drawPage/ColorsSection";
import styled from "@emotion/styled";
import RangeInputSection from "../sections/drawPage/RangeInputSection";
import HeaderSection from "../sections/textPage/HeaderSection";

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

const MiddleDiv = styled.div({
	flex: "auto",
});

const TextPage: FC<AddTextProps> = ({ close }) => {
	const pRef = React.useRef<HTMLParagraphElement>(null);
	let [dynamicHeight, setDynamicHeight] = useState("100%");

	window.addEventListener("resize", () => {
		const height = window.visualViewport?.height;
		setDynamicHeight(height ? height + "px" : "100%");
	});

	useEffect(() => {
		pRef.current?.focus();
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
				<HeaderSection inputRef={pRef} />
				<p
					ref={pRef}
					contentEditable
					style={{
						outline: "none",
						width: "100%",
						color: "white",
						justifySelf: "center",
						alignSelf: "center",
					}}
				></p>
				<RangeInputSection />
				<ColorsSection position="absolute" />
			</ContainerStyle>
		</div>
	);
};

export default TextPage;
