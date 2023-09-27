import React, { FC, memo } from "react";
import styled from "@emotion/styled";
import { useStoryContext } from "../../hooks/useStoryContext";
import { FontFamiliesObjectType } from "../../@types/textType";
import { FontFamilies } from "../../components/TextPage/FontFamilies";

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
	inputRef: React.RefObject<HTMLParagraphElement>;
};
const HeaderSection: FC<HeaderSectionPropsType> = ({ inputRef }) => {
	const { stopDrawMode } = useStoryContext();

	return (
		<ContainerStyle>
			<div
				style={{ marginInline: 6, justifySelf: "start" }}
				onClick={() => {
					stopDrawMode();
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
			<FontFamilies inputRef={inputRef} />
		</ContainerStyle>
	);
};

export default memo(HeaderSection);
