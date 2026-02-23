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
        let r = pixel[0] as u32;
        let g = pixel[1] as u32;
        let b = pixel[2] as u32;

        let gray = ((299 * r + 587 * g + 114 * b) / 1000) as u8;

        pixel[0] = gray;
        pixel[1] = gray;
        pixel[2] = gray;
    }
}

#[wasm_bindgen]
pub fn sepia_raw(ptr: *mut u8, len: usize) {
    let data = unsafe { std::slice::from_raw_parts_mut(ptr, len) };
    for pixel in data.chunks_exact_mut(4) {
        let r = pixel[0] as u32;
        let g = pixel[1] as u32;
        let b = pixel[2] as u32;

        pixel[0] = ((393 * r + 769 * g + 189 * b) / 1000).min(255) as u8;
        pixel[1] = ((349 * r + 686 * g + 168 * b) / 1000).min(255) as u8;
        pixel[2] = ((272 * r + 534 * g + 131 * b) / 1000).min(255) as u8;
    }
}

#[wasm_bindgen]
pub fn invert_raw(ptr: *mut u8, len: usize) {
    let data = unsafe { std::slice::from_raw_parts_mut(ptr, len) };
    for pixel in data.chunks_exact_mut(4) {
        pixel[0] = 255 - pixel[0];
        pixel[1] = 255 - pixel[1];
        pixel[2] = 255 - pixel[2];
    }
}

#[wasm_bindgen]
pub fn blur_raw(ptr: *mut u8, width: usize, height: usize, radius: usize) {
    let len = width * height * 4;
    let data = unsafe { std::slice::from_raw_parts_mut(ptr, len) };
    let input = data.to_vec();
    let r = radius as isize;

    for y in 0..height {
        for x in 0..width {
            let mut sum_r: u32 = 0;
            let mut sum_g: u32 = 0;
            let mut sum_b: u32 = 0;
            let mut count: u32 = 0;

            for dy in -r..=r {
                for dx in -r..=r {
                    let nx = x as isize + dx;
                    let ny = y as isize + dy;

                    if nx >= 0 && nx < width as isize && ny >= 0 && ny < height as isize {
                        let idx = (ny as usize * width + nx as usize) * 4;
                        sum_r += input[idx] as u32;
                        sum_g += input[idx + 1] as u32;
                        sum_b += input[idx + 2] as u32;
                        count += 1;
                    }
                }
            }

            let idx = (y * width + x) * 4;
            data[idx] = (sum_r / count) as u8;
            data[idx + 1] = (sum_g / count) as u8;
            data[idx + 2] = (sum_b / count) as u8;
        }
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
