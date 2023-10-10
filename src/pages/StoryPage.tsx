import React, { memo, useEffect, useRef } from "react";
import TextPage from "./TextPage";
import { useStoryContext } from "../hooks/useStoryContext";
import DrawPage from "./DrawPage";
import DefaultPage from "./DefaultPage";
import EditWidgetLayout from "../sections/widgetsPage/EditWidgetLayout";
import HashtagPage from "./widgetsPage/HashtagPage";

function StoryPage() {
	const [isDrawing, setIsDrawing] = React.useState(false);

	const storyPageRef = useRef<HTMLDivElement>(null);

	const { addText, registerStoryContainer } = useStoryContext();

	const closeAddText = (text?: string, color?: string) => {
		addText(text, color);
	};

	useEffect(() => {
		if (storyPageRef.current) {
			registerStoryContainer(storyPageRef.current);
		}
	}, [registerStoryContainer, storyPageRef]);

	return (
		<>
			<TextPage close={closeAddText} />
			<HashtagPage />
			<DrawPage setIsDrawing={setIsDrawing} />
			<div ref={storyPageRef}>
				<DefaultPage />
			</div>
		</>
	);
}

export default memo(StoryPage);
