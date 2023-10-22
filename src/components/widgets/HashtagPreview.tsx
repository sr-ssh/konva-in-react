import {
	HashtagStyle,
	HashtagTextStyle,
} from "../../pages/widgetsPage/HashtagPage";

const HashtagPreview = () => {
	return (
		<div style={{ width: 100, marginBlock: 30 }}>
			<HashtagStyle onClick={(e) => e.stopPropagation()}>
				<HashtagTextStyle
					style={{ opacity: 1 }}
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
