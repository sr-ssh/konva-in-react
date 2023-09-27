import { FC, useEffect, useState } from "react";
import { fontFamilies } from "../../sections/textPage/HeaderSection";
import styled from "@emotion/styled";
import { getColorBrightness } from "../../utils/konvaUtils";
import { PInputStylePropsType } from "../../sections/textPage/TextSection";
import { BrushColorEnum } from "../../@types/drawType";

const FontFamilyStyle = styled.div({
	border: "1px solid #fff",
	color: "#fff",
	padding: "2px 4px",
	borderRadius: 15,
	fontSize: 13,
	fontWeight: "bold",
	justifySelf: "center",
});

const FontPropsStyle = styled.div({
	display: "flex",
	justifySelf: "end",
});

const alignArray = ["center", "right", "left"];
const backgroundArray = ["off", "on", "frost"];
const emphasisArray = ["outline", "fill"];

type FontFamiliesPropsType = {
	inputRef: React.RefObject<HTMLParagraphElement>;
	setTextStyle: React.Dispatch<React.SetStateAction<PInputStylePropsType>>;
	textStyle: PInputStylePropsType;
};
export const FontFamilies: FC<FontFamiliesPropsType> = ({
	inputRef,
	setTextStyle,
	textStyle,
}) => {
	let [index, setIndex] = useState(0);
	let [align, setAlign] = useState(0);
	let [background, setBackground] = useState(0);
	let [emphasis, setEmphasis] = useState(0);

	const fontFamiliesArray = Object.keys(fontFamilies);

	const handleFontFamilyClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		e.preventDefault(); // Prevent the default behavior (focus loss)
		setIndex((index + 1) % fontFamiliesArray.length);
	};

	useEffect(() => {
		inputRef.current?.focus(); // Focus the <p> element
	}, [index, align, background, emphasis, inputRef]);

	useEffect(() => {
		if (inputRef.current)
			inputRef.current.style.textAlign = alignArray[align];
	}, [align, inputRef]);

	useEffect(() => {
		const input = inputRef.current;
		if (input) {
			switch (background) {
				case 0:
					setTextStyle({
						...textStyle,
						backgroundColor: "transparent",
						hasOpacity: false,
					});
					break;

				case 1:
					setTextStyle({
						...textStyle,
						backgroundColor: textStyle.color,
						// color: textStyle.color,
						borderRadius: 4,
						hasOpacity: false,
					});
					break;

				case 2:
					setTextStyle({
						...textStyle,
						backgroundColor: textStyle.color,
						// color: getColorBrightness(textStyle.color)
						// 	? BrushColorEnum.White
						// 	: BrushColorEnum.Black,
						hasOpacity: true,
						borderRadius: 4,
					});
					break;

				default:
					break;
			}
		}
	}, [background, inputRef]);

	return (
		<>
			<FontFamilyStyle onClick={(e) => handleFontFamilyClick(e)}>
				<span>{fontFamiliesArray[index]}</span>
			</FontFamilyStyle>
			<FontPropsStyle style={{ marginInline: 6 }} onClick={() => {}}>
				{Object.values(fontFamilies)[index].hasEmphasis && (
					<img
						onClick={() =>
							setEmphasis((emphasis + 1) % emphasisArray.length)
						}
						src={`assets/images/text_emphasis_${emphasisArray[emphasis]}.png`}
						alt="emphasis"
						width={44}
						height={44}
					/>
				)}
				{Object.values(fontFamilies)[index].hasBackground && (
					<img
						onClick={() =>
							setBackground(
								(background + 1) % backgroundArray.length
							)
						}
						src={`assets/images/text_bg_${backgroundArray[background]}.png`}
						alt="background"
						width={44}
						height={44}
					/>
				)}
				{Object.values(fontFamilies)[index].hasAlign && (
					<img
						onClick={() =>
							setAlign((align + 1) % alignArray.length)
						}
						src={`assets/images/align_${alignArray[align]}.png`}
						alt="align"
						width={44}
						height={44}
					/>
				)}
			</FontPropsStyle>
		</>
	);
};
