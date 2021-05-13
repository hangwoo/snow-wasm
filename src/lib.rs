mod utils;

use rand::Rng;
use wasm_bindgen::prelude::*;
use std::ops::Range;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
struct SnowCanvas {
    width: u32,
    height: u32,
    count: u32,
    angle: f32,
    particles: Vec<[f32; 4]>,
}

#[wasm_bindgen]
impl SnowCanvas {
    pub fn new(width: u32, height: u32, count: u32) -> Self {
        let mut particles:Vec<[f32; 4]> = vec![];
        fn get_random() -> f32 {
            let mut rng = rand::thread_rng();
            rng.gen_range(0.0..1.0)
        }
        for _ in 0..count {
            let particle:[f32; 4] = [
                width as f32 * get_random(),
                height as f32 * get_random(),
                get_random(),
                count as f32 * get_random(),
            ];
            particles.push(particle);
        }
        SnowCanvas {
            width,
            height,
            count,
            angle: 0.01,
            particles,
        }
    }
}

#[cfg(test)]
mod tests {

}