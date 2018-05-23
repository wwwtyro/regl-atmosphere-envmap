"use strict";

const glsl = require("glslify");
const REGL = require("regl");
const createCube = require("primitive-cube");
const unindex = require("unindex-mesh");
const mat4 = require("gl-matrix").mat4;

const createAtmosphereRenderer = require("./index");

const regl = REGL();

const cube = unindex(createCube(1));

const renderAtmosphere = createAtmosphereRenderer(regl);
const envMap = renderAtmosphere({
  sunDirection: [0, 0.25, -1],
});

const skyboxCommand = regl({
  vert: glsl`
    precision highp float;
    attribute vec3 position;
    uniform mat4 model, view, projection;
    varying vec3 pos;
    void main() {
      gl_Position = projection * view * model * vec4(position, 1);
      pos = position;
    }
  `,
  frag: glsl`
    precision highp float;
    uniform samplerCube envMap;
    varying vec3 pos;
    void main() {
      gl_FragColor = textureCube(envMap, normalize(pos));
    }
  `,
  attributes: {
    position: cube,
  },
  uniforms: {
    model: regl.prop("model"),
    view: regl.prop("view"),
    projection: regl.prop("projection"),
    envMap: regl.prop("envMap"),
  },
  viewport: regl.prop("viewport"),
  count: cube.length / 3,
});

function loop() {
  const t = performance.now();
  const model = mat4.create();
  mat4.rotateY(model, model, t * 0.002);
  const view = mat4.lookAt([], [0, 1, 2], [0, 0, 0], [0, 1, 0]);
  const projection = mat4.perspective(
    [],
    Math.PI / 3,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  regl.clear({
    color: [1, 1, 1, 1],
    depth: 1,
  });

  skyboxCommand({
    model: model,
    view: view,
    projection: projection,
    envMap: envMap,
    viewport: {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    },
  });

  requestAnimationFrame(loop);
}

loop();
