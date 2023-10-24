import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import { useStoryContext } from "../../hooks/useStoryContext";
import {
	HashtagStyle,
	HashtagTextStyle,
} from "../../pages/widgetsPage/HashtagPage";

const HashtagPreview = () => {
	const { openPage } = usePageMangerContext();
	const { popShape } = useStoryContext();

	return (
		<div
			style={{ width: 100, marginBlock: 30 }}
			onClick={() => {
				popShape("hashtag");
				openPage(PageTypeEnum.Hashtag);
			}}
		>
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
