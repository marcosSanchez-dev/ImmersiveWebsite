import { Camera, Renderer, Transform } from "ogl";
import Home from "./Home";
import About from "./About";

export default class Canvas {
  constructor({ template }) {
    this.template = template;
    this.x = {
      start: 0,
      distance: 0,
      end: 0,
    };

    this.y = {
      start: 0,
      distance: 0,
      end: 0,
    };

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();

    this.onChangeEnd(this.template);
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
    }); // el primer paso es crear el RENDERER

    this.gl = this.renderer.gl;

    document.body.appendChild(this.gl.canvas); // agregamos nuestro canvas al body de nuestro proyecto
  }

  createCamera() {
    this.camera = new Camera(this.gl); //el segundo paso es crear la CAMERA
    this.camera.position.z = 5; //fijar su posicion despues de crearla
  }

  createScene() {
    this.scene = new Transform();
  }

  createHome() {
    this.home = new Home({ gl: this.gl, scene: this.scene, sizes: this.sizes });
  }

  destroyHome() {
    if (!this.home) return;
    this.home.destroy();
    this.home = null;
  }

  createAbout() {
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    });
  }

  destroyAbout() {
    if (!this.about) return;

    this.about.destroy();
    this.about = null;
  }

  createCollections() {
    // this.collections = new Collections({
    //   gl: this.gl,
    //   scene: this.scene,
    //   sizes: this.sizes,
    //   transition: this.transition,
    // });
  }

  destroyCollections() {
    // if (!this.collections) return;
    // this.collections.destroy();
    // this.collections = null;
  }

  onChangeEnd(template) {
    if (template === "about") {
      this.createAbout();
    } else {
      this.destroyAbout();
    }

    if (template === "home") {
      this.createHome();
    } else {
      this.destroyHome();
    }
  }

  onChangeStart(template, url) {
    if (this.home) {
      this.home.hide();
    }

    if (this.collections) {
      this.collections.hide();
    }

    if (this.detail) {
      this.detail.hide();
    }

    if (this.about) {
      this.about.hide();
    }

    // this.isFromCollectionsToDetail = this.template === 'collections' && url.indexOf('detail') > -1; // prettier-ignore
    // this.isFromDetailToCollections = this.template === 'detail' && url.indexOf('collections') > -1; // prettier-ignore

    // if (this.isFromCollectionsToDetail || this.isFromDetailToCollections) {
    //   this.transition = new Transition({
    //     gl: this.gl,
    //     scene: this.scene,
    //     sizes: this.sizes,
    //     url,
    //   });

    //   this.transition.setElement(this.collections || this.detail);
    // }
  }

  onChangeEnd(template) {
    if (template === "home") {
      this.createHome();
    } else {
      this.destroyHome();
    }

    if (template === "about") {
      this.createAbout();
    } else if (this.about) {
      this.destroyAbout();
    }

    if (template === "detail") {
      this.createDetail();
    } else if (this.detail) {
      this.destroyDetail();
    }

    if (template === "collections") {
      this.createCollections();
    } else if (this.collections) {
      this.destroyCollections();
    }

    this.template = template;
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight,
    });

    //formulas preestablecidas para asignar un tamaño a las imagenes y utilizas la instancia CAMERA de ogl
    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.sizes = {
      height,
      width,
    };

    const values = { sizes: this.sizes };

    if (this.about) {
      this.about.onResize(values);
    }

    if (this.home) {
      this.home.onResize(values);
    }
  }

  onTouchDown(e) {
    this.isDown = true;

    this.x.start = e.touches ? e.touches[0].clientX : e.clientX; // toches es un array conformado por los puntos donde el usario toco la pantalla
    this.y.start = e.touches ? e.touches[0].clientY : e.clientY;

    const values = { x: this.x, y: this.y };

    if (this.about) {
      this.about.onTouchDown(values);
    }

    if (this.home) {
      this.home.onTouchDown(values);
    }
  }

  onTouchMove(e) {
    // La condicion debe ser true para que el RETURN se dispare.
    if (!this.isDown) return; // se dispara la accion solo cuando el mouse sea oprimido para hacer el efecto drag and drop.
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    this.x.end = x;
    this.y.end = y;

    const values = { x: this.x, y: this.y };

    if (this.about) {
      this.about.onTouchMove(values);
    }

    if (this.home) {
      this.home.onTouchMove(values);
    }
  }

  onTouchUp(e) {
    this.isDown = false;
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    this.x.end = x; // es END porque termina la interaccion de Drag & drop
    this.y.end = y;

    const values = { x: this.x, y: this.y };

    if (this.about) {
      this.about.onTouchUp(values);
    }

    if (this.home) {
      this.home.onTouchUp(values);
    }
  }

  onWheel(e) {
    if (this.home) {
      this.home.onWheel(e);
    }

    if (this.collections) {
      this.collections.onWheel(e);
    }
  }

  //esta funcion UPDATE es llamada en cada Frame
  update(scroll) {
    if (this.about) {
      this.about.update(scroll);
    }
    if (this.home) {
      this.home.update();
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
