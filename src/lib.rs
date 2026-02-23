mod utils;

use wasm_bindgen::prelude::*;
use std::alloc::{alloc, dealloc, Layout};

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn alloc_buffer(size: usize) -> *mut u8 {
    let layout = Layout::from_size_align(size, 1).unwrap();
    unsafe { alloc(layout) }
}

#[wasm_bindgen]
pub fn free_buffer(ptr: *mut u8, size: usize) {
    let layout = Layout::from_size_align(size, 1).unwrap();
    unsafe { dealloc(ptr, layout) }
}

#[wasm_bindgen]
pub fn grayscale_raw(ptr: *mut u8, len: usize) {
    let data = unsafe { std::slice::from_raw_parts_mut(ptr, len) };
    for pixel in data.chunks_exact_mut(4) {
        let r = pixel[0] as f32;
        let g = pixel[1] as f32;
        let b = pixel[2] as f32;

        let gray = (0.299 * r + 0.587 * g + 0.114 * b) as u8;

        pixel[0] = gray;
        pixel[1] = gray;
        pixel[2] = gray;
    }
}


// Standard luminance formula (ITU-R BT.601)
#[wasm_bindgen]
pub fn grayscale(data: &[u8]) -> Vec<u8> {
    let mut output = data.to_vec();

    for pixel in output.chunks_exact_mut(4) {
        let r = pixel[0] as f32;
        let g = pixel[1] as f32;
        let b = pixel[2] as f32;

        let gray = (0.299 * r + 0.587 * g + 0.114 * b) as u8;

        pixel[0] = gray;
        pixel[1] = gray;
        pixel[2] = gray;
    }

    output
}

// In-place version that still copies due to wasm-bindgen JS glue
#[wasm_bindgen]
pub fn grayscale_in_place(data: &mut [u8]) {
    for pixel in data.chunks_exact_mut(4) {
        let r = pixel[0] as f32;
        let g = pixel[1] as f32;
        let b = pixel[2] as f32;

        let gray = (0.299 * r + 0.587 * g + 0.114 * b) as u8;

        pixel[0] = gray;
        pixel[1] = gray;
        pixel[2] = gray;
    }
}
