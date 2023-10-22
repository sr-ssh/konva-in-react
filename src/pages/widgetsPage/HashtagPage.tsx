import { useEffect, useRef, useState } from "react";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import EditWidgetLayout from "../../sections/widgetsPage/EditWidgetLayout";
import styled from "@emotion/styled";
import { hashtagColors } from "../../utils/widgetColors";
import { getGradient, placeCursorAtTheEnd } from "../../utils/widgetUtils";
import { useStoryContext } from "../../hooks/useStoryContext";
import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import HashtagSearchSection from "../../sections/widgetsPage/HashtagSearchSection";

const HashtagStyle = styled.div({
	justifySelf: "center",
	alignSelf: "center",
	borderRadius: 5,
	padding: "5px 8px",
	backgroundColor: hashtagColors[0].fill,
});

type HashtagTextStyleType = {
	fontSize: number;
};
const HashtagTextStyle = styled.div<HashtagTextStyleType>(({ fontSize }) => ({
	outline: "none",
	backgroundImage: getGradient(hashtagColors[0].color),
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
}));

// TODO add api of hashtag
const HashtagPage = () => {
	const [show, setShow] = useState(true);
	const [fontSize, setFontSize] = useState(40);
	const [text, setText] = useState("");
	const textRef = useRef<HTMLDivElement>(null);

	const { registerPage } = usePageMangerContext();
	const { addHashtag } = useStoryContext();

	const handleTextChange = (event: React.ChangeEvent<HTMLDivElement>) => {
		if (event.target.innerText !== "") {
			event.target.style.opacity = "1";

			const newText = event.target.innerText
				.replace("#", "")
				.replaceAll("\n", "");
			event.target.innerText = `#${newText.toLocaleUpperCase()}`;

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
		let str = textRef.current?.innerText || "";
		// const isEnglish = /^[A-Za-z\s]+$/.test(str);
		// let modifiedStr;
		// if (isEnglish) {
		// 	modifiedStr = str.substring(1);
		// 	modifiedStr.concat(str.charAt(0));
		// } else {
		// 	modifiedStr = str;
		// }
		// console.log(str, modifiedStr, str.substring(1), str.charAt(0), " ");
		addHashtag(str);
	};

	const listen = (status: boolean) => {
		setShow(status);
	};

	useEffect(() => {
		textRef.current?.focus();
		registerPage(PageTypeEnum.Hashtag, listen);
	}, [registerPage]);

	if (!show) {
		return <></>;
	}

	return (
		<EditWidgetLayout handleClose={handleClose}>
			<HashtagStyle onClick={(e) => e.stopPropagation()}>
				<HashtagTextStyle
					contentEditable
					ref={textRef}
					data-text="#HASHTAG"
					onInput={handleTextChange}
					dir="auto"
					fontSize={fontSize}
					suppressContentEditableWarning={true}
				>
					{text}
				</HashtagTextStyle>
			</HashtagStyle>
			<HashtagSearchSection
				getItem={(item) => {
					setText(item);
					textRef.current?.focus();
				}}
			/>
		</EditWidgetLayout>
	);
};

export default HashtagPage;
