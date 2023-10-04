import React, { FC, memo, useEffect, useRef, useState } from "react";
import { useStoryContext } from "../hooks/useStoryContext";
import HeaderSection from "../sections/drawPage/HeaderSection";
import ColorsSection from "../sections/drawPage/ColorsSection";
import RangeInputSection from "../sections/drawPage/RangeInputSection";
import { usePageMangerContext } from "../hooks/usePageMangerContext";

type DrawPageTypes = {
	setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
};

const DrawPage: FC<DrawPageTypes> = ({ setIsDrawing }) => {
	let [show, setShow] = useState(false);
	const drawPageRef = useRef(null);

	const { isDrawing, registerDrawContainer } = useStoryContext();
	const { registerDrawPage } = usePageMangerContext();

	const listen = (showPage: boolean) => {
		setShow(showPage);
	};

	useEffect(() => {
		if (drawPageRef.current) {
			registerDrawContainer(drawPageRef.current);
		}
		registerDrawPage(listen);
	}, [drawPageRef, registerDrawContainer, registerDrawPage]);

	if (isDrawing) {
		return <></>;
	}

	if (!show) {
		return <></>;
	}

	return (
		<div ref={drawPageRef}>
			<HeaderSection setIsDrawing={setIsDrawing} />
			<ColorsSection />
			<RangeInputSection />
		</div>
	);
};

export default memo(DrawPage);
