import React, { FC } from "react";
import styled from "@emotion/styled";
import { getColorBrightness } from "../../utils/konvaUtils";
import { BrushColorEnum } from "../../@types/drawType";

export type PInputStylePropsType = {
	color: string;
	backgroundColor: string;
	borderRadius: number;
	hasOpacity: boolean;
};
const PInputStyle = styled.p<PInputStylePropsType>(
	({ color, backgroundColor, borderRadius, hasOpacity }) => ({
		outline: "none",
		minWidth: 10,
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
		maxWidth: "calc(100% - 88px)",
		justifySelf: "center",
		alignSelf: "center",
		padding: "4px 7px",
	})
);
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
		WebkitBoxDecorationBreak: "clone",
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
	textRef: React.RefObject<HTMLParagraphElement>;
	textStyle: PInputStylePropsType;
};
const TextSection: FC<AddTextProps> = ({ textRef, textStyle }) => {
	// let [textStyle, setTextStyle] = useState<PInputStylePropsType>({
	// 	color: BrushColorEnum.White,
	// 	backgroundColor: "transparent",
	// 	borderRadius: 0,
	// });

	// useEffect(() => {
	// 	pRef.current?.focus();
	// }, []);

	console.log(textRef);

	return (
		// <PInputStyle ref={textRef} contentEditable {...textStyle}></PInputStyle>
		<ContainerStyle>
			<SpanInputStyle ref={textRef} contentEditable {...textStyle}>
				sjdkfsdhfgkjsdgksdjfls lsdkjfkdsl fldkfjskldjf klsdjfksdlf{" "}
			</SpanInputStyle>
		</ContainerStyle>
	);
};

export default TextSection;
