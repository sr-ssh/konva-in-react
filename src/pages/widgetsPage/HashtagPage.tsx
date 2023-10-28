import { useEffect, useRef, useState } from "react";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import EditWidgetLayout from "../../sections/widgetsPage/EditWidgetLayout";
import styled from "@emotion/styled";
import { hashtagColors } from "../../utils/widgetColors";
import { getGradient, placeCursorAtTheEnd } from "../../utils/widgetUtils";
import { useStoryContext } from "../../hooks/useStoryContext";
import {
	PageAttrs,
	PageTypeEnum,
} from "../../contexts/PageManagerContextProvider";
import HashtagSearchSection from "../../sections/widgetsPage/HashtagSearchSection";
import useHeightResetOnInput from "../../hooks/useHeightResetOnInput";

type HashtagStyleType = {
	colorsIndex?: number;
};
export const HashtagStyle = styled.div<HashtagStyleType>(
	({ colorsIndex = 0 }) => ({
		justifySelf: "center",
		alignSelf: "center",
		borderRadius: 5,
		padding: "5px 8px",
		backgroundColor: hashtagColors[colorsIndex].fill,
	})
);

type HashtagTextStyleType = {
	fontSize: number;
	text?: string;
	colorsIndex?: number;
};
export const HashtagTextStyle = styled.div<HashtagTextStyleType>(
	({ fontSize, text, colorsIndex = 0 }) => ({
		outline: "none",
		backgroundImage: getGradient(hashtagColors[colorsIndex].color),
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
export const HashtagPlaceHolderStyle = styled.div<HashtagTextStyleType>(
	({ fontSize, colorsIndex = 0 }) => ({
		outline: "none",
		backgroundImage: getGradient(hashtagColors[colorsIndex].color),
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
	const [show, setShow] = useState(false);
	const [fontSize, setFontSize] = useState(40);
	const [text, setText] = useState("");
	const [colorsIndex, setColorsIndex] = useState(0);

	const textRef = useRef<HTMLDivElement>(null);
	const textStrRef = useRef<string>();
	const textPlaceHolderRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const { registerPage } = usePageMangerContext();
	const { addHashtag } = useStoryContext();
	const { handleBlur, handleFocus } = useHeightResetOnInput();

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
		addHashtag(str);
	};

	if (textRef.current?.innerText)
		textStrRef.current = textRef.current?.innerText;

	useEffect(() => {
		if (textStrRef.current) {
			setText(textStrRef.current);
		}
	}, [show]);

	const pageHandler = ({ colorsIndex }: Partial<PageAttrs>) => {
		if (colorsIndex) {
			setColorsIndex(colorsIndex);
		}
	};

	const listen = (status: boolean) => {
		setShow(status);
	};

	useEffect(() => {
		textRef.current?.focus();
		registerPage(PageTypeEnum.Hashtag, listen, pageHandler);
	}, [registerPage]);

	useEffect(() => {
		textRef.current?.focus();
	});

	if (!show) {
		return <></>;
	}

	return (
		<EditWidgetLayout containerRef={containerRef} handleClose={handleClose}>
			<HashtagStyle
				colorsIndex={colorsIndex}
				style={{
					position: "relative",
					zIndex: 1,
					opacity: text ? 1 : 0,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<HashtagTextStyle
					ref={textRef}
					colorsIndex={colorsIndex}
					contentEditable
					onInput={handleTextChange}
					dir="auto"
					fontSize={fontSize}
					text={text}
					onBlur={() => handleBlur(containerRef)}
					onFocus={handleFocus}
					suppressContentEditableWarning={true}
				>
					{text}
				</HashtagTextStyle>
			</HashtagStyle>
			<HashtagStyle
				ref={textPlaceHolderRef}
				colorsIndex={colorsIndex}
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
					colorsIndex={colorsIndex}
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
