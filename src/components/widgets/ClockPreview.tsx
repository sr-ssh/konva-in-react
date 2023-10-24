import styled from "@emotion/styled";
import { linkColors } from "../../utils/widgetColors";

const ContainerStyle = styled.div({
	justifySelf: "center",
	alignSelf: "center",
	borderRadius: 5,
	minWidth: 80,
	direction: "ltr",
	marginBlock: 30,
	display: "flex",
	fontFamily: "AvenyTRegular",
	fontSize: 45,
	position: "relative",
});
const ClockCard = styled.div({
	background: "rgba(143, 143, 143, 0.319)",
	borderRadius: 5,
	lineHeight: 0.9,
	color: "#ffffff",
	marginInline: 0.5,
	width: 26,
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	p: {
		margin: 0,
		position: "relative",
		top: 5,
	},
});
const HrStyle = styled.hr({
	position: "absolute",
	top: "50%",
	left: 0,
	right: 0,
	margin: 0,
	background: "black",
	border: "1.2px solid black",
});

const ClockPreview = () => {
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return (
		<ContainerStyle>
			<ClockCard>
				<p>{Math.floor(hours / 10)}</p>
			</ClockCard>
			<ClockCard style={{ marginInlineEnd: 2 }}>
				<p>{Math.floor(hours % 10)}</p>
			</ClockCard>
			<ClockCard style={{ marginInlineStart: 2 }}>
				<p>{Math.floor(minutes / 10)}</p>
			</ClockCard>
			<ClockCard>
				<p>{Math.floor(minutes % 10)}</p>
			</ClockCard>
			<HrStyle />
		</ContainerStyle>
	);
};

export default ClockPreview;
