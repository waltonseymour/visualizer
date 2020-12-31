use std::cell::RefCell;
use std::f64;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f64(i: f64);

}

fn window() -> web_sys::Window {
    web_sys::window().expect("no global `window` exists")
}

fn request_animation_frame(f: &Closure<dyn FnMut()>) {
    window()
        .request_animation_frame(f.as_ref().unchecked_ref())
        .expect("should register `requestAnimationFrame` OK");
}

async fn load_and_play_file() -> Result<web_sys::AnalyserNode, JsValue> {
    let document = web_sys::window().unwrap().document().unwrap();

    let file_input: web_sys::HtmlInputElement = document
        .get_element_by_id("file-input")
        .unwrap()
        .dyn_into::<web_sys::HtmlInputElement>()
        .map_err(|_| ())
        .unwrap();

    let file: web_sys::File = file_input.files().unwrap().get(0).unwrap();

    let audio_ctx = web_sys::AudioContext::new()?;

    let ab: js_sys::ArrayBuffer = wasm_bindgen_futures::JsFuture::from(file.array_buffer())
        .await?
        .dyn_into()
        .unwrap();

    let buf: web_sys::AudioBuffer =
        wasm_bindgen_futures::JsFuture::from(audio_ctx.decode_audio_data(&ab).unwrap())
            .await?
            .dyn_into()
            .unwrap();

    let source = audio_ctx.create_buffer_source().unwrap();

    source.set_buffer(Some(&buf));

    let analyser = audio_ctx.create_analyser()?;
    analyser.set_fft_size(2048);

    source.connect_with_audio_node(&analyser)?;
    analyser.connect_with_audio_node(&audio_ctx.destination())?;

    source.start()?;

    Ok(analyser)
}

const sliceWidth: f64 = 2.0 * f64::consts::PI / 2048.0;

struct visualizer {
    height: u32,
    width: u32,
    ctx: web_sys::CanvasRenderingContext2d,
    buf: [u8; 2048],
}

impl visualizer {
    fn draw(&self, i: u32) {
        self.ctx.set_fill_style(&"rgb(0, 0, 0)".into());
        self.ctx
            .fill_rect(0., 0., f64::from(self.width), f64::from(self.height));
        self.ctx.set_line_width(10.);
        self.ctx.set_fill_style(
            &format!(
                "rgb({}, {}, {})",
                ((i as f32 / 500.).sin() * 255.).abs(),
                ((i as f32 / 300.).sin() * 255.).abs(),
                ((i as f32 / 100.).sin() * 255.).abs(),
            )
            .into(),
        );

        let mut initialRadius = 0.;

        let mut theta = 0.;
        for i in 0..2048 {
            theta += sliceWidth;
            let amp = f64::from(self.buf[i]) / 256.0;

            let r = amp * self.height as f64 * 0.2 + f64::from(self.height * 1 / 6);

            let x = f64::from(self.width / 2) + theta.cos() * r;
            let y = f64::from(self.height / 2) + theta.sin() * r;

            self.ctx.begin_path();
            self.ctx.arc(x, y, 3., 0., 2. * f64::consts::PI).unwrap();
            self.ctx.fill();
        }
    }
}

// This function is automatically invoked after the wasm module is instantiated.
#[wasm_bindgen]
pub async fn run() -> Result<(), JsValue> {
    let analyser = load_and_play_file().await?;

    let document = web_sys::window().unwrap().document().unwrap();

    let canvas = document.get_element_by_id("canvas").unwrap();
    let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

    let context = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();

    let mut vis = visualizer {
        height: canvas.height(),
        width: canvas.width(),
        ctx: context,
        buf: [0; 2048],
    };

    let f = Rc::new(RefCell::new(None));
    let g = f.clone();

    let mut i = 0;
    *g.borrow_mut() = Some(Closure::wrap(Box::new(move || {
        i += 1;
        analyser.get_byte_time_domain_data(&mut vis.buf);
        vis.draw(i);

        // Schedule ourself for another requestAnimationFrame callback.
        request_animation_frame(f.borrow().as_ref().unwrap());
    }) as Box<dyn FnMut()>));
    request_animation_frame(g.borrow().as_ref().unwrap());

    Ok(())
}
