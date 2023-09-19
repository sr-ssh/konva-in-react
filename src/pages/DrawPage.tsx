import React, { FC, memo, useEffect, useRef } from "react";
import { useStoryContext } from "../hooks/useStoryContext";
import HeaderSection from "../sections/drawPage/HeaderSection";
import ColorsSection from "../sections/drawPage/ColorsSection";
import RangeInputSection from "../sections/drawPage/RangeInputSection";

type DrawPageTypes = {
	setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
};

const DrawPage: FC<DrawPageTypes> = ({ setIsDrawing }) => {
	const drawPageRef = useRef(null);

	const { isDrawing, registerDrawContainer } = useStoryContext();

	useEffect(() => {
		drawPageRef.current && registerDrawContainer(drawPageRef.current);
	}, [drawPageRef, registerDrawContainer]);

	if (isDrawing) {
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
