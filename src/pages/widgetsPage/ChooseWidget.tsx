import styled from "@emotion/styled";
import HashtagPreview from "../../components/widgets/HashtagPreview";
import MentionPreview from "../../components/widgets/MentionPreview";
import PollPreview from "../../components/widgets/PollPreview";
import LinkPreview from "../../components/widgets/LinkPreview";
import EmojiSliderPreview from "../../components/widgets/EmojiSliderPreview";
import ClockPreview from "../../components/widgets/ClockPreview";
import EmojisArray from "../../components/widgets/EmojisArray";
import usePageWithShow from "../../hooks/usePageWithShow";
import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";

const ContainerStyle = styled.div({
	position: "absolute",
	inset: 0,
	height: "100%",
	width: "100%",
	background: "black",
	zIndex: 2,
	overflowY: "scroll",
	padding: 18,
});
const WidgetsStyle = styled.div({
	display: "grid",
	gridTemplateColumns: "repeat(3, 1fr)",
	justifyItems: "center",
	alignContent: "flex-start",
	alignItems: "center",
	paddingBlockEnd: 20,
});

const ChooseWidget = () => {
	const show = usePageWithShow(PageTypeEnum.Widgets);

	if (!show) {
		return <></>;
	}

	return (
		<ContainerStyle>
			<WidgetsStyle>
				<HashtagPreview />
				<MentionPreview />
				<PollPreview />
				<EmojiSliderPreview />
				<LinkPreview />
				<ClockPreview />
			</WidgetsStyle>
			<EmojisArray />
		</ContainerStyle>
	);
};

export default ChooseWidget;
