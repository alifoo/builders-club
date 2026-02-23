import { useState, useCallback } from "react";
import init, {
    grayscale_raw,
    sepia_raw,
    invert_raw,
    blur_raw,
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

function runWasmFilter(pixels: Uint8Array, fn: (ptr: number, len: number) => void): Uint8Array {
    const len = pixels.length;
    const ptr = alloc_buffer(len);

    const wasmView = new Uint8Array(wasmInstance!.memory.buffer, ptr, len);
    wasmView.set(pixels);

    fn(ptr, len);

    const freshView = new Uint8Array(wasmInstance!.memory.buffer, ptr, len);
    const result = new Uint8Array(freshView);
    free_buffer(ptr, len);
    return result;
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

function sepiaJS(data: Uint8Array): Uint8Array {
    const output = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        output[i] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
        output[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
        output[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
        output[i + 3] = data[i + 3];
    }
    return output;
}

function invertJS(data: Uint8Array): Uint8Array {
    const output = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i += 4) {
        output[i] = 255 - data[i];
        output[i + 1] = 255 - data[i + 1];
        output[i + 2] = 255 - data[i + 2];
        output[i + 3] = data[i + 3];
    }
    return output;
}

function blurJS(data: Uint8Array, width: number, height: number, radius: number): Uint8Array {
    const output = new Uint8Array(data.length);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sumR = 0, sumG = 0, sumB = 0, count = 0;
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = (ny * width + nx) * 4;
                        sumR += data[idx];
                        sumG += data[idx + 1];
                        sumB += data[idx + 2];
                        count++;
                    }
                }
            }
            const idx = (y * width + x) * 4;
            output[idx] = (sumR / count) | 0;
            output[idx + 1] = (sumG / count) | 0;
            output[idx + 2] = (sumB / count) | 0;
            output[idx + 3] = data[idx + 3];
        }
    }
    return output;
}

const grayscaleWasm = (pixels: Uint8Array) => runWasmFilter(pixels, grayscale_raw);
const sepiaWasm = (pixels: Uint8Array) => runWasmFilter(pixels, sepia_raw);
const invertWasm = (pixels: Uint8Array) => runWasmFilter(pixels, invert_raw);

function blurWasm(pixels: Uint8Array, width: number, height: number, radius: number): Uint8Array {
    const len = pixels.length;
    const ptr = alloc_buffer(len);

    const wasmView = new Uint8Array(wasmInstance!.memory.buffer, ptr, len);
    wasmView.set(pixels);

    blur_raw(ptr, width, height, radius);

    const freshView = new Uint8Array(wasmInstance!.memory.buffer, ptr, len);
    const result = new Uint8Array(freshView);
    free_buffer(ptr, len);
    return result;
}

type FilterFn = (data: Uint8Array, width: number, height: number) => Uint8Array | void;

function processImage(
    originalSrc: string,
    filterFn: FilterFn,
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
        const result = filterFn(pixels, canvas.width, canvas.height);
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

const BLUR_RADIUS = 8;

export function useImageFilter(originalSrc: string) {
    const [currentSrc, setCurrentSrc] = useState(originalSrc);

    const run = useCallback(async (filterFn: FilterFn, label: string) => {
        await ensureWasmInit();
        processImage(originalSrc, filterFn, label, setCurrentSrc);
    }, [originalSrc]);

    const applyGrayscaleWasm = useCallback(() => run(grayscaleWasm, "WASM grayscale"), [run]);
    const applyGrayscaleJS = useCallback(() => run(grayscaleJS, "JS grayscale"), [run]);
    const applySepiaWasm = useCallback(() => run(sepiaWasm, "WASM sepia"), [run]);
    const applySepiaJS = useCallback(() => run(sepiaJS, "JS sepia"), [run]);
    const applyInvertWasm = useCallback(() => run(invertWasm, "WASM invert"), [run]);
    const applyInvertJS = useCallback(() => run(invertJS, "JS invert"), [run]);

    const applyBlurWasm = useCallback(() =>
        run((d, w, h) => blurWasm(d, w, h, BLUR_RADIUS), "WASM blur"), [run]);
    const applyBlurJS = useCallback(() =>
        run((d, w, h) => blurJS(d, w, h, BLUR_RADIUS), "JS blur"), [run]);

    const resetFilter = useCallback(() => {
        setCurrentSrc(originalSrc);
    }, [originalSrc]);

    return {
        currentSrc,
        applyGrayscaleWasm, applyGrayscaleJS,
        applySepiaWasm, applySepiaJS,
        applyInvertWasm, applyInvertJS,
        applyBlurWasm, applyBlurJS,
        resetFilter,
    };
}
