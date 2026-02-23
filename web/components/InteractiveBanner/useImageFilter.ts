import { useState, useCallback } from "react";
import init, { grayscale } from "../../../pkg/building_club";

let wasmReady: Promise<void> | null = null;
function ensureWasmInit() {
    if (!wasmReady) {
        wasmReady = init().then(() => { });
    }
    return wasmReady;
}

export function useImageFilter(originalSrc: string) {
    const [currentSrc, setCurrentSrc] = useState(originalSrc);

    const applyGrayscale = useCallback(async () => {
        await ensureWasmInit();

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const filtered = grayscale(new Uint8Array(imageData.data.buffer));

            const newImageData = new ImageData(
                new Uint8ClampedArray(filtered),
                canvas.width,
                canvas.height
            );
            ctx.putImageData(newImageData, 0, 0);

            setCurrentSrc(canvas.toDataURL());
        };
        img.src = originalSrc;
    }, [originalSrc]);

    const resetFilter = useCallback(() => {
        setCurrentSrc(originalSrc);
    }, [originalSrc]);

    return { currentSrc, applyGrayscale, resetFilter };
}
