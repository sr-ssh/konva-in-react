import { useContext } from "react";
import { StoryContext } from "../contexts/StoryContextProvider";

export const useStoryContext = () => useContext(StoryContext);
