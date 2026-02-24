import { useState, useCallback, useRef } from "react";
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

function ensureWasmInit(): Promise<void> {
  if (!wasmReady) {
    wasmReady = init().then((instance) => {
      wasmInstance = instance;
    });
  }
  return wasmReady;
}

const BLUR_RADIUS = 8;

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
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
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

function blurJS(
  data: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  const output = new Uint8Array(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sumR = 0,
        sumG = 0,
        sumB = 0,
        count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx,
            ny = y + dy;
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

function executeWasmFilter(
  pixels: Uint8Array,
  width: number,
  height: number,
  filterName: "grayscale" | "sepia" | "invert" | "blur",
): Uint8Array {
  const len = pixels.length;

  // Alocamos memória com o length dos pixels
  const ptr = alloc_buffer(len);

  // Escrevemos os pixels originais na memória do WASM
  const wasmView = new Uint8Array(wasmInstance!.memory.buffer, ptr, len);
  wasmView.set(pixels);

  // Chamamos a função do Rust
  if (filterName === "grayscale") grayscale_raw(ptr, len);
  else if (filterName === "sepia") sepia_raw(ptr, len);
  else if (filterName === "invert") invert_raw(ptr, len);
  else if (filterName === "blur") blur_raw(ptr, width, height, BLUR_RADIUS);

  // Lemos os pixels processados, salvamos e limpamos a memória
  const freshView = new Uint8Array(wasmInstance!.memory.buffer, ptr, len);

  // Cópia para o js antes do free
  const result = new Uint8Array(freshView);
  free_buffer(ptr, len);

  return result;
}

// Contrato da função anônima que vamos injetar no processImage
type FilterFn = (
  data: Uint8Array,
  width: number,
  height: number,
) => Uint8Array | void;

function processImage(
  originalSrc: string,
  label: string,
  filterFn: FilterFn,
  onDone: (
    src: string,
    metrics: { label: string; filterTime: number; totalTime: number },
  ) => void,
) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const totalStart = performance.now();

    // Preparamos o canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    // extraímos os pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = new Uint8Array(imageData.data.buffer);

    const filterStart = performance.now();
    // aqui, chamamos a função de filtro injetada, que pode ser tanto a versão JS quanto a WASM
    const result = filterFn(pixels, canvas.width, canvas.height);
    const filterElapsed = performance.now() - filterStart;

    // E então atualizamos a imagem
    const outputData = result ?? pixels;

    // a api do canvas exige um Uint8ClampedArray pra não quebrar a renderização
    const newImageData = new ImageData(
      new Uint8ClampedArray(outputData),
      canvas.width,
      canvas.height,
    );
    ctx.putImageData(newImageData, 0, 0);

    canvas.toBlob(
      (blob) => {
        const totalElapsed = performance.now() - totalStart;
        // onDone é o callback que vai atualizar o src da imagem no React, usando o URL criado a partir do blob do canvas
        onDone(URL.createObjectURL(blob!), {
          label,
          filterTime: filterElapsed,
          totalTime: totalElapsed,
        });
      },
      "image/jpeg",
      0.92,
    );
  };
  img.src = originalSrc;
}

export function useImageFilter(originalSrc: string) {
  const [baseSrc, setBaseSrc] = useState(originalSrc);
  const [currentSrc, setCurrentSrc] = useState(originalSrc);
  const [metrics, setMetrics] = useState<{
    label: string;
    filterTime: number;
    totalTime: number;
  } | null>(null);

  const baseSrcRef = useRef(baseSrc);
  baseSrcRef.current = baseSrc;

  const applyGrayscaleWasm = useCallback(async () => {
    await ensureWasmInit();
    processImage(
      baseSrcRef.current,
      "WASM Grayscale",
      (data, w, h) => executeWasmFilter(data, w, h, "grayscale"),
      (newSrc, newMetrics) => {
        setCurrentSrc(newSrc);
        setMetrics(newMetrics);
      },
    );
  }, []);

  const applyGrayscaleJS = useCallback(async () => {
    await ensureWasmInit();
    processImage(
      baseSrcRef.current,
      "JS Grayscale",
      (data) => grayscaleJS(data),
      (newSrc, newMetrics) => {
        setCurrentSrc(newSrc);
        setMetrics(newMetrics);
      },
    );
  }, []);

  const applySepiaWasm = useCallback(async () => {
    await ensureWasmInit();
    processImage(
      baseSrcRef.current,
      "WASM Sepia",
      (data, w, h) => executeWasmFilter(data, w, h, "sepia"),
      (newSrc, newMetrics) => {
        setCurrentSrc(newSrc);
        setMetrics(newMetrics);
      },
    );
  }, []);

  const applySepiaJS = useCallback(async () => {
    await ensureWasmInit();
    processImage(
      baseSrcRef.current,
      "JS Sepia",
      (data) => sepiaJS(data),
      (newSrc, newMetrics) => {
        setCurrentSrc(newSrc);
        setMetrics(newMetrics);
      },
    );
  }, []);

  const applyInvertWasm = useCallback(async () => {
    await ensureWasmInit();
    processImage(
      baseSrcRef.current,
      "WASM Invert",
      (data, w, h) => executeWasmFilter(data, w, h, "invert"),
      (newSrc, newMetrics) => {
        setCurrentSrc(newSrc);
        setMetrics(newMetrics);
      },
    );
  }, []);

  const applyInvertJS = useCallback(async () => {
    await ensureWasmInit();
    processImage(
      baseSrcRef.current,
      "JS Invert",
      (data) => invertJS(data),
      (newSrc, newMetrics) => {
        setCurrentSrc(newSrc);
        setMetrics(newMetrics);
      },
    );
  }, []);

  const applyBlurWasm = useCallback(async () => {
    await ensureWasmInit();
    processImage(
      baseSrcRef.current,
      "WASM Blur",
      (data, w, h) => executeWasmFilter(data, w, h, "blur"),
      (newSrc, newMetrics) => {
        setCurrentSrc(newSrc);
        setMetrics(newMetrics);
      },
    );
  }, []);

  const applyBlurJS = useCallback(async () => {
    await ensureWasmInit();
    processImage(
      baseSrcRef.current,
      "JS Blur",
      (data, w, h) => blurJS(data, w, h, BLUR_RADIUS),
      (newSrc, newMetrics) => {
        setCurrentSrc(newSrc);
        setMetrics(newMetrics);
      },
    );
  }, []);

  const resetFilter = useCallback(() => {
    setCurrentSrc(baseSrcRef.current);
    setMetrics(null);
  }, []);

  const uploadImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setBaseSrc(url);
    setCurrentSrc(url);
    setMetrics(null);
  }, []);

  return {
    currentSrc,
    metrics,
    setMetrics,
    applyGrayscaleWasm,
    applyGrayscaleJS,
    applySepiaWasm,
    applySepiaJS,
    applyInvertWasm,
    applyInvertJS,
    applyBlurWasm,
    applyBlurJS,
    resetFilter,
    uploadImage,
  };
}
