import styled from "@emotion/styled";
import { linkColors } from "../../utils/widgetColors";
import { getGradient } from "../../utils/widgetUtils";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";

const ContainerStyle = styled.div({
	justifySelf: "center",
	alignSelf: "center",
	borderRadius: 10,
	padding: "8px 10px",
	backgroundColor: linkColors[0].fill,
	minWidth: 80,
	direction: "ltr",
	marginBlock: 30,
});
const TexStyle = styled.div({
	backgroundImage: getGradient(linkColors[0].color),
	backgroundSize: "100%",
	backgroundRepeat: "repeat",
	WebkitBackgroundClip: "text",
	WebkitTextFillColor: "transparent",
	MozBackgroundClip: "text",
	MozTextFillColor: "transparent",
	fontFamily: "AvenyTRegular",
	fontSize: 30,
	fontWeight: "bold",
	textAlign: "left",
	display: "flex",
	position: "relative",
	top: 2,
	span: {
		WebkitTextFillColor: "black",
		MozTextFillColor: "black",
		fontSize: 20,
	},
});

const LinkPreview = () => {
	const { openPage } = usePageMangerContext();
	return (
		<ContainerStyle onClick={() => openPage(PageTypeEnum.Link)}>
			<TexStyle>
				<span>🔗</span> LINK
			</TexStyle>
		</ContainerStyle>
	);
};

export default LinkPreview;
