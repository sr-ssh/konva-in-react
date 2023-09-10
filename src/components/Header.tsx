import styled from "@emotion/styled";

export const HeaderStyle = styled.div({
	position: "absolute",
	top: 0,
	width: "100%",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	zIndex: 2,
	color: "#fff",
	padding: "8px 8px 0",
	div: { display: "flex", gap: 12, alignItems: "center" },
});
