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
	registerTextPage: (
		listener: PageListenerType,
		handlePage: TextPageHandlerType
	) => void;
	registerDrawPage: (listener: PageListenerType) => void;
	registerDefaultPage: (listener: PageListenerType) => void;
}

export const PageManagerContext = createContext<PageManagerContextType>({
	setMode: (
		mode: StoryContextModes,
		status: boolean,
		config?: PageAttrs
	) => {},
	registerTextPage: (
		listener: PageListenerType,
		handlePage: TextPageHandlerType
	) => {},
	registerDrawPage: (listener: PageListenerType) => {},
	registerDefaultPage: (listener: PageListenerType) => {},
});

export const PageManagerContextProvider = memo(
	({ children }: { children: ReactNode }) => {
		let defaultPageListenerRef = useRef<PageListenerType>();
		let drawPageListenerRef = useRef<PageListenerType>();
		let textPageListenerRef = useRef<PageListenerType>();
		let textPageHandlerRef = useRef<TextPageHandlerType>();

		const registerTextPage = (
			listener: PageListenerType,
			handlePage: TextPageHandlerType
		) => {
			textPageListenerRef.current = listener;
			textPageHandlerRef.current = handlePage;
		};

		const registerDefaultPage = (listener: PageListenerType) => {
			defaultPageListenerRef.current = listener;
		};

		const registerDrawPage = (listener: PageListenerType) => {
			drawPageListenerRef.current = listener;
		};

		const showNoPage = () => {
			if (textPageListenerRef.current) {
				textPageListenerRef.current(false);
			}
			if (defaultPageListenerRef.current) {
				defaultPageListenerRef.current(false);
			}
			if (drawPageListenerRef.current) {
				drawPageListenerRef.current(false);
			}
		};

		const showTextPage = () => {
			if (textPageListenerRef.current) {
				textPageListenerRef.current(true);
			}
			if (defaultPageListenerRef.current) {
				defaultPageListenerRef.current(false);
			}
			if (drawPageListenerRef.current) {
				drawPageListenerRef.current(false);
			}
		};

		const showTextPageWithAttrs = (config?: PageAttrs) => {
			if (textPageListenerRef.current) {
				if (config && config.color && config.text) {
					textPageHandlerRef.current?.(config.text, config.color);
				}
				textPageListenerRef.current(true);
			}
			if (defaultPageListenerRef.current) {
				defaultPageListenerRef.current(false);
			}
			if (drawPageListenerRef.current) {
				drawPageListenerRef.current(false);
			}
		};

		const showDefaultPage = () => {
			if (defaultPageListenerRef.current) {
				defaultPageListenerRef.current(true);
			}
			if (textPageListenerRef.current) {
				textPageListenerRef.current(false);
			}
			if (drawPageListenerRef.current) {
				drawPageListenerRef.current(false);
			}
		};

		const showDrawPage = () => {
			if (drawPageListenerRef.current) {
				drawPageListenerRef.current(true);
			}
			if (defaultPageListenerRef.current) {
				defaultPageListenerRef.current(false);
			}
			if (textPageListenerRef.current) {
				textPageListenerRef.current(false);
			}
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
						showTextPage();
					} else {
						showDefaultPage();
					}
					break;

				case StoryContextModes.IsDefault:
					if (status) {
						showDefaultPage();
					}
					break;

				case StoryContextModes.IsDragging:
					if (status) {
						showNoPage();
					} else {
						showDefaultPage();
					}
					break;

				case StoryContextModes.IsEditingText:
					if (status) {
						showTextPageWithAttrs(config);
					}
					break;

				case StoryContextModes.IsDrawing:
					if (status) {
						showDrawPage();
					} else {
						showDefaultPage();
					}
					break;

				case StoryContextModes.IsPainting:
					if (status) {
						showNoPage();
					} else {
						showDrawPage();
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
					registerTextPage,
					registerDefaultPage,
					registerDrawPage,
				}}
			>
				{children}
			</PageManagerContext.Provider>
		);
	}
);
