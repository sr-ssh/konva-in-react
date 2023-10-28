import { ChangeEvent, useEffect, useRef, useState } from "react";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import EditWidgetLayout from "../../sections/widgetsPage/EditWidgetLayout";
import styled from "@emotion/styled";
import {
	hashtagColors,
	optionLeftGradient,
	optionRightGradient,
} from "../../utils/widgetColors";
import {
	getGradient,
	isIOS,
	placeCursorAtTheEnd,
} from "../../utils/widgetUtils";
import { useStoryContext } from "../../hooks/useStoryContext";
import {
	PageAttrs,
	PageTypeEnum,
} from "../../contexts/PageManagerContextProvider";

const optionsHeight = 75;
const optionsWidth = (window.innerWidth * 2) / 3;

const PollStyle = styled.div({
	justifySelf: "center",
	alignSelf: "center",
	padding: "5px 8px",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	width: optionsWidth,
});
const OptionsStyle = styled.div({
	display: "flex",
	backgroundColor: hashtagColors[0].fill,
	borderRadius: 10,
	width: "100%",
	height: optionsHeight,
	alignItems: "center",
});
type QuestionStyleType = {
	question?: string;
};
const QuestionStyle = styled.div<QuestionStyleType>(({ question }) => ({
	outline: "none",
	fontSize: 22,
	color: "#ffffff",
	fontWeight: "bold",
	textAlign: question ? "start" : "center",
	opacity: question ? 1 : 0.6,
	flex: 1,
	maxHeight: 100,
	overflowY: "scroll",
	msOverflowStyle: "none",
	scrollbarWidth: "none",
	maxWidth: window.innerWidth - 40,
	minWidth: 168,
	whiteSpace: "pre-wrap",
	marginBottom: 18,
	zIndex: 1,
	// ":empty:before": {
	// 	content: "attr(data-text)",
	// },
	"::-webkit-scrollbar": {
		display: "none",
	},
}));
const QuestionPlaceHolderStyle = styled.div<QuestionStyleType>(
	({ question }) => ({
		position: "absolute",
		fontSize: 22,
		color: "#ffffff",
		fontWeight: "bold",
		textAlign: "center",
		opacity: question ? 0 : 0.6,
		marginBottom: 18,
	})
);
const OptionStyle = styled.div({ flex: 1, position: "relative" });
const OptionsHr = styled.hr({
	height: "100%",
	width: 3,
	background: "#e0e0e0",
	border: "none",
});
type PollTextStyleType = {
	fontSize: number;
	backgroundImage: string;
	text?: string;
};
const PollTextStyle = styled.div<PollTextStyleType>(
	({ fontSize, backgroundImage, text }) => ({
		outline: "none",
		backgroundImage: backgroundImage,
		backgroundSize: "100%",
		backgroundRepeat: "repeat",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		MozBackgroundClip: "text",
		MozTextFillColor: "transparent",
		fontFamily: "AvenyTRegular",
		fontSize: fontSize,
		textAlign: "start",
		opacity: text ? 1 : 0.6,
		flex: 1,
		padding: 8,
		display: "flex",
		alignItems: "center",
		wordBreak: "break-all",
		whiteSpace: "pre-wrap",
		position: "relative",
		zIndex: 1,
	})
);
const PollPlaceHolderStyle = styled.div<PollTextStyleType>(
	({ fontSize, backgroundImage, text }) => ({
		position: "absolute",
		top: 0,
		left: 0,
		backgroundImage: backgroundImage,
		backgroundSize: "100%",
		backgroundRepeat: "repeat",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		MozBackgroundClip: "text",
		MozTextFillColor: "transparent",
		fontFamily: "AvenyTRegular",
		fontSize: fontSize,
		textAlign: "start",
		opacity: text ? 0 : 0.6,
		flex: 1,
		padding: 8,
		display: "flex",
		alignItems: "center",
		wordBreak: "break-all",
		whiteSpace: "pre-wrap",
		zIndex: 0,
	})
);

