import React from "react";
import "./App.css";
import { StoryContextProvider } from "./contexts/StoryContextProvider";
import StoryPage from "./pages/StoryPage";

function App() {
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
