import React, { memo, useEffect, useState } from "react";
import { useStoryContext } from "../hooks/useStoryContext";
import HeaderSection from "../sections/drawPage/HeaderSection";
import ColorsSection from "../sections/drawPage/ColorsSection";
import RangeInputSection from "../sections/drawPage/RangeInputSection";
import { usePageMangerContext } from "../hooks/usePageMangerContext";
import {
	PageAttrs,
	PageTypeEnum,
} from "../contexts/PageManagerContextProvider";

const DrawPage = () => {
	const [show, setShow] = useState(false);
	const [hasLine, setHasLine] = useState(false);

	const { isDrawing } = useStoryContext();
	const { registerPage } = usePageMangerContext();

	const listen = (showPage: boolean) => {
		setShow(showPage);
	};
	const handlePage = ({ hasLine }: Partial<PageAttrs>) => {
		if (hasLine !== undefined) {
			setHasLine(hasLine);
		}
	};

	useEffect(() => {
		registerPage(PageTypeEnum.Draw, listen, handlePage);
	}, [registerPage]);

	if (isDrawing) {
		return <></>;
	}

	if (!show) {
		return <></>;
	}

	return (
		<div>
			<HeaderSection showUndo={hasLine} />
			<ColorsSection />
			<RangeInputSection />
		</div>
	);
};

export default memo(DrawPage);
