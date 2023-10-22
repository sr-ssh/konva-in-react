import { useEffect, useRef, useState } from "react";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import EditWidgetLayout from "../../sections/widgetsPage/EditWidgetLayout";
import styled from "@emotion/styled";
import { mentionColors } from "../../utils/widgetColors";
import { getGradient, placeCursorAtTheEnd } from "../../utils/widgetUtils";
import { useStoryContext } from "../../hooks/useStoryContext";
import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import MentionSearchSection from "../../sections/widgetsPage/MentionSearchSection";

export const MentionStyle = styled.div({
	justifySelf: "center",
	alignSelf: "center",
	borderRadius: 5,
	padding: "5px 8px",
	backgroundColor: mentionColors[0].fill,
});

type MentionTextStyleType = {
	fontSize: number;
};
export const MentionTextStyle = styled.div<MentionTextStyleType>(
	({ fontSize }) => ({
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
		opacity: 0.6,
		":empty:before": {
			content: "attr(data-text)",
		},
	})
);

// TODO add api of mention
const MentionPage = () => {
	const [show, setShow] = useState(false);
	const [fontSize, setFontSize] = useState(40);
	const [text, setText] = useState("");
	const textRef = useRef<HTMLDivElement>(null);

	const { registerPage } = usePageMangerContext();
	const { addMention } = useStoryContext();

	const handleTextChange = (event: React.ChangeEvent<HTMLDivElement>) => {
		if (event.target.innerText !== "") {
			event.target.style.opacity = "1";

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
			event.target.style.opacity = ".6";
			event.target.style.fontSize = "40px";
			setFontSize(40);
		}
	};

	const handleClose = () => {
		addMention(textRef.current?.innerText);
	};

	useEffect(() => {
		const listen = (status: boolean) => {
			setShow(status);
		};
		textRef.current?.focus();
		registerPage(PageTypeEnum.Mention, listen);
	}, [registerPage]);

	if (!show) {
		return <></>;
	}

	return (
		<EditWidgetLayout handleClose={handleClose}>
			<MentionStyle onClick={(e) => e.stopPropagation()}>
				<MentionTextStyle
					contentEditable
					ref={textRef}
					data-text="@MENTION"
					onInput={handleTextChange}
					dir="auto"
					fontSize={fontSize}
				>
					{text}
				</MentionTextStyle>
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
