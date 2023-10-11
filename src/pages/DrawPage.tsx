import React, { FC, memo, useEffect, useRef, useState } from "react";
import { useStoryContext } from "../hooks/useStoryContext";
import HeaderSection from "../sections/drawPage/HeaderSection";
import ColorsSection from "../sections/drawPage/ColorsSection";
import RangeInputSection from "../sections/drawPage/RangeInputSection";
import { usePageMangerContext } from "../hooks/usePageMangerContext";
import { PageTypeEnum } from "../contexts/PageManagerContextProvider";

const DrawPage = () => {
	let [show, setShow] = useState(false);
	const drawPageRef = useRef(null);

	const { isDrawing, registerDrawContainer } = useStoryContext();
	const { registerPage } = usePageMangerContext();

	const listen = (showPage: boolean) => {
		setShow(showPage);
	};

	useEffect(() => {
		if (drawPageRef.current) {
			registerDrawContainer(drawPageRef.current);
		}
		registerPage(PageTypeEnum.Draw, listen);
	}, [drawPageRef, registerDrawContainer, registerPage]);

	if (isDrawing) {
		return <></>;
	}

	if (!show) {
		return <></>;
	}

	return (
		<div ref={drawPageRef}>
			<HeaderSection />
			<ColorsSection />
			<RangeInputSection />
		</div>
	);
};

export default memo(DrawPage);
