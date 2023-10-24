import styled from "@emotion/styled";
import { emojiSliderColors } from "../../utils/widgetColors";
import { getGradient } from "../../utils/widgetUtils";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import { useStoryContext } from "../../hooks/useStoryContext";

const EmojiSliderStyle = styled.div({
	justifySelf: "center",
	alignSelf: "center",
	borderRadius: 5,
	padding: "18px 11px",
	backgroundColor: emojiSliderColors[0].backgroundColor,
	display: "grid",
	position: "relative",
	alignItems: "center",
});
export const FakeRangeTrackStyle = styled.div({
	position: "absolute",
	height: "6px",
	width: 90,
	left: 5,
	backgroundColor: emojiSliderColors[0].rangeTrackColor,
	borderRadius: "16px",
});
export const FakeRangeStyle = styled.div({
	position: "absolute",
	height: "6px",
	borderEndEndRadius: "16px",
	borderStartEndRadius: "16px",
	left: 5,
	width: 45,
	background: emojiSliderColors[0].isGradient
		? getGradient(
				emojiSliderColors[0].rangeSliderColor as (string | number)[],
				"to bottom"
		  )
		: (emojiSliderColors[0].rangeSliderColor as string),
	animation: "emojiSliderAnim 2s ease infinite",
	transformOrigin: "top left",
});
const FakeThumbStyle = styled.div({
	position: "absolute",
	fontSize: 23,
	left: 45,
	animation: "emojiSliderEmoji 2s ease infinite",
});

const EmojiSliderPreview = () => {
	const { openPage } = usePageMangerContext();
	const { popShape } = useStoryContext();

	return (
		<div
			onClick={() => {
				popShape("emoji-slider");
				openPage(PageTypeEnum.EmojiSlider);
			}}
			style={{ width: 100, position: "relative", marginBlock: 30 }}
		>
			<EmojiSliderStyle>
				<FakeRangeTrackStyle />
				<FakeRangeStyle />
				<FakeThumbStyle>😍</FakeThumbStyle>
			</EmojiSliderStyle>
		</div>
	);
};

export default EmojiSliderPreview;
