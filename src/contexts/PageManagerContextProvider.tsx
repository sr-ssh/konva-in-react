import { ReactNode, createContext, memo, useRef } from "react";
import { StoryContextModes } from "./StoryContextProvider";

type PageListenerType = (showPage: boolean) => void;
type PageAttrs = {
	text: string;
	color: string;
	defaultValue: number;
	emoji: string;
	colorsIndex: number;
	question: string;
	leftOption: string;
	rightOption: string;
};
type PageHandlerType = (config: Partial<PageAttrs>) => void;

interface PageManagerContextType {
	setMode: (
		mode: StoryContextModes,
		status: boolean,
		config?: Partial<PageAttrs>
	) => void;
	registerPage: (
		pageType: PageTypeEnum,
		listener: PageListenerType,
		handlePage?: PageHandlerType
	) => void;
}

export const PageManagerContext = createContext<PageManagerContextType>({
	setMode: (
		mode: StoryContextModes,
		status: boolean,
		config?: Partial<PageAttrs>
	) => {},
	registerPage: (
		pageType: PageTypeEnum,
		listener: PageListenerType,
		handlePage?: PageHandlerType
	) => {},
});

export enum PageTypeEnum {
	Text = "TEXT",
	Default = "DEFAULT",
	Draw = "DRAW",
	Hashtag = "HASHTAG",
	Mention = "MENTION",
	EmojiSlider = "EMOJI_SLIDER",
	Poll = "POLL",
}

export type PageRefType = {
	[pageType: string]: {
		pageListener: PageListenerType;
		pageHandler?: PageHandlerType;
	};
};

export const PageManagerContextProvider = memo(
	({ children }: { children: ReactNode }) => {
		let pagesRef = useRef<PageRefType>({});

		const registerPage = (
			pageType: PageTypeEnum,
			listener: PageListenerType,
			handlePage?: PageHandlerType
		) => {
			pagesRef.current[pageType] = {
				pageListener: listener,
				pageHandler: handlePage,
			};
		};

		const showNoPage = () => {
			for (const property in pagesRef.current) {
				pagesRef.current[property]?.pageListener(false);
			}
		};

		const showThisPage = (pageType: PageTypeEnum) => {
			for (const property in pagesRef.current) {
				if (property === pageType) {
					pagesRef.current[property]?.pageListener(true);
				} else {
					pagesRef.current[property]?.pageListener(false);
				}
			}
		};

		const showPageWithAttrs = (
			pageType: PageTypeEnum,
			config?: Partial<PageAttrs>
		) => {
			for (const property in pagesRef.current) {
				if (property === pageType && config) {
					pagesRef.current[property].pageHandler?.(config);
				}
			}
			showThisPage(pageType);
		};

		const setMode = (
			mode: StoryContextModes,
			status: boolean,
			config?: Partial<PageAttrs>
		) => {
			switch (mode) {
				case StoryContextModes.IsColorPicking:
					if (status) {
						showNoPage();
					}
					break;

				case StoryContextModes.IsAddingText:
					if (status) {
						showThisPage(PageTypeEnum.Text);
					} else {
						showThisPage(PageTypeEnum.Default);
					}
					break;

				case StoryContextModes.IsDefault:
					if (status) {
						showThisPage(PageTypeEnum.Default);
					}
					break;

				case StoryContextModes.IsDragging:
					if (status) {
						showNoPage();
					} else {
						showThisPage(PageTypeEnum.Default);
					}
					break;

				case StoryContextModes.IsEditingText:
					if (status) {
						showPageWithAttrs(PageTypeEnum.Text, config);
					}
					break;

				case StoryContextModes.IsDrawing:
					if (status) {
						showThisPage(PageTypeEnum.Draw);
					} else {
						showThisPage(PageTypeEnum.Default);
					}
					break;

				case StoryContextModes.IsPainting:
					if (status) {
						showNoPage();
					} else {
						showThisPage(PageTypeEnum.Draw);
					}
					break;

				case StoryContextModes.IsHashtagEditing:
				case StoryContextModes.IsMentionEditing:
					if (status) {
					} else {
						showThisPage(PageTypeEnum.Default);
					}
					break;

				case StoryContextModes.IsEmojiSliderEditing:
					if (status) {
						showPageWithAttrs(PageTypeEnum.EmojiSlider, config);
					} else {
						showThisPage(PageTypeEnum.Default);
					}
					break;
				case StoryContextModes.IsPollEditing:
					if (status) {
						showPageWithAttrs(PageTypeEnum.Poll, config);
					} else {
						showThisPage(PageTypeEnum.Default);
					}
					break;

				default:
					break;
			}
		};
		return (
			<PageManagerContext.Provider
				value={{
					setMode,
					registerPage,
				}}
			>
				{children}
			</PageManagerContext.Provider>
		);
	}
);
