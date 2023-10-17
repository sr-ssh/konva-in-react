import React, { memo } from "react";
import styled from "@emotion/styled";
import { useStoryContext } from "../../hooks/useStoryContext";
import { BrushModesEnum } from "../../@types/drawType";
import { HeaderStyle } from "../../components/Header";

const BrushSection = styled.div({
	display: "flex",
	gap: 0,
});
const BrushStyle = styled.div({
	backgroundImage: "url(/assets/images/icons.png)",
	backgroundRepeat: "no-repeat",
	height: 44,
	width: 44,
	backgroundSize: "179px 179px",
});
type EraserStyleProps = {
	isActive: boolean;
};
const EraserStyle = styled(BrushStyle)<EraserStyleProps>((props) => ({
	backgroundPosition: props.isActive ? "-90px 0" : "-90px -45px",
}));
const NeonBrushStyle = styled(BrushStyle)<EraserStyleProps>((props) => ({
	backgroundPosition: props.isActive ? "0 -90px" : "-45px -90px",
}));
const HighlighterBrushStyle = styled(BrushStyle)<EraserStyleProps>((props) => ({
	backgroundPosition: props.isActive ? "0 0" : "-45px 0",
}));
const PenStyle = styled(BrushStyle)<EraserStyleProps>((props) => ({
	backgroundPosition: props.isActive ? "-90px -90px" : "-135px 0",
}));
const HeartStyle = styled.div<EraserStyleProps>((props) => ({
	backgroundImage: props.isActive
		? "url(/assets/images/heart_filled.png)"
		: "url(/assets/images/heart_outline.png)",
	backgroundRepeat: "no-repeat",
	height: 44,
	width: 44,
	backgroundSize: 44,
}));

const HeaderSection = () => {
	const [brush, setBrush] = React.useState<BrushModesEnum>(
		BrushModesEnum.Pen
	);

	const { stopDrawMode, setBrushMode, undoDraw } = useStoryContext();

	return (
		<HeaderStyle>
			<div
				style={{ marginInline: 6 }}
				onClick={() => {
					stopDrawMode();
				}}
			>
				<img
					src="assets/images/check.png"
					alt="check"
					width={39}
					height={39}
				/>
			</div>
			<div>
				<BrushSection>
					{/* <HeartStyle
						isActive={brush === BrushModesEnum.Heart}
						onClick={(e) => {
							setBrushMode(BrushModesEnum.Heart);
							setBrush(BrushModesEnum.Heart);
						}}
					/> */}
					<EraserStyle
						isActive={brush === BrushModesEnum.Eraser}
						onClick={(e) => {
							setBrushMode(BrushModesEnum.Eraser);
							setBrush(BrushModesEnum.Eraser);
						}}
					/>
					<NeonBrushStyle
						isActive={brush === BrushModesEnum.Neon}
						onClick={() => {
							setBrushMode(BrushModesEnum.Neon);
							setBrush(BrushModesEnum.Neon);
						}}
					/>
					<HighlighterBrushStyle
						isActive={brush === BrushModesEnum.Highlighter}
						onClick={() => {
							setBrushMode(BrushModesEnum.Highlighter);
							setBrush(BrushModesEnum.Highlighter);
						}}
					/>
					<PenStyle
						isActive={brush === BrushModesEnum.Pen}
						onClick={() => {
							setBrushMode(BrushModesEnum.Pen);
							setBrush(BrushModesEnum.Pen);
						}}
					/>
				</BrushSection>
			</div>
			<div style={{ marginInline: 6 }} onClick={() => undoDraw()}>
				<img
					src="assets/images/undo.png"
					alt="undo"
					width={39}
					height={39}
				/>
			</div>
		</HeaderStyle>
	);
};

export default memo(HeaderSection);
