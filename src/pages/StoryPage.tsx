import React, { memo, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import TextPage from "./TextPage";
import { useStoryContext } from "../hooks/useStoryContext";
import DrawPage from "./DrawPage";
import { HeaderStyle } from "../components/Header";

const FooterStyle = styled.div({
	position: "absolute",
	bottom: 0,
	left: 0,
	right: 0,
	height: "100px",
	alignItems: "flex-end",
	paddingBottom: 20,
	display: "flex",
	justifyContent: "center",
	color: "#fff",
	zIndex: 2,
	background: "linear-gradient(to top, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0))",
});
const IconsStyle = styled.div({
	backgroundImage: "url(/assets/images/icons.png)",
	backgroundRepeat: "no-repeat",
	height: 44,
	width: 44,
	backgroundSize: "179px 179px",
});
const WidgetIcon = styled(IconsStyle)({
	backgroundPosition: "-135px -45px",
});
const WriteIcon = styled(IconsStyle)({
	backgroundPosition: "-135px -90px",
});
const CloseIcon = styled(IconsStyle)({
	backgroundPosition: "0 -135px",
});

function StoryPage() {
	const [storyView, setStoryView] = React.useState(true);
	const [textView, setTextView] = React.useState(false);
	const [isDrawing, setIsDrawing] = React.useState(false);

	const storyPageRef = useRef<HTMLDivElement>(null);

	const {
		startDrawMode,
		downloadStage,
		addText,
		registerStoryContainer,
		startTextMode,
	} = useStoryContext();

	const closeAddText = (text?: string, color?: string) => {
		// setTextView(false);
		setStoryView(true);
		addText(text, color);
	};

	useEffect(() => {
		if (storyPageRef.current) {
			registerStoryContainer(storyPageRef.current);
		}
	}, [registerStoryContainer, storyPageRef]);

	return (
		<>
			{textView && <TextPage close={closeAddText} />}
			{isDrawing ? (
				<DrawPage setIsDrawing={setIsDrawing} />
			) : (
				<div ref={storyPageRef}>
					{storyView && (
						<>
							<HeaderStyle>
								<div>
									<WriteIcon
										onClick={() => {
											setTextView(true);
											setStoryView(false);
											startTextMode();
										}}
									/>
									<img
										src="assets/images/drawing_tool.png"
										alt="drawing-tool"
										width={44}
										height={44}
										onClick={() => {
											setIsDrawing(true);
											startDrawMode();
										}}
									/>
									<WidgetIcon />
								</div>
								<CloseIcon />
							</HeaderStyle>
							<FooterStyle onClick={() => downloadStage()}>
								add to your story +
							</FooterStyle>
						</>
					)}
				</div>
			)}
		</>
	);
}

export default memo(StoryPage);
