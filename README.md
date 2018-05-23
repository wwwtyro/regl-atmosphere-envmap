# regl-atmosphere-envmap

Easily generate an environment map, or skybox, of Earth atmosphere given a 3D vector representing the direction of the
sun.

<p align="center">
  <img src="https://github.com/wwwtyro/regl-atmosphere-envmap/raw/master/example.png">
</p>

## Install

```
npm install regl-atmosphere-envmap
```

## Usage

```js
const createAtmosphereRenderer = require("regl-atmosphere-envmap");

const renderAtmosphere = createAtmosphereRenderer(regl);

const envMap = renderAtmosphere(opts);
```

`createAtmosphereRenderer` takes a regl context as a parameter, and returns the function `renderAtmosphere`.

`renderAtmosphere` takes an `opts` parameter and returns a regl framebufferCube object that can be immediately used as
a `samplerCube` in your shaders, or passed back into the `renderAtmosphere` function to update it.

The `opts` parameter is an object with the following members:

* **sunDirection**: the vector that points from the origin to the sun, 3D vector, default [0, 0.25, -1.0]
* **resolution**: the resolution of each square face of the environment cubemap if `cubeFBO` is not provided, int, default 1024
* **cubeFBO**: the regl `framebufferCube` object that will be returned, default `regl.framebufferCube(opts.resolution)`
