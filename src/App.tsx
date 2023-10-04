import React from "react";
import "./App.css";
import { StoryContextProvider } from "./contexts/StoryContextProvider";
import StoryPage from "./pages/StoryPage";
import { PageManagerContextProvider } from "./contexts/PageManagerContextProvider";

function App() {
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
