mod utils;

use wasm_bindgen::prelude::*;
use std::ops::Range;
use rand::Rng;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
struct Particle {
    x: f32,
    y: f32,
    r: f32,
    d: f32,
}

#[wasm_bindgen]
struct SnowCanvas {
    width: u32,
    height: u32,
    count: u32,
    angle: f32,
    particles: Vec<Particle>,
}

#[wasm_bindgen]
impl Particle {
    pub fn update(&mut self, angle: f32, width: u32, height: u32) {
        self.y += (angle + self.d).cos() - 0.5 + self.r / 1.5;
        self.x += angle.sin() * 1.5;
        // TODO
    }
}

#[wasm_bindgen]
impl SnowCanvas {
    pub fn new(width: u32, height: u32, count: u32) -> Self {
        let mut particles:Vec<Particle> = vec![];
        for _ in 0..count {
            let particle = Particle {
                x: width as f32 * SnowCanvas::get_random(),
                y: height as f32 * SnowCanvas::get_random(),
                r: SnowCanvas::get_random(),
                d: count as f32 * SnowCanvas::get_random(),
            };
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

    fn get_random() -> f32 {
        let mut rng = rand::thread_rng();
        rng.gen_range(0.0, 1.0)
    }

    pub fn update(&mut self) {
        self.angle += 0.01;
        for index in 0..self.count {
            self.particles[index as usize].update(self.angle, self.width, self.height);
        }
    }

    pub fn get_particle_x(&self, index: usize) -> f32 {
        self.particles[index].x
    }

    pub fn get_particle_y(&self, index: usize) -> f32 {
        self.particles[index].y
    }

    pub fn get_particle_d(&self, index: usize) -> f32 {
        self.particles[index].d
    }

    pub fn get_particle_r(&self, index: usize) -> f32 {
        self.particles[index].r
    }
}

#[cfg(test)]
mod test {
    use crate::SnowCanvas;

    #[test]
    fn particles_update_test() {
        let mut snow_canvas = SnowCanvas::new(
            10,
            10,
            25,
        );
        let x = snow_canvas.get_particle_x(0);
        let y = snow_canvas.get_particle_y(0);
        let d = snow_canvas.get_particle_d(0);
        let r = snow_canvas.get_particle_r(0);
        snow_canvas.update();
        let x2 = snow_canvas.get_particle_x(0);
        let y2 = snow_canvas.get_particle_y(0);
        let d2 = snow_canvas.get_particle_d(0);
        let r2 = snow_canvas.get_particle_r(0);

        assert_ne!(x, x2);
        assert_ne!(y, y2);
        assert_ne!(d, d2);
        assert_ne!(r, r2);
    }
}