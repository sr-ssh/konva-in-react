import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import {
	HashtagStyle,
	HashtagTextStyle,
} from "../../pages/widgetsPage/HashtagPage";

const HashtagPreview = () => {
	const { openPage } = usePageMangerContext();

	return (
		<div
			style={{ width: 100, marginBlock: 30 }}
			onClick={() => openPage(PageTypeEnum.Hashtag)}
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
