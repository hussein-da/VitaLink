"use client";

import React, { useState, type ReactNode } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";

interface SmartPopoverProps {
  /** Trigger element. A single React element receives the ref and interaction
   *  props directly via cloneElement — no extra wrapper node in the DOM. */
  anchor: ReactNode;
  /** Floating overlay content */
  content: ReactNode;
  /** ARIA role: "tooltip" for read-only info, "dialog" for interactive content */
  role?: "tooltip" | "dialog";
  /** Barrierefreier Name des Overlays (z. B. "Datenherkunft"). */
  ariaLabel?: string;
  /** CSS/Tailwind classes for the floating element */
  className?: string;
}

/**
 * Collision-aware floating overlay backed by @floating-ui/react.
 *
 * Why FloatingPortal: renders the overlay at document.body, so no ancestor
 * overflow:hidden (device frame, card containers) can clip it.
 *
 * Middleware stack:
 *   offset(8)          — 8 px gap between anchor and overlay
 *   flip()             — flips to the opposite side when out of space
 *   shift({padding:12})— slides along the axis, keeping 12 px from each edge
 *
 * autoUpdate: repositions live on scroll, resize, and anchor movement.
 *
 * TEST NOTES — manually verify at:
 *   • Viewport < 320 px (shift keeps 12 px inset; check anchor tap target)
 *   • All four screen edges (flip repositions to opposite side)
 *   • While scrolling with the popover open (autoUpdate re-anchors)
 */
export default function SmartPopover({
  anchor,
  content,
  role = "tooltip",
  ariaLabel,
  className = "",
}: SmartPopoverProps) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top-start",
    middleware: [offset(8), flip(), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const roleInteraction = useRole(context, { role });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    roleInteraction,
  ]);

  // Inject ref + floating-ui interaction props into a single-element anchor
  // to keep the DOM clean. Falls back to a wrapper span for non-element anchors.
  const trigger = React.isValidElement(anchor)
    ? React.cloneElement(anchor as React.ReactElement<any>, {
        ref: refs.setReference,
        ...getReferenceProps((anchor as React.ReactElement<any>).props),
      })
    : (
      <span ref={refs.setReference} {...getReferenceProps()}>
        {anchor}
      </span>
    );

  const isDialog = role === "dialog";

  return (
    <>
      {trigger}
      {open && (
        <FloatingPortal>
          {isDialog ? (
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                aria-modal="false"
                aria-label={ariaLabel}
                {...getFloatingProps()}
                className={className}
              >
                {content}
              </div>
            </FloatingFocusManager>
          ) : (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              aria-label={ariaLabel}
              {...getFloatingProps()}
              className={className}
            >
              {content}
            </div>
          )}
        </FloatingPortal>
      )}
    </>
  );
}
