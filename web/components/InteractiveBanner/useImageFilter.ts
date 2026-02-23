import { useState, useCallback } from "react";
import init, {
    grayscale_raw,
    alloc_buffer,
    free_buffer,
    type InitOutput,
} from "../../../pkg/building_club";

let wasmInstance: InitOutput | null = null;
let wasmReady: Promise<void> | null = null;

function ensureWasmInit() {
    if (!wasmReady) {
        wasmReady = init().then((instance) => {
            wasmInstance = instance;
        });
    }
    return wasmReady;
}

function grayscaleJS(data: Uint8Array): Uint8Array {
    const output = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        output[i] = gray;
        output[i + 1] = gray;
        output[i + 2] = gray;
        output[i + 3] = data[i + 3];
    }
    return output;
}

function grayscaleWasmZeroCopy(pixels: Uint8Array): Uint8Array {
    const len = pixels.length;

    const ptr = alloc_buffer(len);

    const wasmView = new Uint8Array(wasmInstance!.memory.buffer, ptr, len);
    wasmView.set(pixels);

    grayscale_raw(ptr, len);

    const freshView = new Uint8Array(wasmInstance!.memory.buffer, ptr, len);

    const result = new Uint8Array(freshView);

    free_buffer(ptr, len);

    return result;
}

function processImage(
    originalSrc: string,
    filterFn: (data: Uint8Array) => Uint8Array | void,
    label: string,
    onDone: (src: string) => void
) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const totalStart = performance.now();

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = new Uint8Array(imageData.data.buffer);

        const filterStart = performance.now();
        const result = filterFn(pixels);
        const filterElapsed = performance.now() - filterStart;

        const outputData = result ?? pixels;

        const newImageData = new ImageData(
            new Uint8ClampedArray(outputData),
            canvas.width,
            canvas.height
        );
        ctx.putImageData(newImageData, 0, 0);

        canvas.toBlob((blob) => {
            const totalElapsed = performance.now() - totalStart;
            console.log(
                `[${label}] ${canvas.width}x${canvas.height} (${pixels.length} bytes) — filter: ${filterElapsed.toFixed(2)}ms, total: ${totalElapsed.toFixed(2)}ms`
            );
            onDone(URL.createObjectURL(blob!));
        }, "image/jpeg", 0.92);
    };
    img.src = originalSrc;
}

export function useImageFilter(originalSrc: string) {
    const [currentSrc, setCurrentSrc] = useState(originalSrc);

    const applyGrayscaleWasm = useCallback(async () => {
        await ensureWasmInit();
        processImage(originalSrc, grayscaleWasmZeroCopy, "WASM grayscale", setCurrentSrc);
    }, [originalSrc]);

    const applyGrayscaleJS = useCallback(() => {
        processImage(originalSrc, grayscaleJS, "JS grayscale", setCurrentSrc);
    }, [originalSrc]);

    const resetFilter = useCallback(() => {
        setCurrentSrc(originalSrc);
    }, [originalSrc]);

    return { currentSrc, applyGrayscaleWasm, applyGrayscaleJS, resetFilter };
}
