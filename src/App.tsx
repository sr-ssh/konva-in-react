import React from "react";
import "./App.css";
import { StoryContextProvider } from "./contexts/StoryContextProvider";
import StoryPage from "./pages/StoryPage";
import { PageManagerContextProvider } from "./contexts/PageManagerContextProvider";

function App() {
	window.addEventListener("resize", () => {
		const height = window.visualViewport?.height;
		console.log(height, window.innerHeight);
		document.body.style.height = height + "px";
	});
	console.log(window.innerHeight, window.visualViewport?.height);

	return (
		<div className="App" dir="rtl">
			<PageManagerContextProvider>
				<StoryContextProvider>
					<StoryPage />
					<div id="container"></div>
				</StoryContextProvider>
			</PageManagerContextProvider>
		</div>
	);
}

export default App;
