import React, { memo, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useStoryContext } from "../hooks/useStoryContext";
import { HeaderStyle } from "../components/Header";
import { usePageMangerContext } from "../hooks/usePageMangerContext";
import { StoryContextModes } from "../contexts/StoryContextProvider";
import { PageTypeEnum } from "../contexts/PageManagerContextProvider";

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

const DefaultPage = () => {
	let [show, setShow] = useState(false);

	const { startDrawMode, downloadStage } = useStoryContext();
	const { setMode, registerPage } = usePageMangerContext();

	const listen = (showPage: boolean) => {
		setShow(showPage);
	};

	useEffect(() => {
		registerPage(PageTypeEnum.Default, listen);
	}, [registerPage]);

	if (!show) {
		return <></>;
	}

	return (
		<>
			<HeaderStyle>
				<div>
					<WriteIcon
						onClick={() => {
							setMode(StoryContextModes.IsAddingText, true);
						}}
					/>
					<img
						src="assets/images/drawing_tool.png"
						alt="drawing-tool"
						width={44}
						height={44}
						onClick={() => {
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
	);
};

export default memo(DefaultPage);
