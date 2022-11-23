import GSAP from "gsap";

class Colors {
  constructor() {}
  change({ backgroundColor, color }) {
    // documentElement hace referencia al elemento 'html' del DOM
    GSAP.to(document.documentElement, {
      backgroundColor,
      color,
      duration: 1.5,
    });
  }
}

export const ColorsManager = new Colors();
