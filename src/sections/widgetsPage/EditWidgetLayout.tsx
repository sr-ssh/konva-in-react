import React, { FC, ReactNode, useState } from "react";
import styled from "@emotion/styled";
import HeaderSection from "./HeaderSection";
import { isIOS } from "../../utils/widgetUtils";

type ContainerStyleProps = { height: string };
const ContainerStyle = styled.div<ContainerStyleProps>(({ height }) => ({
	position: "relative",
	display: "grid",
	width: "100%",
	height: height,
	flexDirection: "column",
	overflow: "hidden",
}));

type EditWidgetLayoutType = {
	children: ReactNode;
	handleClose: () => void;
	containerRef?: React.RefObject<HTMLDivElement>;
};
const EditWidgetLayout: FC<EditWidgetLayoutType> = ({
	children,
	handleClose,
	containerRef,
}) => {
	const textRef = React.useRef<HTMLSpanElement>(null);
	const textPageRef = React.useRef<HTMLDivElement>(null);

	let [dynamicHeight, setDynamicHeight] = useState("100%");

	if (isIOS()) {
		console.log("This is an iOS device.");
		visualViewport?.addEventListener("resize", () => {
			const height = window.visualViewport?.height;
			if (
				containerRef?.current &&
				height &&
				height < window.innerHeight
			) {
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

	return (
		<div
			ref={textPageRef}
			style={{
				background: "rgba(0, 0, 0, .5)",
				border: "none",
				boxSizing: "border-box",
				height: dynamicHeight,
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
				<HeaderSection inputRef={textRef} handleClose={handleClose} />
				{children}
			</ContainerStyle>
		</div>
	);
};

export default EditWidgetLayout;
