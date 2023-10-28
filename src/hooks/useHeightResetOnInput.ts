import { useRef } from "react";
import { isIOS } from "../utils/widgetUtils";

const useHeightResetOnInput = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleBlur = (containerRef: React.RefObject<HTMLDivElement>) => {
    const timeout = setTimeout(
      () => {
        if (isIOS()) {
          if (containerRef.current) {
            containerRef.current.style.height = "100%";
          }
        }
      },
      isIOS() ? 50 : 0
    );
    timeoutRef.current = timeout;
  };

  const handleFocus = () => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    clearTimeout(timeoutRef.current);
  };

  return {
    handleBlur, handleFocus
  }
}

export default useHeightResetOnInput
