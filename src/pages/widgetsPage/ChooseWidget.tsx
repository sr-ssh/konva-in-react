import styled from "@emotion/styled";
import HashtagPreview from "../../components/widgets/HashtagPreview";
import MentionPreview from "../../components/widgets/MentionPreview";
import PollPreview from "../../components/widgets/PollPreview";
import LinkPreview from "../../components/widgets/LinkPreview";
import EmojiSliderPreview from "../../components/widgets/EmojiSliderPreview";

const ContainerStyle = styled.div({
	position: "absolute",
	inset: 0,
	height: "100%",
	width: "100%",
	background: "black",
	zIndex: 2,
	display: "grid",
	gridTemplateColumns: "repeat(3, 1fr)",
	justifyItems: "center",
	alignContent: "flex-start",
	rowGap: 24,
	paddingBlock: 24,
	overflowY: "scroll",
});

const ChooseWidget = () => {
	return (
		<ContainerStyle>
			<HashtagPreview />
			<MentionPreview />
			<PollPreview />
			<EmojiSliderPreview />
			<LinkPreview />
		</ContainerStyle>
	);
};

export default ChooseWidget;
