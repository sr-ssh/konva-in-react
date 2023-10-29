import React, { memo, useState } from "react";
import { useStoryContext } from "../hooks/useStoryContext";
import HeaderSection from "../sections/drawPage/HeaderSection";
import ColorsSection from "../sections/drawPage/ColorsSection";
import RangeInputSection from "../sections/drawPage/RangeInputSection";
import {
	PageAttrs,
	PageTypeEnum,
} from "../contexts/PageManagerContextProvider";
import usePageWithShow from "../hooks/usePageWithShow";

const DrawPage = () => {
	const [hasLine, setHasLine] = useState(false);

	const { isDrawing } = useStoryContext();

	const handlePage = ({ hasLine }: Partial<PageAttrs>) => {
		if (hasLine !== undefined) {
			setHasLine(hasLine);
		}
	};

	const show = usePageWithShow(PageTypeEnum.Draw, false, handlePage);

	if (!show) {
		return <></>;
	}

	if (isDrawing) {
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
