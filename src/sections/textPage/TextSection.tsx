import React, { FC, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { getColorBrightness } from "../../utils/konvaUtils";
import { BrushColorEnum } from "../../@types/drawType";
import { isIOS } from "../../utils/widgetUtils";
import useHeightResetOnInput from "../../hooks/useHeightResetOnInput";

export type PInputStylePropsType = {
	color: string;
	backgroundColor: string;
	borderRadius: number;
	hasOpacity: boolean;
};
const SpanInputStyle = styled.span<PInputStylePropsType>(
	({ color, backgroundColor, borderRadius, hasOpacity }) => ({
		outline: "none",
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
	const { handleBlur, handleFocus } = useHeightResetOnInput();

	useEffect(() => {
		textRef.current?.focus();
	}, [textRef]);

	return (
		<ContainerStyle onClick={(e) => e.stopPropagation()}>
			<SpanInputStyle
				ref={textRef}
				contentEditable
				{...textStyle}
				onFocus={handleFocus}
				onBlur={() => handleBlur(containerRef)}
				suppressContentEditableWarning={true}
				dir="auto"
			>
				{text}
			</SpanInputStyle>
		</ContainerStyle>
	);
};

export default TextSection;
