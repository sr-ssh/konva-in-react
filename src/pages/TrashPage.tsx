import { memo, useState } from "react";
import {
	PageAttrs,
	PageTypeEnum,
} from "../contexts/PageManagerContextProvider";
import styled from "@emotion/styled";
import usePageWithShow from "../hooks/usePageWithShow";

export const trashBottom = 20;
export const trashHeight = 44;
export const trashWidth = 44;

type TrashStyleType = {
	scale: boolean;
};
const TrashStyle = styled.img<TrashStyleType>(({ scale }) => ({
	position: "absolute",
	bottom: trashBottom,
	left: "calc(50vw - 22px)",
	zIndex: 1,
	width: trashWidth,
	height: trashHeight,
	transform: scale ? "scale(1.3)" : "scale(1)",
	transition: "transform 150ms ease",
	pointerEvents: "none",
}));

const TrashPage = () => {
	const [scale, setScale] = useState<boolean>(false);

	const handlePage = ({ status }: Partial<PageAttrs>) => {
		if (status !== undefined) {
			setScale(status);
		}
	};

	const show = usePageWithShow(PageTypeEnum.Trash, false, handlePage);

	if (!show) {
		return <></>;
	}

	return (
		<TrashStyle scale={scale} src="assets/images/trash.png" alt="trash" />
	);
};

export default memo(TrashPage);
