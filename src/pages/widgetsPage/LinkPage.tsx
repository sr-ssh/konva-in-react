import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { usePageMangerContext } from "../../hooks/usePageMangerContext";
import { PageTypeEnum } from "../../contexts/PageManagerContextProvider";
import { useStoryContext } from "../../hooks/useStoryContext";
import { getDomain } from "../../utils/widgetUtils";
import usePageWithShow from "../../hooks/usePageWithShow";

const ContainerStyle = styled.div({
	position: "absolute",
	inset: 0,
	height: "100%",
	width: "100%",
	background: "#1d1c1ccf",
	zIndex: 2,
	overflowY: "scroll",
	padding: 24,
	color: "#ffffff",
	fontSize: 11,
	display: "flex",
	flexDirection: "column",
	gap: 20,
	textAlign: "start",
});
const HeaderStyle = styled.div({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
});
const AddressStyle = styled.div({
	display: "flex",
	flexDirection: "column",
	input: {
		outline: "none",
		background: "transparent",
		border: "none",
		borderBlockEnd: "1px solid #ffffff",
		direction: "ltr",
		color: "#ffffff",
		height: 25,
		"::placeholder": {
			color: "#000000",
		},
		":focus": {
			borderBlockEnd: "2px solid #2196F3",
		},
	},
});

const LinkPage = () => {
	const [showStickerText, setShowStickerText] = useState(false);
	const [hasAddress, setHasAddress] = useState(false);
	const [address, setAddress] = useState("");
	const [addressText, setAddressText] = useState("");

	const addressRef = useRef<HTMLInputElement>(null);
	const addressStrRef = useRef<string>("");
	const addressTextRef = useRef<HTMLInputElement>(null);
	const addressTextStrRef = useRef<string>("");

	const { openPage } = usePageMangerContext();
	const { addLink, popAndSaveShape } = useStoryContext();

	if (addressRef.current?.value) {
		addressStrRef.current = addressRef.current?.value;
	}
	if (addressTextRef.current?.value) {
		addressTextStrRef.current = addressTextRef.current?.value;
	}

	const submitHandler = () => {
		if (addressRef.current?.value) {
			popAndSaveShape("link");
			addLink(
				addressTextRef.current?.value ||
					getDomain(addressRef.current?.value)
			);
			openPage(PageTypeEnum.Default);
		}
	};

	const handleBack = () => {
		openPage(PageTypeEnum.Widgets);
	};

	const show = usePageWithShow(PageTypeEnum.Link);

	useEffect(() => {
		if (addressStrRef.current) {
			setAddress(addressStrRef.current);
		}
		if (addressTextStrRef.current) {
			setAddressText(addressTextStrRef.current);
		}
	}, [show]);

	if (!show) {
		return <></>;
	}

	return (
		<ContainerStyle>
			<HeaderStyle>
				<div onClick={submitHandler}>تایید</div>
				<div style={{ fontSize: 14 }}>افزودن لینک</div>
				<img
					onClick={handleBack}
					src="assets/images/arrow-back.svg"
					alt="arrow-back"
				/>
			</HeaderStyle>
			<AddressStyle>
				<label htmlFor="address">آدرس</label>
				<input
					type="text"
					name="address"
					ref={addressRef}
					placeholder="http://example.com"
					onChange={(e) => setHasAddress(!!e.target.value)}
					defaultValue={address}
				/>
				<span>
					کسانی که استوری شما را می‌بینند می‌توانند با کلیک بر روی این
					برچسب لینک را باز کنند.
				</span>
			</AddressStyle>
			{showStickerText ? (
				<AddressStyle style={{ marginBlockStart: 20 }}>
					<label htmlFor="text">متن برچسب</label>
					<input
						ref={addressTextRef}
						type="text"
						name="text"
						defaultValue={addressText}
					/>
					<span>
						این متن به جای نشانی وب در برچسب نمایش داده خواهد شد
					</span>
				</AddressStyle>
			) : (
				<div
					style={{ opacity: hasAddress ? 1 : 0.5 }}
					onClick={() => hasAddress && setShowStickerText(true)}
				>
					+تغییر متن برچسب
				</div>
			)}
		</ContainerStyle>
	);
};

export default LinkPage;
