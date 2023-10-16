import React, { memo } from "react";
import TextPage from "./TextPage";
import { useStoryContext } from "../hooks/useStoryContext";
import DrawPage from "./DrawPage";
import DefaultPage from "./DefaultPage";
import HashtagPage from "./widgetsPage/HashtagPage";
import MentionPage from "./widgetsPage/MentionPage";
import EmojiSliderPage from "./widgetsPage/EmojiSliderPage";
import PollPage from "./widgetsPage/PollPage";

function StoryPage() {
	const { addText } = useStoryContext();

	const closeAddText = (text?: string, color?: string) => {
		addText(text, color);
	};

	return (
		<>
			<TextPage close={closeAddText} />
			<HashtagPage />
			<MentionPage />
			<EmojiSliderPage />
			<PollPage />
			<DrawPage />
			<DefaultPage />
		</>
	);
}

export default memo(StoryPage);
