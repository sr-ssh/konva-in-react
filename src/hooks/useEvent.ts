import { MutableRefObject, useEffect, useRef, useCallback } from "react";
import { useDisableSelection } from "./useDisableSelection";
const MIN_PRESS_TIME = 500;
const MAX_TAP_TIME = 300;
const MIN_MOVE_TIME = 50;
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
  elRef: MutableRefObject<HTMLElement | undefined>,
  eventType: EventType,
  events: EventHandler,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startPositionRef = useRef<Position | undefined>();
  const touchRef = useRef<number[]>([]);
  const isTouchMoveRef = useRef(false);
  const startSwipeRef = useRef<boolean>();
  useDisableSelection();

  const getCurrentTime = () => Date.now();

  const getTouchEvent = (e: Event | any) => {
    const startPosition = startPositionRef.current;
    const touch = e.touches?.last();
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
    events?.onTap?.(e);
  };

  const handleDoubleClick = (e: Event) => {
    const touches = touchRef.current;
    if (
      getCurrentTime() - touches[touches.length - 1] > MAX_TAP_TIME ||
      isTouchMoveRef.current
    ) {
      resetTouchRef();
      return;
    }

    if (touches.length < 2) {
      return;
    }
    resetTouchRef();
    if (touches.length === 2 && touches[1] - touches[0] < MAX_TAP_TIME) {
      events?.onDoubleClick?.(e);
    }
  };

  const handlePress = (e: Event) => {
    clearTimer();
    resetTouchRef();
    timeoutRef.current = setTimeout(() => {
      if (!isTouchMoveRef.current) {
        events.onPress?.(e);
      }
    }, MIN_PRESS_TIME);
  };

  const handleRightClick = (e: Event) => {
    e.preventDefault();
    events.onRightClick?.(e);
  };

  const handleSwipe = (e: Event) => {
    const touchEvent = getTouchEvent(e);
    if (timeoutRef.current) {
      if (startSwipeRef.current) {
        events.onTouchMove?.(touchEvent);
      }
      return;
    }
    resetTouchRef();
    const isVertical = eventType === EventType.VerticalSwipe;
    timeoutRef.current = setTimeout(() => {
      if (!isTouchMoveRef.current) {
        return;
      }
      const startPosition = startPositionRef.current;
      if (!touchEvent || !startPosition) {
        return;
      }
      const moveX = Math.abs(touchEvent.moveX);
      const moveY = Math.abs(touchEvent.moveY);
      if (moveX < moveY && isVertical) {
        startSwipeRef.current = true;
        events.onTouchStart?.({
          ...touchEvent,
          x: startPosition.x,
          y: startPosition.y,
        });
        events.onTouchMove?.(touchEvent);
      } else if (moveX >= moveY && !isVertical) {
        startSwipeRef.current = true;
        events.onTouchStart?.({
          ...touchEvent,
          x: startPosition.x,
          y: startPosition.y,
        });
        events.onTouchMove?.(touchEvent);
      }
    }, MIN_MOVE_TIME);
  };

  const resetTouchRef = () => {
    touchRef.current = [];
  };

  const handleTouchStart = useCallback((e: Event) => {
    const touches = touchRef.current;
    if (touches.length > 2) {
      touchRef.current.length = 0;
    }
    touches.push(getCurrentTime());
    startPositionRef.current = getTouchEvent(e);
    listenMove(true);
    handleStartEvents(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTouchEnd = useCallback((e: Event) => {
    handleEndEvents(e);
    listenMove(false);
    clearTimer();
    if (startSwipeRef.current) {
      events.onTouchEnd?.(getTouchEvent(e));
      startSwipeRef.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearTimer = () => {
    const timer = timeoutRef.current;
    if (!timer) {
      return;
    }
    clearTimeout(timer);
    timeoutRef.current = undefined;
  };

  const handleStartEvents = (e: Event) => {
    switch (eventType) {
      case EventType.Press:
        handlePress(e);
        break;
    }
  };

  const handleEndEvents = (e: Event) => {
    switch (eventType) {
      case EventType.DoubleClick:
        handleDoubleClick(e);
        break;
      case EventType.Tap:
        handleTap(e);
        break;
      default:
        resetTouchRef();
        break;
    }
  };

  const detectMove = (e: Event) => true;

  const handleTouchMove = useCallback((e: Event) => {
    isTouchMoveRef.current = detectMove(e);
    switch (eventType) {
      case EventType.HorizontalSwipe:
      case EventType.VerticalSwipe:
        handleSwipe(e);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseover = useCallback((e: Event) => {
    events?.onMouseover?.(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseout = useCallback((e: Event) => {
    events?.onMouseout?.(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listenMove = (listen: boolean) => {
    if (listen && !isTouchMoveRef.current) {
      addListener("mousemove", handleTouchMove);
      addListener("touchmove", handleTouchMove);
    } else if (!listen) {
      isTouchMoveRef.current = false;
      removeListener("mousemove", handleTouchMove);
      removeListener("touchmove", handleTouchMove);
    }
  };

  const removeListener = (
    type: string,
    handle: (e: Event) => void,
    forElement?: boolean,
  ) => {
    if (!elRef.current) return;
    (forElement ? elRef.current : window).removeEventListener(
      type,
      handle as EventListener,
    );
  };

  const addListener = (
    type: string,
    handle: (e: Event) => void,
    forElement?: boolean,
  ) => {
    if (!elRef.current) return;
    (forElement ? elRef.current : window).addEventListener(
      type,
      handle as EventListener,
    );
  };

  useEffect(() => {
    if (eventType === EventType.None) {
      return;
    }
    if (eventType === EventType.Hover) {
      addListener("mouseover", handleMouseover, true);
      addListener("mouseout", handleMouseout, true);
      return () => {
        removeListener("mouseover", handleMouseover, true);
        removeListener("mouseout", handleMouseout, true);
      };
    }
    if (eventType === EventType.RightClick) {
      addListener("contextmenu", handleRightClick, true);
      return () => {
        removeListener("contextmenu", handleDoubleClick, true);
      };
    }
    addListener("mousedown", handleTouchStart, true);
    addListener("mouseup", handleTouchEnd);
    addListener("touchstart", handleTouchStart, true);
    addListener("touchend", handleTouchEnd);

    return () => {
      listenMove(false);
      removeListener("mousedown", handleTouchStart, true);
      removeListener("mouseup", handleTouchEnd);
      removeListener("touchstart", handleTouchStart, true);
      removeListener("touchend", handleTouchEnd);
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
