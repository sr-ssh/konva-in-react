import styled from "@emotion/styled";
import { useState, useCallback, useRef, useEffect } from "react";
import { EmojiSliderColorsType } from "../../utils/widgetColors";
import { getGradient } from "../../utils/widgetUtils";

const floatAnimation = "floatAnimation";
const goUpAnimation = "goUpAnimation";

type RageInputStyleType = {
	colors: EmojiSliderColorsType;
};
const RageInputStyle = styled.input<RageInputStyleType>(({ colors }) => ({
	direction: "ltr",
	WebkitAppearance: "none",
	appearance: "none",
	width: "100%",
	cursor: "pointer",
	outline: "none",
	overflow: "hidden",
	borderRadius: "16px",
	position: "relative",
	zIndex: 1,
	height: 28,
	background: "transparent",
	"::-webkit-slider-runnable-track": {
		WebkitAppearance: "none",
		background: "transparent",
		height: 28,
		borderRadius: "16px",
	},
	"::-webkit-slider-thumb": {
		boxShadow: "none",
		WebkitAppearance: "none",
		appearance: "none",
		backgroundColor: "transparent",
		height: "28px",
		width: "28px",
	},
}));
type FakeRangeStyleType = {
	colors: EmojiSliderColorsType;
	width: number;
};
const FakeRangeStyle = styled.div<FakeRangeStyleType>(({ colors, width }) => ({
	position: "absolute",
	height: "13px",
	borderEndStartRadius: "16px",
	borderStartStartRadius: "16px",
	width: width + 7.5,
	bottom: 3.5,
	background: colors.isGradient
		? getGradient(
				colors.rangeSliderColor as (string | number)[],
				"to bottom"
		  )
		: (colors.rangeSliderColor as string),
}));
type FakeThumbStyleType = {
	left: number;
};
const FakeThumbStyle = styled.div<FakeThumbStyleType>(({ left }) => ({
	position: "absolute",
	top: 2,
	fontSize: 30,
	left,
	marginInlineStart: -3,
}));
const FakeRangeTrackStyle = styled.div<RageInputStyleType>(({ colors }) => ({
	position: "absolute",
	height: "13px",
	width: "100%",
	backgroundColor: colors.rangeTrackColor,
	borderRadius: "16px",
	bottom: 3.5,
}));
type ThumbImageStyleType = {
	left: number;
	animation: string;
};
export const ThumbImageStyle = styled.div<ThumbImageStyleType>(
	({ left, animation }) => ({
		position: "absolute",
		bottom: 27,
		fontSize: 30 + left / 4,
		left: left - (30 + left / 4) / 2 + 15,
		marginInlineStart: -3,
		animation: `${animation} 2s ease-in-out ${
			animation === floatAnimation ? "infinite" : "1"
		}`,
	})
);

interface EmojiSliderProps {
	emoji: string;
	rate: number;
	colors: EmojiSliderColorsType;
	getRate: (rate: number) => void;
}

const EmojiSlider = ({ emoji, rate, colors, getRate }: EmojiSliderProps) => {
	const [value, setValue] = useState<number>(rate);
	const [width, setWidth] = useState<number>(
		(window.innerWidth * 3) / 5 - 40
	);
	const [thumbImageAnimation, setThumbImageAnimation] =
		useState(floatAnimation);
	const [showThumbImage, setShowThumbImage] = useState(false);

	const rangeInputRef = useRef<HTMLInputElement>(null);
	const animationTimeoutRef = useRef<any>(null);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(parseInt(e.target.value));
		},
		[setValue]
	);

	const handleRangeStart = () => {
		console.log("touch start on input");
		clearTimeout(animationTimeoutRef.current);
		setShowThumbImage(true);
		setThumbImageAnimation(floatAnimation);
	};

	const handleRangeEnd = () => {
		setThumbImageAnimation(goUpAnimation);
		getRate(value);
		animationTimeoutRef.current = setTimeout(() => {
			setShowThumbImage(false);
		}, 2000);
	};

	useEffect(() => {
		return () => {
			clearTimeout(animationTimeoutRef.current); // TODO problem in timeout
		};
	}, [animationTimeoutRef]);

	return (
		<div
			dir="ltr"
			style={{
				position: "relative",
				width: (window.innerWidth * 3) / 5 - 20,
				justifySelf: "center",
			}}
		>
			<RageInputStyle
				type="range"
				ref={rangeInputRef}
				value={value}
				colors={colors}
				onChange={handleChange}
				width={width}
				max={100}
				onTouchStart={handleRangeStart}
				onTouchEnd={handleRangeEnd}
				onMouseDown={handleRangeStart}
				onMouseUp={handleRangeEnd}
			></RageInputStyle>
			<FakeRangeTrackStyle colors={colors} />
			<FakeRangeStyle colors={colors} width={(width * value) / 100} />
			<FakeThumbStyle left={(width * value) / 100}>
				{emoji}
			</FakeThumbStyle>
			{showThumbImage && (
				<ThumbImageStyle
					left={(width * value) / 100}
					animation={thumbImageAnimation}
				>
					{emoji}
				</ThumbImageStyle>
			)}
		</div>
	);
};

export default EmojiSlider;
