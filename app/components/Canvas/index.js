import { Camera, Renderer, Transform } from "ogl";
import Home from "./Home";

export default class Canvas {
  constructor() {
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
    this.createHome();
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

    if (this.home) {
      this.home.onResize({ sizes: this.sizes });
    }
  }

  onTouchDown(e) {
    this.isDown = true;

    this.x.start = e.touches ? e.touches[0].clientX : e.clientX; // toches es un array conformado por los puntos donde el usario toco la pantalla
    this.y.start = e.touches ? e.touches[0].clientY : e.clientY;

    if (this.home) {
      this.home.onTouchDown({ x: this.x, y: this.y });
    }
  }

  onTouchMove(e) {
    // La condicion debe ser true para que el RETURN se dispare.
    if (!this.isDown) return; // se dispara la accion solo cuando el mouse sea oprimido para hacer el efecto drag and drop.
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    this.x.end = x;
    this.y.end = y;

    if (this.home) {
      this.home.onTouchMove({ x: this.x, y: this.y });
    }
  }

  onTouchUp(e) {
    this.isDown = false;
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    this.x.end = x; // es END porque termina la interaccion de Drag & drop
    this.y.end = y;

    if (this.home) {
      this.home.onTouchUp({ x: this.x, y: this.y });
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
  update() {
    if (this.home) {
      this.home.update();
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
