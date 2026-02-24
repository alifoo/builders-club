import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[500] select-none">
      <Cursor />
    </div>
  );
}

const Cursor = () => {
  const pointer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.set(pointer.current, {
      xPercent: -50,
      yPercent: -50,
    });
  }, []);

  useEffect(() => {
    const setCursorX = gsap.quickTo(pointer.current, "x", {
      duration: 0.3,
      ease: "power3",
    });
    const setCursorY = gsap.quickTo(pointer.current, "y", {
      duration: 0.3,
      ease: "power3",
    });

    const onPointerMove = (e: PointerEvent) => {
      setCursorX(e.clientX);
      setCursorY(e.clientY);
    };

    document.body.addEventListener("pointermove", onPointerMove);
    return () => {
      document.body.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div
      ref={pointer}
      className="pointer-events-none absolute size-4 opacity-80 rounded-md overflow-hidden ease-in-out border-1 border-gray-900"
    ></div>
  );
};
