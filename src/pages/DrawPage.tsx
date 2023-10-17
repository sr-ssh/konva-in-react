import React, { memo, useEffect, useState } from "react";
import { useStoryContext } from "../hooks/useStoryContext";
import HeaderSection from "../sections/drawPage/HeaderSection";
import ColorsSection from "../sections/drawPage/ColorsSection";
import RangeInputSection from "../sections/drawPage/RangeInputSection";
import { usePageMangerContext } from "../hooks/usePageMangerContext";
import { PageTypeEnum } from "../contexts/PageManagerContextProvider";

const DrawPage = () => {
	let [show, setShow] = useState(false);

	const { isDrawing } = useStoryContext();
	const { registerPage } = usePageMangerContext();

	const listen = (showPage: boolean) => {
		setShow(showPage);
	};

	useEffect(() => {
		registerPage(PageTypeEnum.Draw, listen);
	}, [registerPage]);

	if (isDrawing) {
		return <></>;
	}

	if (!show) {
		return <></>;
	}

	return (
		<div>
			<HeaderSection />
			<ColorsSection />
			<RangeInputSection />
		</div>
	);
};

export default memo(DrawPage);
