import React, { FC, memo } from "react";
import styled from "@emotion/styled";
import { FontFamiliesObjectType } from "../../@types/textType";
import { PInputStylePropsType } from "./TextSection";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import { StoryContextModes } from "../../contexts/StoryContextProvider";

const ContainerStyle = styled.div({
	position: "absolute",
	top: 0,
	width: "100%",
	zIndex: 2,
	color: "#fff",
	padding: "8px 8px 0",
	background:
		"linear-gradient(to bottom, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0))",
	display: "grid",
	gridTemplateColumns: "repeat(3, 1fr)",
	alignItems: "center",
});

export const fontFamilies: FontFamiliesObjectType = {
	classic: { hasAlign: true, hasBackground: true },
	modern: {},
	neon: {},
	typewriter: { hasAlign: true, hasEmphasis: true },
	strong: { hasEmphasis: true },
};

type HeaderSectionPropsType = {
	inputRef: React.RefObject<HTMLSpanElement>;
	setTextStyle: React.Dispatch<React.SetStateAction<PInputStylePropsType>>;
	textStyle: PInputStylePropsType;
};
const HeaderSection: FC<HeaderSectionPropsType> = ({
	inputRef,
	setTextStyle,
	textStyle,
}) => {
	const { setMode } = usePageMangerContext();

	return (
		<ContainerStyle>
			<div
				style={{ marginInline: 6, justifySelf: "start" }}
				onClick={() => {
					setMode(StoryContextModes.IsDefault, true);
					inputRef.current?.focus();
				}}
			>
				<img
					src="assets/images/check.png"
					alt="check"
					width={39}
					height={39}
				/>
			</div>
			{/* <FontFamilies
				inputRef={inputRef}
				setTextStyle={setTextStyle}
				textStyle={textStyle}
			/> */}
		</ContainerStyle>
	);
};

export default memo(HeaderSection);
