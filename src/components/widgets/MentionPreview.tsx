import {
	MentionStyle,
	MentionTextStyle,
} from "../../pages/widgetsPage/MentionPage";

const MentionPreview = () => {
	return (
		<div style={{ width: 100, marginBlock: 30 }}>
			<MentionStyle onClick={(e) => e.stopPropagation()}>
				<MentionTextStyle
					style={{ opacity: 1 }}
					dir="auto"
					fontSize={23}
				>
					@MENTION
				</MentionTextStyle>
			</MentionStyle>
		</div>
	);
};

export default MentionPreview;
