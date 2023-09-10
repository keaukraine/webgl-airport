"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaneTracesShader = void 0;
const webgl_framework_1 = require("webgl-framework");
class PlaneTracesShader extends webgl_framework_1.BaseShader {
    constructor() {
        super(...arguments);
        this._color = [1, 1, 0, 0];
    }
    fillCode() {
        this.vertexShaderCode = `precision highp float;
        attribute vec4 rm_Vertex;
        attribute vec2 rm_TexCoord0;
        uniform mat4 view_proj_matrix;
        uniform mediump vec4 color;
        varying mediump vec4 vColor;

        void main() {
            vColor = color;
            vColor.a = rm_TexCoord0.x;
            gl_Position = view_proj_matrix * rm_Vertex;
        }`;
        this.fragmentShaderCode = `precision mediump float;
        varying vec4 vColor;

        void main() {
            gl_FragColor = vColor;
        }`;
    }
    setColor(r, g, b, a) {
        this._color = [r, g, b, a];
    }
    fillUniformsAttributes() {
        this.rm_Vertex = this.getAttrib("rm_Vertex");
        this.rm_TexCoord0 = this.getAttrib('rm_TexCoord0');
        this.view_proj_matrix = this.getUniform("view_proj_matrix");
        this.color = this.getUniform("color");
    }
    drawModel(renderer, model, tx, ty, tz, rx, ry, rz, sx, sy, sz) {
        if (this.rm_Vertex === undefined || this.rm_TexCoord0 === undefined || this.view_proj_matrix === undefined || this.color === undefined) {
            return;
        }
        const gl = renderer.gl;
        model.bindBuffers(gl);
        gl.enableVertexAttribArray(this.rm_Vertex);
        gl.enableVertexAttribArray(this.rm_TexCoord0);
        gl.vertexAttribPointer(this.rm_Vertex, 3, gl.FLOAT, false, 4 * (3 + 2), 0);
        gl.vertexAttribPointer(this.rm_TexCoord0, 2, gl.FLOAT, false, 4 * (3 + 2), 4 * 3);
        renderer.calculateMVPMatrix(tx, ty, tz, rx, ry, rz, sx, sy, sz);
        gl.uniformMatrix4fv(this.view_proj_matrix, false, renderer.getMVPMatrix());
        gl.uniform4f(this.color, this._color[0], this._color[1], this._color[2], this._color[3]);
        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);
        renderer.checkGlError("PlaneTrracesShader glDrawElements");
    }
    drawModelWithoutTransform(renderer, model) {
        if (this.rm_Vertex === undefined || this.rm_TexCoord0 === undefined || this.view_proj_matrix === undefined || this.color === undefined) {
            return;
        }
        const gl = renderer.gl;
        model.bindBuffers(gl);
        gl.enableVertexAttribArray(this.rm_Vertex);
        gl.enableVertexAttribArray(this.rm_TexCoord0);
        gl.vertexAttribPointer(this.rm_Vertex, 3, gl.FLOAT, false, 4 * (3 + 2), 0);
        gl.vertexAttribPointer(this.rm_TexCoord0, 2, gl.FLOAT, false, 4 * (3 + 2), 4 * 3);
        gl.uniformMatrix4fv(this.view_proj_matrix, false, renderer.getMVPMatrix());
        gl.uniform4f(this.color, this._color[0], this._color[1], this._color[2], this._color[3]);
        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);
        renderer.checkGlError("PlaneTrracesShader glDrawElements");
    }
}
exports.PlaneTracesShader = PlaneTracesShader;
//# sourceMappingURL=PlaneTracesShader.js.map