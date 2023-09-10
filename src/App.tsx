import React, { useEffect } from "react";
import "./App.css";
import AddText from "./pages/AddText";
import { StoryContextProvider } from "./contexts/StoryContextProvider";
import styled from "@emotion/styled";
import StoryPage from "./pages/StoryPage";

const LayoutStyle = styled.div({
	position: "absolute",
	inset: 0,
	display: "flex",
	flexDirection: "column",
	zIndex: 1,
	height: "100%",
	marginInline: 10,
	" div:first-child": {
		display: "flex",
		justifyContent: "space-between",
		div: { display: "flex", gap: 12 },
	},
});
const FooterStyle = styled.div({
	position: "relative",
	bottom: 0,
	marginBottom: 20,
	display: "flex",
	justifyContent: "center",
	color: "#fff",
});
const MainStyle = styled.div({ flex: 1 });

function App() {
	const [textView, setTextView] = React.useState(false);

	useEffect(() => {
		// addStoryImage();
		// addGesturedEventNode();
		// addGesturedEventNode();
		// draw();
	}, []);

	const closeAddText = (text: string) => {
		setTextView(false);
		// addText(text);
	};

	return (
		<div className="App" dir="rtl">
			<StoryContextProvider>
				<StoryPage />
				<div id="container"></div>
			</StoryContextProvider>
		</div>
	);
}

export default App;
