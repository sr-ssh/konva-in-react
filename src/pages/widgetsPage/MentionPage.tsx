import { useEffect, useRef, useState } from "react";
import EditWidgetLayout from "../../sections/widgetsPage/EditWidgetLayout";
import styled from "@emotion/styled";
import { mentionColors } from "../../utils/widgetColors";
import { getGradient, placeCursorAtTheEnd } from "../../utils/widgetUtils";
import { useStoryContext } from "../../hooks/useStoryContext";
import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import MentionSearchSection from "../../sections/widgetsPage/MentionSearchSection";
import useHeightResetOnInput from "../../hooks/useHeightResetOnInput";
import usePageWithShow from "../../hooks/usePageWithShow";

export const MentionStyle = styled.div({
	justifySelf: "center",
	alignSelf: "center",
	borderRadius: 5,
	padding: "5px 8px",
	backgroundColor: mentionColors[0].fill,
});

type MentionTextStyleType = {
	fontSize: number;
	text?: string;
};
export const MentionTextStyle = styled.div<MentionTextStyleType>(
	({ fontSize, text }) => ({
		outline: "none",
		backgroundImage: getGradient(mentionColors[0].color),
		backgroundSize: "100%",
		backgroundRepeat: "repeat",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		MozBackgroundClip: "text",
		MozTextFillColor: "transparent",
		fontFamily: "AvenyTRegular",
		fontSize: fontSize,
		fontWeight: "bold",
		textAlign: "left",
		opacity: text ? 1 : 0,
		minWidth: text ? "auto" : 157,
	})
);
export const MentionPlaceHolderStyle = styled.div<MentionTextStyleType>(
	({ fontSize }) => ({
		backgroundImage: getGradient(mentionColors[0].color),
		backgroundSize: "100%",
		backgroundRepeat: "repeat",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		MozBackgroundClip: "text",
		MozTextFillColor: "transparent",
		fontFamily: "AvenyTRegular",
		fontSize: fontSize,
		fontWeight: "bold",
		textAlign: "left",
		opacity: 0.6,
	})
);

// TODO add api of mention
const MentionPage = () => {
	const [fontSize, setFontSize] = useState(40);
	const [text, setText] = useState("");

	const textRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const placeHolderRef = useRef<HTMLDivElement>(null);

	const { addMention } = useStoryContext();
	const { handleBlur, handleFocus } = useHeightResetOnInput();

	const handleTextChange = (event: React.ChangeEvent<HTMLDivElement>) => {
		const div = event.target;
		if (event.target.innerText.trim() !== "") {
			if (placeHolderRef.current) {
				placeHolderRef.current.style.opacity = "0";
			}
			div.style.opacity = "1";
			div.style.minWidth = "auto";
			if (div.parentElement) div.parentElement.style.opacity = "1";

			const newText = event.target.innerText
				.replace("@", "")
				.replaceAll("\n", "");
			event.target.innerText = `@${newText.toLocaleUpperCase()}`;

			let newFontSize = Number(fontSize || event.target.style.fontSize);
			while (event.target.clientWidth > (window.innerWidth * 3) / 4) {
				event.target.style.fontSize = `${newFontSize - 1}px`;
				newFontSize--;
			}
			setFontSize(newFontSize);

			placeCursorAtTheEnd(event);
		} else {
			if (placeHolderRef.current) {
				placeHolderRef.current.style.opacity = "1";
			}
			div.style.opacity = ".6";
			if (div.parentElement) div.parentElement.style.opacity = "0";

			div.style.minWidth = "157px";
			event.target.style.fontSize = "40px";
			setFontSize(40);
		}
	};

	const handleClose = () => {
		addMention(textRef.current?.innerText);
	};

	useEffect(() => {
		textRef.current?.focus();
	});

	const show = usePageWithShow(PageTypeEnum.Mention);

	if (!show) {
		return <></>;
	}

	return (
		<EditWidgetLayout containerRef={containerRef} handleClose={handleClose}>
			<MentionStyle
				style={{
					position: "relative",
					zIndex: 1,
					opacity: text ? 1 : 0,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<MentionTextStyle
					contentEditable
					ref={textRef}
					onInput={handleTextChange}
					dir="auto"
					fontSize={fontSize}
					onBlur={() => handleBlur(containerRef)}
					onFocus={handleFocus}
					suppressContentEditableWarning={true}
					text={text}
				>
					{text}
				</MentionTextStyle>
			</MentionStyle>
			<MentionStyle
				ref={placeHolderRef}
				style={{
					position: "absolute",
					zIndex: 0,
					opacity: text ? 0 : 1,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<MentionPlaceHolderStyle
					dir="auto"
					fontSize={fontSize}
					text={text}
				>
					@MENTION
				</MentionPlaceHolderStyle>
			</MentionStyle>
			<MentionSearchSection
				getItem={(item) => {
					setText("@" + item);
					textRef.current?.focus();
				}}
			/>
		</EditWidgetLayout>
	);
};

export default MentionPage;
