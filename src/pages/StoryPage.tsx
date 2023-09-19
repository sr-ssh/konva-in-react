import React, { memo } from "react";
import styled from "@emotion/styled";
import AddText from "./AddText";
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
	const [textView, setTextView] = React.useState(false);
	const [isDrawing, setIsDrawing] = React.useState(false);

	const { startDrawMode, downloadStage } = useStoryContext();

	const closeAddText = (text: string) => {
		setTextView(false);
		// addText(text);
	};

	return (
		<>
			{textView ? <AddText close={closeAddText} /> : null}
			{isDrawing ? (
				<DrawPage setIsDrawing={setIsDrawing} />
			) : (
				<div>
					<HeaderStyle>
						<div>
							<WriteIcon />
							<p
								onClick={() => {
									setIsDrawing(true);
									startDrawMode();
								}}
							>
								draw
							</p>
							<WidgetIcon />
						</div>
						<CloseIcon />
					</HeaderStyle>
					<FooterStyle onClick={() => downloadStage()}>
						add to your story
					</FooterStyle>
				</div>
			)}
		</>
	);
}

export default memo(StoryPage);
