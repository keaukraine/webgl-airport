import { BaseShader, FullModel } from "webgl-framework";
import { DrawableShader } from "webgl-framework/dist/types/DrawableShader";
import { RendererWithExposedMethods } from "webgl-framework/dist/types/RendererWithExposedMethods";

export class CloudShader extends BaseShader implements DrawableShader {
    // Uniforms are of type `WebGLUniformLocation`
    view_proj_matrix: WebGLUniformLocation | undefined;
    color: WebGLUniformLocation | undefined;
    time: WebGLUniformLocation | undefined;
    rm_TexCoord0: number | undefined;
    private _color: number[] = [1, 1, 0, 0];
    private _time: number = 0;

    // Attributes are numbers.
    rm_Vertex: number | undefined;

    fillCode() {
        this.vertexShaderCode = `precision highp float;
        attribute vec4 rm_Vertex;
        attribute float rm_TexCoord0;
        uniform mat4 view_proj_matrix;
        uniform float uTime;

        const float NOISE_AMPLITUDE = 750.;
        const float NOISE_SCALE = 80.0;

        void main() {
            vec4 vertex = rm_Vertex;
            float offset = sin(rm_TexCoord0 * NOISE_SCALE + uTime * 0.001);
            vertex.z += offset * NOISE_AMPLITUDE * uTime;
            gl_Position = view_proj_matrix * vertex;
        }`;

        this.fragmentShaderCode = `precision mediump float;
        uniform vec4 color;

        void main() {
            gl_FragColor = color;
        }`;
    }

    public setColor(r: number, g: number, b: number, a: number) {
        this._color = [r, g, b, a];
    }

    public setTime(value: number) {
        this._time = value;
    }

    fillUniformsAttributes() {
        this.rm_Vertex = this.getAttrib("rm_Vertex");
        this.rm_TexCoord0 = this.getAttrib("rm_TexCoord0");

        this.view_proj_matrix = this.getUniform("view_proj_matrix");
        this.color = this.getUniform("color");
        this.time = this.getUniform("uTime");
    }

    drawModel(renderer: RendererWithExposedMethods, model: FullModel, tx: number, ty: number, tz: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number): void {
        if (this.rm_Vertex === undefined || this.rm_TexCoord0 === undefined || this.view_proj_matrix === undefined || this.color === undefined || this.time === undefined) {
            return;
        }

        const gl = renderer.gl;

        model.bindBuffers(gl);

        gl.enableVertexAttribArray(this.rm_Vertex);
        gl.enableVertexAttribArray(this.rm_TexCoord0);
        gl.vertexAttribPointer(this.rm_Vertex, 3, gl.FLOAT, false, 16, 0);
        gl.vertexAttribPointer(this.rm_TexCoord0, 1, gl.UNSIGNED_BYTE, true, 16, 12);
        renderer.calculateMVPMatrix(tx, ty, tz, rx, ry, rz, sx, sy, sz);

        gl.uniformMatrix4fv(this.view_proj_matrix, false, renderer.getMVPMatrix());
        gl.uniform4f(this.color, this._color[0], this._color[1], this._color[2], this._color[3]);
        gl.uniform1f(this.time, this._time);

        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);

        renderer.checkGlError("CloudShader glDrawElements");
    }
}
