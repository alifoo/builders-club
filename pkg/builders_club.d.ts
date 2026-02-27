/* tslint:disable */
/* eslint-disable */

export function alloc_buffer(size: number): number;

export function blur_raw(
  ptr: number,
  width: number,
  height: number,
  radius: number,
): void;

export function free_buffer(ptr: number, size: number): void;

export function grayscale(data: Uint8Array): Uint8Array;

export function grayscale_in_place(data: Uint8Array): void;

export function grayscale_raw(ptr: number, len: number): void;

export function invert_raw(ptr: number, len: number): void;

export function sepia_raw(ptr: number, len: number): void;

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly alloc_buffer: (a: number) => number;
  readonly blur_raw: (a: number, b: number, c: number, d: number) => void;
  readonly free_buffer: (a: number, b: number) => void;
  readonly grayscale: (a: number, b: number) => [number, number];
  readonly grayscale_in_place: (a: number, b: number, c: any) => void;
  readonly grayscale_raw: (a: number, b: number) => void;
  readonly invert_raw: (a: number, b: number) => void;
  readonly sepia_raw: (a: number, b: number) => void;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput,
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
