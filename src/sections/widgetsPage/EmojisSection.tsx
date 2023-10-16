import React, { FC } from "react";
import styled from "@emotion/styled";

type ItemsStyleProps = { position?: any };
const ItemsStyle = styled.div<ItemsStyleProps>((props) => ({
	position: props.position ? props.position : "absolute",
	bottom: 0,
	alignItems: "center",
	zIndex: 2,
	color: "#fff",
	padding: "8px 8px 10px",
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
	borderRadius: 8,
	margin: 13,
	display: "inline-block",
	zIndex: 3,
	fontSize: 22,
	img: {
		border: "2px solid #80808085",
		borderRadius: "50%",
		width: 58,
		height: 58,
	},
});

const emojisArray = [
	"😍",
	"😂",
	"😀",
	"🔥",
	"😡",
	"😱",
	"😢",
	"🙌",
	"❤️",
	"🎉",
	"👍",
	"🙏",
	"😮",
	"💯",
	"😴",
	"😭",
	"👏",
];
type EmojisSectionPropsType = {
	getItem: (item: string) => void;
};
const EmojisSection: FC<EmojisSectionPropsType> = ({ getItem }) => {
	const handleItem = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		item: string
	) => {
		e.stopPropagation();
		getItem(item);
	};

	return (
		<ItemsStyle>
			{emojisArray.map((item) => (
				<ItemStyle
					key={item}
					onClick={(e) => handleItem(e, item.replace("#", ""))}
					color={item}
				>
					{item.replace("#", "")}
				</ItemStyle>
			))}
		</ItemsStyle>
	);
};

export default EmojisSection;
