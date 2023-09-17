import React, { memo } from "react";
import styled from "@emotion/styled";
import AddText from "./AddText";
import { useStoryContext } from "../hooks/useStoryContext";
import DrawPage from "./DrawPage";
import { HeaderStyle } from "../components/Header";

const FooterStyle = styled.div({
	position: "absolute",
	bottom: 0,
	marginBottom: 20,
	display: "flex",
	justifyContent: "center",
	color: "#fff",
	zIndex: 2,
});

function StoryPage() {
	const [textView, setTextView] = React.useState(false);
	const [isDrawing, setIsDrawing] = React.useState(false);

	const { startDrawMode } = useStoryContext();

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
							<p>write</p>
							<p
								onClick={() => {
									setIsDrawing(true);
									startDrawMode();
								}}
							>
								draw
							</p>
							<p>stickers</p>
						</div>
						<div>X</div>
					</HeaderStyle>
					<FooterStyle>add to your story</FooterStyle>
				</div>
			)}
		</>
	);
}

export default memo(StoryPage);
