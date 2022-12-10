import { Camera, Renderer, Transform } from "ogl";
import Home from "./Home";

export default class Canvas {
  constructor() {
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createHome();
  }

  createRenderer() {
    this.renderer = new Renderer(); // el primer paso es crear el RENDERER

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

  //esta funcion UPDATE es llamada en cada Frame
  update() {
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.01;

    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
