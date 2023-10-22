import {
	MentionStyle,
	MentionTextStyle,
} from "../../pages/widgetsPage/MentionPage";
import { optionLeftGradient } from "../../utils/widgetColors";
import { getGradient } from "../../utils/widgetUtils";

const PollPreview = () => {
	return (
		<div style={{ width: 80, marginBlock: 30 }}>
			<MentionStyle onClick={(e) => e.stopPropagation()}>
				<MentionTextStyle
					style={{
						opacity: 1,
						backgroundImage: getGradient(optionLeftGradient),
					}}
					dir="auto"
					fontSize={23}
				>
					POLL
				</MentionTextStyle>
			</MentionStyle>
		</div>
	);
};

export default PollPreview;
