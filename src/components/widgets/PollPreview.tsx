import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import { useStoryContext } from "../../hooks/useStoryContext";
import {
	MentionStyle,
	MentionTextStyle,
} from "../../pages/widgetsPage/MentionPage";
import { optionLeftGradient } from "../../utils/widgetColors";
import { getGradient } from "../../utils/widgetUtils";

const PollPreview = () => {
	const { openPage } = usePageMangerContext();
	const { popAndSaveShape } = useStoryContext();

	return (
		<div
			onClick={() => {
				popAndSaveShape("poll");
				openPage(PageTypeEnum.Poll);
			}}
			style={{ minWidth: 80, marginBlock: 30 }}
		>
			<MentionStyle style={{ borderRadius: 10, paddingBlock: 6 }}>
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
