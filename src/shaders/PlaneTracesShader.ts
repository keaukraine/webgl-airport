import { BaseShader, FullModel } from "webgl-framework";
import { DrawableShader } from "webgl-framework/dist/types/DrawableShader";
import { RendererWithExposedMethods } from "webgl-framework/dist/types/RendererWithExposedMethods";

export class PlaneTracesShader extends BaseShader implements DrawableShader {
    // Uniforms are of type `WebGLUniformLocation`
    view_proj_matrix: WebGLUniformLocation | undefined;
    color: WebGLUniformLocation | undefined;
    rm_TexCoord0: number | undefined;
    private _color: number[] = [1, 1, 0, 0];

    // Attributes are numbers.
    rm_Vertex: number | undefined;

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

    public setColor(r: number, g: number, b: number, a: number) {
        this._color = [r, g, b, a];
    }

    fillUniformsAttributes() {
        this.rm_Vertex = this.getAttrib("rm_Vertex");
        this.rm_TexCoord0 = this.getAttrib('rm_TexCoord0');

        this.view_proj_matrix = this.getUniform("view_proj_matrix");
        this.color = this.getUniform("color");
    }

    drawModel(renderer: RendererWithExposedMethods, model: FullModel, tx: number, ty: number, tz: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number): void {
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

    drawModelWithoutTransform(renderer: RendererWithExposedMethods, model: FullModel): void {
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
