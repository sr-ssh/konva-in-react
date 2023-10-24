import {
	HashtagStyle,
	HashtagTextStyle,
} from "../../pages/widgetsPage/HashtagPage";

const HashtagPreview = () => {
	return (
		<div style={{ width: 100, marginBlock: 30 }}>
			<HashtagStyle
				style={{ borderRadius: 10, paddingInline: 8 }}
				onClick={(e) => e.stopPropagation()}
			>
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
