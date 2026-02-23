mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
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
