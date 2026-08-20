"use client";

import { useEffect, type RefObject } from "react";

/**
 * Closes a popover on outside pointer-down or Escape.
 *
 * `pointerdown` rather than `click` so the panel dismisses before a click
 * inside another control fires — otherwise opening a second popover leaves
 * both briefly open.
 */
export function useDismissable(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) onDismiss();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, open, onDismiss]);
}
