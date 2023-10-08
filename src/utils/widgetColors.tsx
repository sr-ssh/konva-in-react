const twoColorPink = [0, "#FF7043", 0.5, "#FF5863", 1, "#FF4081"];
const rainbow = [
	0,
	"#C62828",
	0.2,
	"#F57C00",
	0.4,
	"#FFD54F",
	0.6,
	"#4CAF50",
	0.8,
	"#2196F3",
	1,
	"#9C27B0",
];
const twoColorOrange = [0, "#FF7043", 0.5, "#FBC02D", 1, "#FDD835"];
const twoColorBlue = [0, "#4b86ac", 0.5, "#4582ab", 1, "#4078a3"];
const simple = [0, "white", 1, "white"];
const simpleBlack = [0, "black", 1, "black"];
export const optionLeftGradient = [0, "#16AAF8", 1, "#1FC47E"];
export const optionRightGradient = [0, "#F87036", 1, "#FA3F6D"];

const round = "#fff";
const roundFrost = "rgba(234, 234, 234, .5)";

export const hashtagColors = [
	{ color: twoColorPink, fill: round },
	{ color: rainbow, fill: round },
	{ color: simple, fill: roundFrost },
];

export const mentionColors = [
	{ color: twoColorOrange, fill: round },
	{ color: rainbow, fill: round },
	{ color: simple, fill: roundFrost },
];

export const linkColors = [
	{ color: twoColorBlue, fill: round },
	{ color: rainbow, fill: round },
	{ color: simple, fill: roundFrost },
	{ color: simpleBlack, fill: round },
];

export type EmojiSliderColorsType = {
	backgroundColor: string;
	rangeTrackColor: string;
	rangeSliderColor: string | (number | string)[];
	textColor: string;
	isGradient: boolean;
};
export const emojiSliderColors: EmojiSliderColorsType[] = [
	{
		// White
		backgroundColor: "#ffffff",
		rangeTrackColor: "#3F3F3F4D",
		rangeSliderColor: [0, "#A728A3", 1, "#DE2F27"],
		textColor: "#000000",
		isGradient: true,
	},
	{
		// Black
		backgroundColor: "#000000",
		rangeTrackColor: "#3F3F3F4D",
		rangeSliderColor: "#ffffff",
		textColor: "#ffffff",
		isGradient: false,
	},
	{
		// Blue
		backgroundColor: "#3897f0",
		rangeTrackColor: "#3F3F3F4D",
		rangeSliderColor: "#ffffff",
		textColor: "#ffffff",
		isGradient: false,
	},
	{
		// Yellow
		backgroundColor: "#fdcb5c",
		rangeTrackColor: "#3F3F3F4D",
		rangeSliderColor: "#ffffff",
		textColor: "#ffffff",
		isGradient: false,
	},
	{
		// Orange
		backgroundColor: "#fd8d32",
		rangeTrackColor: "#3F3F3F4D",
		rangeSliderColor: "#ffffff",
		textColor: "#ffffff",
		isGradient: false,
	},
	{
		// Red
		backgroundColor: "#ed4956",
		rangeTrackColor: "#3F3F3F4D",
		rangeSliderColor: "#ffffff",
		textColor: "#ffffff",
		isGradient: false,
	},
	{
		// Pink
		backgroundColor: "#d10869",
		rangeTrackColor: "#3F3F3F4D",
		rangeSliderColor: "#ffffff",
		textColor: "#ffffff",
		isGradient: false,
	},
	{
		// Purple
		backgroundColor: "#d10869",
		rangeTrackColor: "#3F3F3F4D",
		rangeSliderColor: "#ffffff",
		textColor: "#ffffff",
		isGradient: false,
	},
];
