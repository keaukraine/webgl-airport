"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffuseTwoColoredShader = void 0;
const webgl_framework_1 = require("webgl-framework");
class DiffuseTwoColoredShader extends webgl_framework_1.DiffuseShader {
    constructor() {
        super(...arguments);
        this._color1 = [1, 1, 0, 0];
        this._color2 = [1, 1, 0, 0];
    }
    fillCode() {
        super.fillCode();
        this.fragmentShaderCode = `precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D sTexture;
            uniform vec4 color1;
            uniform vec4 color2;

            void main() {
                gl_FragColor = mix(color1, color2, texture2D(sTexture, vTextureCoord)[0]);
            }`;
    }
    fillUniformsAttributes() {
        super.fillUniformsAttributes();
        this.color1 = this.getUniform("color1");
        this.color2 = this.getUniform("color2");
    }
    setColor1(r, g, b, a) {
        this._color1 = [r, g, b, a];
    }
    setColor2(r, g, b, a) {
        this._color2 = [r, g, b, a];
    }
    drawModel(renderer, model, tx, ty, tz, rx, ry, rz, sx, sy, sz) {
        if (this.rm_Vertex === undefined || this.view_proj_matrix === undefined || this.color1 === undefined || this.color2 === undefined) {
            return;
        }
        const gl = renderer.gl;
        gl.uniform4f(this.color1, this._color1[0], this._color1[1], this._color1[2], this._color1[3]);
        gl.uniform4f(this.color2, this._color2[0], this._color2[1], this._color2[2], this._color2[3]);
        super.drawModel(renderer, model, tx, ty, tz, rx, ry, rz, sx, sy, sz);
    }
}
exports.DiffuseTwoColoredShader = DiffuseTwoColoredShader;
//# sourceMappingURL=DiffuseTwoColoredShader.js.map