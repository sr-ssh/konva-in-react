import { memo, useEffect } from "react";
import TextPage from "./TextPage";
import DrawPage from "./DrawPage";
import DefaultPage from "./DefaultPage";
import HashtagPage from "./widgetsPage/HashtagPage";
import MentionPage from "./widgetsPage/MentionPage";
import EmojiSliderPage from "./widgetsPage/EmojiSliderPage";
import PollPage from "./widgetsPage/PollPage";
import TrashPage from "./TrashPage";
import ChooseWidget from "./widgetsPage/ChooseWidget";
import LinkPage from "./widgetsPage/LinkPage";
import { useStoryContext } from "../hooks/useStoryContext";

function StoryPage() {
	const { addStoryImage } = useStoryContext();

	useEffect(() => {
		addStoryImage("assets/images/test2.jpeg");
	}, []);

	return (
		<>
			<TextPage />
			<HashtagPage />
			<MentionPage />
			<EmojiSliderPage />
			<PollPage />
			<DrawPage />
			<DefaultPage />
			<TrashPage />
			<ChooseWidget />
			<LinkPage />
		</>
	);
}

export default memo(StoryPage);
