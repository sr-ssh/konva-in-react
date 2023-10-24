import {
	MentionStyle,
	MentionTextStyle,
} from "../../pages/widgetsPage/MentionPage";
import { optionLeftGradient } from "../../utils/widgetColors";
import { getGradient } from "../../utils/widgetUtils";

const PollPreview = () => {
	return (
		<div style={{ minWidth: 80, marginBlock: 30 }}>
			<MentionStyle
				style={{ borderRadius: 10, paddingBlock: 6 }}
				onClick={(e) => e.stopPropagation()}
			>
				<MentionTextStyle
					style={{
						opacity: 1,
						backgroundImage: getGradient(optionLeftGradient),
						minWidth: "auto",
						fontWeight: "normal",
					}}
					dir="auto"
					fontSize={30}
				>
					<img src="assets/images/poll.svg" alt="poll" />
					POLL
				</MentionTextStyle>
			</MentionStyle>
		</div>
	);
};

export default PollPreview;
