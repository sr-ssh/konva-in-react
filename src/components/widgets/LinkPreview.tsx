import styled from "@emotion/styled";
import { linkColors } from "../../utils/widgetColors";
import { getGradient } from "../../utils/widgetUtils";

const ContainerStyle = styled.div({
	justifySelf: "center",
	alignSelf: "center",
	borderRadius: 5,
	padding: "5px 8px",
	backgroundColor: linkColors[0].fill,
	width: 80,
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
	fontSize: 23,
	fontWeight: "bold",
	textAlign: "left",
	span: {
		WebkitTextFillColor: "black",
		MozTextFillColor: "black",
	},
});

const LinkPreview = () => {
	return (
		<ContainerStyle>
			<TexStyle>
				<span>🔗</span> LINK
			</TexStyle>
		</ContainerStyle>
	);
};

export default LinkPreview;
