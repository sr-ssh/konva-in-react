import { ChangeEvent, useEffect, useRef, useState } from "react";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import EditWidgetLayout from "../../sections/widgetsPage/EditWidgetLayout";
import styled from "@emotion/styled";
import {
	hashtagColors,
	optionLeftGradient,
	optionRightGradient,
} from "../../utils/widgetColors";
import { getGradient, placeCursorAtTheEnd } from "../../utils/widgetUtils";
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
	whiteSpace: "pre-wrap",
	marginBottom: 18,
	":empty:before": {
		content: "attr(data-text)",
	},
	"::-webkit-scrollbar": {
		display: "none",
	},
}));
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
		":empty:before": {
			content: "attr(data-text)",
		},
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
	const leftOptionRef = useRef<HTMLDivElement>(null);
	const rightOptionRef = useRef<HTMLDivElement>(null);

	const { registerPage } = usePageMangerContext();
	const { addPoll } = useStoryContext();

	const handleOption = (
		event: React.ChangeEvent<HTMLDivElement>,
		optionFontSize: number,
		setOptionFontSize: (value: React.SetStateAction<number>) => void
	) => {
		const div = event.target;
		if (div.innerText !== "") {
			div.style.opacity = "1";

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
			div.style.opacity = ".6";
			div.style.fontSize = "40px";
			setOptionFontSize(40);
		}
	};

	const handleQuestionChange = (event: React.ChangeEvent<HTMLDivElement>) => {
		if (event.target.innerText !== "") {
			const div = event.target;
			div.style.opacity = "1";
			div.style.textAlign = "start";
		} else {
			event.target.style.opacity = ".6";
			event.target.style.textAlign = "center";
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

	if (!show) {
		return <></>;
	}

	return (
		<EditWidgetLayout handleClose={handleClose}>
			<PollStyle onClick={(e) => e.stopPropagation()}>
				<QuestionStyle
					contentEditable
					ref={questionRef}
					data-text="Ask a question..."
					onInput={handleQuestionChange}
					dir="auto"
					suppressContentEditableWarning={true}
					question={question}
				>
					{question}
				</QuestionStyle>
				<OptionsStyle>
					<PollTextStyle
						ref={rightOptionRef}
						contentEditable
						data-text="NO"
						onInput={(e) =>
							handleOption(
								e as ChangeEvent<HTMLDivElement>,
								rightOptionFontSize,
								setRightOptionFontSize
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
					<OptionsHr />
					<PollTextStyle
						ref={leftOptionRef}
						contentEditable
						data-text="YES"
						onInput={(e) =>
							handleOption(
								e as ChangeEvent<HTMLDivElement>,
								leftOptionFontSize,
								setLeftOptionFontSize
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
				</OptionsStyle>
			</PollStyle>
		</EditWidgetLayout>
	);
};

export default PollPage;
