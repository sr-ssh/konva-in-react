import React, { FC } from "react";
import styled from "@emotion/styled";
import { BrushColorEnum } from "../../@types/drawType";

type SearchItemsStyleProps = { position?: any };
const SearchItemsStyle = styled.div<SearchItemsStyleProps>((props) => ({
	position: props.position ? props.position : "absolute",
	bottom: 0,
	alignItems: "center",
	zIndex: 2,
	color: "#fff",
	padding: "8px 8px 10px",
	paddingInlineEnd: 41,
	direction: "ltr",
	overflowX: "auto",
	whiteSpace: "nowrap",
	width: "-webkit-fill-available",
	background: "linear-gradient(to top, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0))",
	"::-webkit-scrollbar": {
		display: "none",
	},
	msOverflowStyle: "none",
	scrollbarWidth: "none",
	touchAction: "pan-x",
}));
const ItemStyle = styled.div({
	backgroundColor: "#ffffff87",
	borderRadius: 8,
	margin: "3px",
	padding: "10px 4px",
	display: "inline-block",
	zIndex: 3,
	fontFamily: "AvenyTRegular",
	fontSize: 18,
});

type HashtagSearchSectionPropsType = {
	getItem: (item: string) => void;
};
const HashtagSearchSection: FC<HashtagSearchSectionPropsType> = ({
	getItem,
}) => {
	const handleItem = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		item: string
	) => {
		e.stopPropagation();
		getItem(item);
	};

	return (
		<SearchItemsStyle>
			{Object.values(BrushColorEnum).map((item) => (
				<ItemStyle
					key={item}
					onClick={(e) => handleItem(e, item)}
					color={item}
				>
					{item}
				</ItemStyle>
			))}
		</SearchItemsStyle>
	);
};

export default HashtagSearchSection;
