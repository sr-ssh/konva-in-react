import { useEffect, useRef, useState } from "react";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import EditWidgetLayout from "../../sections/widgetsPage/EditWidgetLayout";
import styled from "@emotion/styled";
import {
	EmojiSliderColorsType,
	emojiSliderColors,
} from "../../utils/widgetColors";
import {
	PageAttrs,
	PageTypeEnum,
} from "../../contexts/PageManagerContextProvider";
import EmojisSection from "../../sections/widgetsPage/EmojisSection";
import EmojiSlider from "../../components/widgets/EmojiSlider";
import { useStoryContext } from "../../hooks/useStoryContext";
import { placeCursorAtTheEnd } from "../../utils/widgetUtils";

type EmojiSliderStyleType = {
	colors: EmojiSliderColorsType;
	isScaled: boolean;
};
const EmojiSliderStyle = styled.div<EmojiSliderStyleType>(
	({ colors, isScaled }) => ({
		justifySelf: "center",
		alignSelf: "center",
		borderRadius: 15,
		padding: "25px 15px",
		backgroundColor: colors.backgroundColor,
		display: "grid",
		...(isScaled && { animation: "scale .4s ease 1" }),
	})
);
const ColorWheelStyle = styled.img({
	width: 30,
	height: 30,
	justifySelf: "center",
	borderRadius: "50%",
	border: "2.5px solid #ffffff",
	marginTop: 16,
	position: "absolute",
	transform: "rotate(32deg)",
	zIndex: 3,
});
type EmojiSliderTextStyleType = {
	colors: EmojiSliderColorsType;
	text?: string;
};
export const EmojiSliderTextStyle = styled.div<EmojiSliderTextStyleType>(
	({ colors, text }) => ({
		outline: "none",
		fontWeight: "bold",
		textAlign: "start",
		fontSize: 20,
		opacity: text ? 1 : 0.3,
		color: colors.textColor,
		width: (window.innerWidth * 3) / 5,
		marginBottom: 17,
		whiteSpace: "pre-wrap",
		position: "relative",
		zIndex: 1,
	})
);
const EmojiSliderPlaceHolderStyle = styled.div<EmojiSliderTextStyleType>(
	({ colors, text }) => ({
		position: "absolute",
		zIndex: 0,
		fontWeight: "bold",
		textAlign: "start",
		fontSize: 20,
		opacity: text ? 0 : 0.3,
		color: colors.textColor,
		width: (window.innerWidth * 3) / 5,
		marginBottom: 17,
	})
);

const EmojiSliderPage = () => {
	const [show, setShow] = useState(true);
	const [emoji, setEmoji] = useState("😍");
	const [colorsIndex, setColorsIndex] = useState(0);
	const [text, setText] = useState("");
	const [rate, setRate] = useState(10);
	const [isScaled, setIsScaled] = useState(false);

	const textRef = useRef<HTMLDivElement>(null);
	const textPlaceHolderRef = useRef<HTMLDivElement>(null);

	const { registerPage } = usePageMangerContext();
	const { addEmojiSlider } = useStoryContext();

	const handleTextChange = (event: React.ChangeEvent<HTMLDivElement>) => {
		if (event.target.innerText.trim() !== "") {
			if (textPlaceHolderRef.current) {
				textPlaceHolderRef.current.style.opacity = "0";
			}
			event.target.style.opacity = "1";
			const div = event.target;

			const maxHeight = 28 * 3;
			while (div.offsetHeight > maxHeight) {
				const content = div.innerText;
				div.innerText = content.slice(0, content.length - 1);
			}

			placeCursorAtTheEnd(event);
		} else {
			if (textPlaceHolderRef.current) {
				textPlaceHolderRef.current.style.opacity = ".3";
			}
			event.target.style.opacity = ".3";
		}
	};

	const handleClose = () => {
		addEmojiSlider(
			textRef.current?.innerText || "",
			emoji,
			rate,
			colorsIndex
		);
	};

	useEffect(() => {
		const listen = (status: boolean) => {
			setShow(status);
		};
		const handlePage = ({
			text,
			emoji,
			defaultValue,
			colorsIndex,
		}: Partial<PageAttrs>) => {
			if (
				emoji &&
				defaultValue !== undefined &&
				colorsIndex !== undefined
			) {
				setText(text || "");
				setEmoji(emoji);
				setRate(defaultValue);
				setColorsIndex(colorsIndex);
				textRef.current?.focus();
			}
		};
		textRef.current?.focus();
		registerPage(PageTypeEnum.EmojiSlider, listen, handlePage);
	}, [registerPage]);

	if (!show) {
		return <></>;
	}

	return (
		<EditWidgetLayout handleClose={handleClose}>
			<ColorWheelStyle
				src="assets/images/color-wheel.png"
				alt="color-wheel"
				onClick={(e) => {
					e.stopPropagation();
					setColorsIndex(
						(colorsIndex + 1) % emojiSliderColors.length
					);
					setIsScaled(!isScaled);
					textRef.current?.focus();
				}}
			/>
			<EmojiSliderStyle
				colors={emojiSliderColors[colorsIndex]}
				onClick={(e) => e.stopPropagation()}
				isScaled={isScaled}
				onAnimationEnd={() => setIsScaled(!isScaled)}
			>
				<EmojiSliderTextStyle
					contentEditable
					ref={textRef}
					onInput={handleTextChange}
					dir="auto"
					colors={emojiSliderColors[colorsIndex]}
					suppressContentEditableWarning={true}
					text={text}
				>
					{text}
				</EmojiSliderTextStyle>
				<EmojiSliderPlaceHolderStyle
					ref={textPlaceHolderRef}
					text={text}
					dir="auto"
					colors={emojiSliderColors[colorsIndex]}
				>
					Ask a question...
				</EmojiSliderPlaceHolderStyle>
				<EmojiSlider
					emoji={emoji}
					rate={rate}
					colors={emojiSliderColors[colorsIndex]}
					getRate={(rate) => setRate(rate)}
				/>
			</EmojiSliderStyle>
			<EmojisSection
				getItem={(item) => {
					setEmoji(item);
					textRef.current?.focus();
				}}
			/>
		</EditWidgetLayout>
	);
};

export default EmojiSliderPage;
