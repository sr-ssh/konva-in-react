import { ReactNode, createContext, memo, useRef } from "react";
import { StoryContextModes } from "./StoryContextProvider";

type PageListenerType = (showPage: boolean) => void;
type TextPageHandlerType = (text: string, color: string) => void;
type PageAttrs = { text?: string; color?: string };

interface PageManagerContextType {
	setMode: (
		mode: StoryContextModes,
		status: boolean,
		config?: PageAttrs
	) => void;
	registerPage: (
		pageType: PageTypeEnum,

		listener: PageListenerType,
		handlePage?: TextPageHandlerType
	) => void;
}

export const PageManagerContext = createContext<PageManagerContextType>({
	setMode: (
		mode: StoryContextModes,
		status: boolean,
		config?: PageAttrs
	) => {},
	registerPage: (
		pageType: PageTypeEnum,
		listener: PageListenerType,
		handlePage?: TextPageHandlerType
	) => {},
});

export enum PageTypeEnum {
	Text = "TEXT",
	Default = "DEFAULT",
	Draw = "DRAW",
	Hashtag = "HASHTAG",
}

export type PageRefType = {
	[pageType: string]: {
		pageListener: PageListenerType;
		pageHandler?: TextPageHandlerType;
	};
};

export const PageManagerContextProvider = memo(
	({ children }: { children: ReactNode }) => {
		let pagesRef = useRef<PageRefType>({});

		const registerPage = (
			pageType: PageTypeEnum,
			listener: PageListenerType,
			handlePage?: TextPageHandlerType
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

		const showTextPageWithAttrs = (config?: PageAttrs) => {
			for (const property in pagesRef.current) {
				if (
					property === PageTypeEnum.Text &&
					config?.color &&
					config?.text
				) {
					pagesRef.current[property].pageHandler?.(
						config.text,
						config.color
					);
				}
			}
			showThisPage(PageTypeEnum.Text);
		};

		const setMode = (
			mode: StoryContextModes,
			status: boolean,
			config?: PageAttrs
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
						showTextPageWithAttrs(config);
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
					if (status) {
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
