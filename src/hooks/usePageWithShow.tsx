import { useEffect, useState } from "react";
import { usePageMangerContext } from "./usePageMangerContext";
import {
	PageTypeEnum,
	PageHandlerType,
} from "../contexts/PageManagerContextProvider";

const usePageWithShow = (
	pageType: PageTypeEnum,
	initialShow: boolean = false,
	handlePage?: PageHandlerType
): boolean => {
	const [show, setShow] = useState(initialShow);
	const { registerPage } = usePageMangerContext();

	useEffect(() => {
		const listen = (showPage: boolean) => {
			setShow(showPage);
		};
		registerPage(pageType, listen, handlePage);
	}, [registerPage, pageType, handlePage]);

	return show;
};

export default usePageWithShow;