const PollPage = () => {
	const [show, setShow] = useState(false);
	const [leftOptionFontSize, setLeftOptionFontSize] = useState(40);
	const [rightOptionFontSize, setRightOptionFontSize] = useState(40);
	const [question, setQuestion] = useState("");
	const [leftOption, setLeftOption] = useState("");
	const [rightOption, setRightOption] = useState("");
	const questionRef = useRef<HTMLDivElement>(null);
	const questionTextRef = useRef<string>("");
	const questionPlaceHolderRef = useRef<HTMLDivElement>(null);
	const leftOptionRef = useRef<HTMLDivElement>(null);
	const leftOptionTextRef = useRef<string>("");
	const leftOptionPlaceHolderRef = useRef<HTMLDivElement>(null);
	const rightOptionRef = useRef<HTMLDivElement>(null);
	const rightOptionTextRef = useRef<string>("");
	const rightOptionPlaceHolderRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const { registerPage } = usePageMangerContext();
	const { addPoll } = useStoryContext();

	if (questionRef.current?.innerText)
		questionTextRef.current = questionRef.current?.innerText;
	if (leftOptionRef.current?.innerText)
		leftOptionTextRef.current = leftOptionRef.current?.innerText;
	if (rightOptionRef.current?.innerText)
		rightOptionTextRef.current = rightOptionRef.current?.innerText;

	const handleOption = (
		event: React.ChangeEvent<HTMLDivElement>,
		optionFontSize: number,
		setOptionFontSize: (value: React.SetStateAction<number>) => void,
		placeholderRef: React.RefObject<HTMLDivElement>
	) => {
		const div = event.target;
		if (div.innerText.trim() !== "") {
			div.style.opacity = "1";
			if (placeholderRef.current) {
				placeholderRef.current.style.opacity = "0";
			}
			const isEnglish = /^[A-Za-z\s]+$/.test(div.innerText);

			const newText = div.innerText;
			div.innerText = newText.toLocaleUpperCase();

			let newFontSize = Number(optionFontSize || div.style.fontSize);
			while (
				div.clientHeight > optionsHeight - 26 &&
				optionFontSize > 18 &&
				newFontSize > 18
			) {
				div.style.fontSize = `${newFontSize - 1}px`;
				newFontSize--;
			}
			setOptionFontSize(newFontSize);
			const maxHeight = isEnglish ? 31 * 2 : 39 * 2;
			while (div.offsetHeight > maxHeight) {
				const content = div.innerText;
				div.innerText = content.slice(0, content.length - 1);
			}

			placeCursorAtTheEnd(event);
		} else {
			if (placeholderRef.current) {
				placeholderRef.current.style.opacity = ".6";
			}
			div.style.opacity = ".6";
			div.style.fontSize = "40px";
			setOptionFontSize(40);
		}
	};

	const handleQuestionChange = (event: React.ChangeEvent<HTMLDivElement>) => {
		if (event.target.innerText.trim() !== "") {
			if (questionPlaceHolderRef.current) {
				questionPlaceHolderRef.current.style.opacity = "0";
			}
			const div = event.target;
			div.style.opacity = "1";
			div.style.textAlign = "start";

			placeCursorAtTheEnd(event);
		} else {
			event.target.style.opacity = ".6";
			event.target.style.textAlign = "center";
			if (questionPlaceHolderRef.current) {
				questionPlaceHolderRef.current.style.opacity = ".6";
			}
		}
	};

	const handleClose = () => {
		addPoll(
			questionRef.current?.innerText,
			leftOptionRef.current?.innerText,
			rightOptionRef.current?.innerText
		);
	};

	const listen = (status: boolean) => {
		setShow(status);
	};

	const handlePage = ({
		question,
		leftOption,
		rightOption,
	}: Partial<PageAttrs>) => {
		if (question && leftOption && rightOption) {
			setQuestion(question);
			setLeftOption(leftOption);
			setRightOption(rightOption);
			questionRef.current?.focus();
		}
	};

	useEffect(() => {
		questionRef.current?.focus();
		registerPage(PageTypeEnum.Poll, listen, handlePage);
	}, [registerPage]);

	useEffect(() => {
		if (questionTextRef.current) {
			setQuestion(questionTextRef.current);
		}
		if (leftOptionTextRef.current) {
			setLeftOption(leftOptionTextRef.current);
		}
		if (rightOptionTextRef.current) {
			setRightOption(rightOptionTextRef.current);
		}
	}, [show]);

	useEffect(() => {
		questionRef.current?.focus();
	});

	if (!show) {
		return <></>;
	}

	return (
		<EditWidgetLayout containerRef={containerRef} handleClose={handleClose}>
			<PollStyle onClick={(e) => e.stopPropagation()}>
				<QuestionStyle
					contentEditable
					ref={questionRef}
					data-text="Ask a question..."
					onInput={handleQuestionChange}
					dir="auto"
					suppressContentEditableWarning={true}
					question={question}
					onBlur={() => {
						if (isIOS()) {
							if (containerRef.current) {
								containerRef.current.style.height = "100%";
							}
						}
					}}
				>
					{question}
				</QuestionStyle>
				<QuestionPlaceHolderStyle
					ref={questionPlaceHolderRef}
					dir="auto"
					question={question}
				>
					Ask a question...
				</QuestionPlaceHolderStyle>
				<OptionsStyle>
					<OptionStyle>
						<PollTextStyle
							ref={rightOptionRef}
							contentEditable
							data-text="NO"
							onInput={(e) =>
								handleOption(
									e as ChangeEvent<HTMLDivElement>,
									rightOptionFontSize,
									setRightOptionFontSize,
									rightOptionPlaceHolderRef
								)
							}
							dir="auto"
							fontSize={rightOptionFontSize}
							backgroundImage={getGradient(optionRightGradient)}
							suppressContentEditableWarning={true}
							text={rightOption}
						>
							{rightOption}
						</PollTextStyle>
						<PollPlaceHolderStyle
							ref={rightOptionPlaceHolderRef}
							text={rightOption}
							dir="auto"
							fontSize={40}
							backgroundImage={getGradient(optionRightGradient)}
						>
							NO
						</PollPlaceHolderStyle>
					</OptionStyle>
					<OptionsHr />
					<OptionStyle>
						<PollTextStyle
							ref={leftOptionRef}
							contentEditable
							data-text="YES"
							onInput={(e) =>
								handleOption(
									e as ChangeEvent<HTMLDivElement>,
									leftOptionFontSize,
									setLeftOptionFontSize,
									leftOptionPlaceHolderRef
								)
							}
							dir="auto"
							fontSize={leftOptionFontSize}
							backgroundImage={getGradient(optionLeftGradient)}
							suppressContentEditableWarning={true}
							text={leftOption}
						>
							{leftOption}
						</PollTextStyle>
						<PollPlaceHolderStyle
							ref={leftOptionPlaceHolderRef}
							text={leftOption}
							dir="auto"
							fontSize={40}
							backgroundImage={getGradient(optionLeftGradient)}
						>
							YES
						</PollPlaceHolderStyle>
					</OptionStyle>
				</OptionsStyle>
			</PollStyle>
		</EditWidgetLayout>
	);
};

export default PollPage;
