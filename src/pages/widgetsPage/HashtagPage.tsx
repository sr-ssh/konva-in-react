import { useEffect, useRef, useState } from "react";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import EditWidgetLayout from "../../sections/widgetsPage/EditWidgetLayout";
import styled from "@emotion/styled";
import { hashtagColors } from "../../utils/widgetColors";
import { getGradient, placeCursorAtTheEnd } from "../../utils/widgetUtils";
import { useStoryContext } from "../../hooks/useStoryContext";
import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import HashtagSearchSection from "../../sections/widgetsPage/HashtagSearchSection";

export const HashtagStyle = styled.div({
	justifySelf: "center",
	alignSelf: "center",
	borderRadius: 5,
	padding: "5px 8px",
	backgroundColor: hashtagColors[0].fill,
});

type HashtagTextStyleType = {
	fontSize: number;
	text?: string;
};
export const HashtagTextStyle = styled.div<HashtagTextStyleType>(
	({ fontSize, text }) => ({
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
		opacity: 0,
		minWidth: text ? "auto" : 157,
	})
);
export const HashtagPlaceHolderStyle = styled.div<HashtagTextStyleType>(
	({ fontSize }) => ({
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
	})
);

// TODO add api of hashtag
const HashtagPage = () => {
	const [show, setShow] = useState(true);
	const [fontSize, setFontSize] = useState(40);
	const [text, setText] = useState("");

	const textRef = useRef<HTMLDivElement>(null);
	const textPlaceHolderRef = useRef<HTMLDivElement>(null);

	const { registerPage } = usePageMangerContext();
	const { addHashtag } = useStoryContext();

	const handleTextChange = (event: React.ChangeEvent<HTMLDivElement>) => {
		const div = event.target;
		if (div.innerText.trim() !== "") {
			if (textPlaceHolderRef.current) {
				textPlaceHolderRef.current.style.opacity = "0";
			}
			div.style.opacity = "1";
			div.style.minWidth = "auto";
			if (div.parentElement) div.parentElement.style.opacity = "1";

			const newText = div.innerText.replace("#", "").replaceAll("\n", "");
			div.innerText = `#${newText.toLocaleUpperCase()}`;

			let newFontSize = Number(fontSize || div.style.fontSize);
			while (div.clientWidth > (window.innerWidth * 3) / 4) {
				div.style.fontSize = `${newFontSize - 1}px`;
				newFontSize--;
			}
			setFontSize(newFontSize);

			placeCursorAtTheEnd(event);
		} else {
			if (textPlaceHolderRef.current) {
				textPlaceHolderRef.current.style.opacity = "1";
			}
			div.style.opacity = ".6";
			if (div.parentElement) div.parentElement.style.opacity = "0";

			div.style.minWidth = "157px";
			div.style.fontSize = "40px";
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
			<HashtagStyle
				style={{
					position: "relative",
					zIndex: 1,
					opacity: text ? 1 : 0,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<HashtagTextStyle
					ref={textRef}
					contentEditable
					onInput={handleTextChange}
					dir="auto"
					fontSize={fontSize}
					text={text}
				>
					{text}
				</HashtagTextStyle>
			</HashtagStyle>
			<HashtagStyle
				ref={textPlaceHolderRef}
				style={{
					position: "absolute",
					zIndex: 0,
					opacity: text ? 0 : 1,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<HashtagPlaceHolderStyle
					dir="auto"
					fontSize={fontSize}
					text={text}
				>
					#HASHTAG
				</HashtagPlaceHolderStyle>
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
