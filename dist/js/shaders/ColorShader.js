"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorShader = void 0;
const webgl_framework_1 = require("webgl-framework");
class ColorShader extends webgl_framework_1.BaseShader {
    constructor() {
        super(...arguments);
        this._color = [1, 1, 0, 0];
    }
    fillCode() {
        this.vertexShaderCode = `precision highp float;
        attribute vec4 rm_Vertex;
        uniform mat4 view_proj_matrix;
        void main() {
            gl_Position = view_proj_matrix * rm_Vertex;
        }`;
        this.fragmentShaderCode = `precision mediump float;
        uniform vec4 color;

        void main() {
            gl_FragColor = color;
        }`;
    }
    setColor(r, g, b, a) {
        this._color = [r, g, b, a];
    }
    fillUniformsAttributes() {
        this.rm_Vertex = this.getAttrib("rm_Vertex");
        this.view_proj_matrix = this.getUniform("view_proj_matrix");
        this.color = this.getUniform("color");
    }
    drawModel(renderer, model, tx, ty, tz, rx, ry, rz, sx, sy, sz) {
        if (this.rm_Vertex === undefined || this.view_proj_matrix === undefined || this.color === undefined) {
            return;
        }
        const gl = renderer.gl;
        model.bindBuffers(gl);
        gl.enableVertexAttribArray(this.rm_Vertex);
        gl.vertexAttribPointer(this.rm_Vertex, 3, gl.FLOAT, false, 4 * 3, 0);
        renderer.calculateMVPMatrix(tx, ty, tz, rx, ry, rz, sx, sy, sz);
        gl.uniformMatrix4fv(this.view_proj_matrix, false, renderer.getMVPMatrix());
        gl.uniform4f(this.color, this._color[0], this._color[1], this._color[2], this._color[3]);
        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);
        renderer.checkGlError("ColorShader glDrawElements");
    }
    drawModelWithoutTransform(renderer, model, attribs) {
        if (this.rm_Vertex === undefined || this.view_proj_matrix === undefined || this.color === undefined) {
            return;
        }
        const gl = renderer.gl;
        model.bindBuffers(gl);
        gl.enableVertexAttribArray(this.rm_Vertex);
        if (attribs) {
            for (const [key, value] of attribs) {
                gl.vertexAttribPointer(key, ...value);
            }
        }
        else {
            gl.vertexAttribPointer(this.rm_Vertex, 3, gl.FLOAT, false, 4 * 3, 0);
        }
        gl.uniformMatrix4fv(this.view_proj_matrix, false, renderer.getMVPMatrix());
        gl.uniform4f(this.color, this._color[0], this._color[1], this._color[2], this._color[3]);
        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);
        renderer.checkGlError("ColorShader glDrawElements");
    }
}
exports.ColorShader = ColorShader;
//# sourceMappingURL=ColorShader.js.map