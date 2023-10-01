import { useEffect, useRef, useCallback } from "react";
const MAX_TAP_TIME = 300;
export enum EventType {
  None = "None",
  Tap = "Tap",
  RightClick = "RightClick",
  DoubleClick = "DoubleClick",
  Hover = "Hover",
  Press = "Press",
  HorizontalSwipe = "HorizontalSwipe",
  VerticalSwipe = "VerticalSwipe",
}

export interface EventHandler {
  onTouchStart?: (e: TouchEvent) => void;
  onTouchMove?: (e: TouchEvent) => void;
  onTouchEnd?: (e: TouchEvent) => void;
  onTap?: (e: Event) => void;
  onRightClick?: (e: Event) => void;
  onDoubleClick?: (e: Event) => void;
  onPress?: (e: Event) => void;
  onMouseover?: (e: Event) => void;
  onMouseout?: (e: Event) => void;
}

export interface TouchEvent {
  x: number;
  y: number;
  moveX: number;
  moveY: number;
  e: Event;
}

export interface Position {
  x: number;
  y: number;
}

export const useEvent = (
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startPositionRef = useRef<Position | undefined>();
  const touchRef = useRef<number[]>([]);
  const isTouchMoveRef = useRef(false);
  const handleTouchStartRef = useRef<Function[]>([]);
  const eventsRef = useRef<Function[]>([]);
  const currentHandleRef = useRef<Function>();

  const getCurrentTime = () => Date.now();

  const getTouchEvent = (e: Event | any) => {
    const startPosition = startPositionRef.current;
    const touch = e.touches?.[e.touches.length - 1];
    const x = e.clientX || touch.clientX;
    const y = e.clientY || touch.clientY;
    return {
      x,
      y,
      moveX: x - (startPosition?.x || 0),
      moveY: y - (startPosition?.y || 0),
      e,
    } as TouchEvent;
  };

  const clearTimer = () => {
    const timer = timeoutRef.current;
    if (!timer) {
      return;
    }
    clearTimeout(timer);
    timeoutRef.current = undefined;
  };

  const resetTouchRef = () => {
    touchRef.current = [];
  };

  const listenMove = (listen: boolean) => {
    if (listen && !isTouchMoveRef.current) {
      addListener("mousemove", handleTouchMove, window);
      addListener("touchmove", handleTouchMove, window);
    } else if (!listen) {
      isTouchMoveRef.current = false;
      removeListener("mousemove", handleTouchMove, window);
      removeListener("touchmove", handleTouchMove, window);
    }
  };

  const handleTouchEnd = useCallback((e: Event) => {
    handleTap(e);
    listenMove(false);
    clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTap = (e: Event) => {
    const touches = touchRef.current;
    if (touches.length !== 1 || isTouchMoveRef.current) {
      resetTouchRef();
      return;
    }

    resetTouchRef();
    if (getCurrentTime() - touches[0] > MAX_TAP_TIME) {
      return;
    }
    touchRef.current = [];
    const event = eventsRef.current.find(e => e === currentHandleRef.current);
    event?.(e);
  };

  const detectMove = (e: Event) => {
    const current = getTouchEvent(e)
    return Math.abs(current.moveX) > 5 || Math.abs(current.moveY) > 5
  };

  const handleTouchMove = useCallback((e: Event) => {
    isTouchMoveRef.current = detectMove(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeListener = (
    type: string,
    handle: (e: Event) => void,
    el: any,
  ) => {
    el.removeEventListener(
      type,
      handle as EventListener,
    );
  };

  const addListener = (
    type: string,
    handle: (e: Event) => void,
    el: any,
  ) => {
    el.addEventListener(
      type,
      handle as EventListener,
    );
  };

  const listenTap = (
    el: HTMLElement,
    type: EventType,
    callback: (e: Event) => void) => {
    eventsRef.current.push(callback);
    const handleTouchStart = (e: Event) => {
      currentHandleRef.current = callback;
      const touches = touchRef.current;
      touches.push(getCurrentTime());
      startPositionRef.current = getTouchEvent(e);
      listenMove(true);
    }
    addListener("mousedown", handleTouchStart, el);
    addListener("touchstart", handleTouchStart, el);
    handleTouchStartRef.current.push(() => {
      removeListener("mousedown", handleTouchStart, el);
      removeListener("touchstart", handleTouchStart, el);
    });
  }

  useEffect(() => {

    addListener("mouseup", handleTouchEnd, window);
    addListener("touchend", handleTouchEnd, window);
    const handleTouchStartConst = handleTouchStartRef.current;

    return () => {
      listenMove(false);
      removeListener("mouseup", handleTouchEnd, window);
      removeListener("touchend", handleTouchEnd, window);
      handleTouchStartConst.forEach(unListen => unListen());
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    listenTap
  }
};
