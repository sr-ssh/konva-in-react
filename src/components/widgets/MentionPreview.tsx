import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import {
	MentionStyle,
	MentionTextStyle,
} from "../../pages/widgetsPage/MentionPage";

const MentionPreview = () => {
	const { openPage } = usePageMangerContext();
	return (
		<div
			onClick={() => openPage(PageTypeEnum.Mention)}
			style={{ width: 100, marginBlock: 30 }}
		>
			<MentionStyle style={{ borderRadius: 10, paddingInline: 8 }}>
				<MentionTextStyle
					style={{
						opacity: 1,
						minWidth: "auto",
						position: "relative",
						top: 2,
					}}
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
