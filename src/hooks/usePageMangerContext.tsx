import { useContext } from "react";
import { PageManagerContext } from "../contexts/PageManagerContextProvider";

export const usePageMangerContext = () => useContext(PageManagerContext);
