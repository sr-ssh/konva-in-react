import { useEffect } from 'react';
import { isIOS } from '../utils/widgetUtils';

export const useResize = (listener: () => void, IOSListener?: () => void) => {
  useEffect(() => {
    if (isIOS() && IOSListener) {
      visualViewport?.addEventListener("resize", IOSListener);
    } else {
      window.addEventListener("resize", listener);
    }

    return () => {
      if (isIOS() && IOSListener) {
        visualViewport?.removeEventListener("resize", IOSListener);
      } else {
        window.removeEventListener("resize", listener);
      }
    };
  }, [listener, IOSListener]);
}
