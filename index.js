"use strict";

const glsl = require("glslify");
const createCube = require("primitive-cube");
const unindex = require("unindex-mesh");

const renderEnvMap = require("regl-render-envmap");

module.exports = function createAtmosphereRenderer(regl) {
  const cube = unindex(createCube(1));

  const envmapCommand = regl({
    vert: glsl`
      precision highp float;

      attribute vec3 position;

      uniform mat4 view, projection;

      varying vec3 pos;

      void main() {
        gl_Position = projection * view * vec4(position, 1);
        pos = position;
      }
    `,
    frag: glsl`
      precision highp float;

      uniform vec3 sundir;

      varying vec3 pos;

      #pragma glslify: atmosphere = require(glsl-atmosphere)

      void main() {
        vec3 color = atmosphere(
          normalize(pos),
          vec3(0,6372e3,0),
          normalize(sundir),
          22.0,
          6371e3,
          6471e3,
          vec3(5.5e-6, 13.0e-6, 22.4e-6),
          21e-6,
          8e3,
          1.2e3,
          0.758
        );

        gl_FragColor = vec4(color, 1);
      }
    `,
    attributes: {
      position: cube,
    },
    uniforms: {
      sundir: regl.prop("sundir"),
      view: regl.prop("view"),
      projection: regl.prop("projection"),
    },
    viewport: regl.prop("viewport"),
    framebuffer: regl.prop("framebuffer"),
    count: cube.length / 3,
  });

  function renderer(config) {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
      framebuffer: config.framebuffer,
    });
    envmapCommand({
      view: config.view,
      projection: config.projection,
      viewport: config.viewport,
      framebuffer: config.framebuffer,
      sundir: [0, 0.25, -1],
    });
  }

  function render(opts) {
    opts = opts || {};
    opts.sunDirection =
      opts.sunDirection === undefined ? [0, 0.25, -1] : opts.sunDirection;
    opts.resolution = opts.resolution === undefined ? 1024 : opts.resolution;
    return renderEnvMap(regl, renderer, {
      resolution: opts.resolution,
      cubeFBO: opts.cubeFBO,
    });
  }

  return render;
};
