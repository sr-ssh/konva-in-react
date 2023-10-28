import React, { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { getColorBrightness } from "../../utils/konvaUtils";
import { BrushColorEnum } from "../../@types/drawType";
import { isIOS } from "../../utils/widgetUtils";

export type PInputStylePropsType = {
	color: string;
	backgroundColor: string;
	borderRadius: number;
	hasOpacity: boolean;
};
const SpanInputStyle = styled.span<PInputStylePropsType>(
	({ color, backgroundColor, borderRadius, hasOpacity }) => ({
		outline: "none",
		// minWidth: 10,
		color:
			backgroundColor !== "transparent"
				? getColorBrightness(color)
					? BrushColorEnum.White
					: BrushColorEnum.Black
				: color,
		backgroundColor: `${backgroundColor}${
			hasOpacity && backgroundColor !== "transparent" ? "80" : ""
		}`,
		borderRadius,
		// maxWidth: "calc(100% - 88px)",
		// justifySelf: "center",
		// alignSelf: "center",
		padding: "4px 3px",
	})
);
const ContainerStyle = styled.div({
	minWidth: 10,
	maxWidth: "calc(100% - 88px)",
	justifySelf: "center",
	alignSelf: "center",
	padding: "4px 7px",
});

type AddTextProps = {
	textRef: React.RefObject<HTMLSpanElement>;
	containerRef: React.RefObject<HTMLDivElement>;
	textStyle: PInputStylePropsType;
	text: string;
};
const TextSection: FC<AddTextProps> = ({
	textRef,
	textStyle,
	text,
	containerRef,
}) => {
	// let [textStyle, setTextStyle] = useState<PInputStylePropsType>({
	// 	color: BrushColorEnum.White,
	// 	backgroundColor: "transparent",
	// 	borderRadius: 0,
	// });

	useEffect(() => {
		textRef.current?.focus();
	}, [textRef]);
	console.log("dynamicHeight", containerRef.current?.style.height);

	return (
		// <PInputStyle ref={textRef} contentEditable {...textStyle}></PInputStyle>
		<ContainerStyle onClick={(e) => e.stopPropagation()}>
			<SpanInputStyle
				ref={textRef}
				contentEditable
				{...textStyle}
				onFocus={() => {
					window.scrollTo(0, 0);
					document.body.scrollTop = 0;
				}}
				onBlur={() => {
					if (isIOS()) {
						console.log("This is an iOS device.");
						if (containerRef.current) {
							containerRef.current.style.height = "100%";
						}
					}
				}}
				suppressContentEditableWarning={true}
			>
				{text}
			</SpanInputStyle>
		</ContainerStyle>
	);
};

export default TextSection;
