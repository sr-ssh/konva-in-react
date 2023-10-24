import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import { useStoryContext } from "../../hooks/useStoryContext";
import {
	HashtagStyle,
	HashtagTextStyle,
} from "../../pages/widgetsPage/HashtagPage";

const HashtagPreview = () => {
	const { showPageWithAttrs } = usePageMangerContext();
	const { popAndSaveShape } = useStoryContext();

	const handleClick = () => {
		const prevHashtag = popAndSaveShape("hashtag");
		let config = {};
		if (prevHashtag) {
			config = { colorsIndex: prevHashtag.lastColorIndex };
		}
		showPageWithAttrs(PageTypeEnum.Hashtag, config);
	};

	return (
		<div style={{ width: 100, marginBlock: 30 }} onClick={handleClick}>
			<HashtagStyle style={{ borderRadius: 10, paddingInline: 8 }}>
				<HashtagTextStyle
					style={{
						opacity: 1,
						minWidth: "auto",
						position: "relative",
						top: 2,
					}}
					dir="auto"
					fontSize={23}
				>
					#HASHTAG
				</HashtagTextStyle>
			</HashtagStyle>
		</div>
	);
};

export default HashtagPreview;
