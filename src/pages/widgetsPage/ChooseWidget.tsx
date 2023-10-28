import styled from "@emotion/styled";
import HashtagPreview from "../../components/widgets/HashtagPreview";
import MentionPreview from "../../components/widgets/MentionPreview";
import PollPreview from "../../components/widgets/PollPreview";
import LinkPreview from "../../components/widgets/LinkPreview";
import EmojiSliderPreview from "../../components/widgets/EmojiSliderPreview";
import ClockPreview from "../../components/widgets/ClockPreview";
import EmojisArray from "../../components/widgets/EmojisArray";
import { useEffect, useState } from "react";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
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
	const [show, setShow] = useState(false);

	const { registerPage } = usePageMangerContext();

	const listen = (status: boolean) => {
		setShow(status);
	};

	useEffect(() => {
		registerPage(PageTypeEnum.Widgets, listen);
	}, [registerPage]);

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
