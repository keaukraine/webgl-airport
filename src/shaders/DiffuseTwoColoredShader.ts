import { DiffuseShader, FullModel } from "webgl-framework";
import { DrawableShader } from "webgl-framework/dist/types/DrawableShader";
import { RendererWithExposedMethods } from "webgl-framework/dist/types/RendererWithExposedMethods";

export class DiffuseTwoColoredShader extends DiffuseShader implements DrawableShader {
    /** Uniforms are of type `WebGLUniformLocation` */
    color1: WebGLUniformLocation | undefined;
    private _color1: number[] = [1, 1, 0, 0];

    color2: WebGLUniformLocation | undefined;
    private _color2: number[] = [1, 1, 0, 0];

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

    public setColor1(r: number, g: number, b: number, a: number) {
        this._color1 = [r, g, b, a];
    }

    public setColor2(r: number, g: number, b: number, a: number) {
        this._color2 = [r, g, b, a];
    }

    drawModel(renderer: RendererWithExposedMethods, model: FullModel, tx: number, ty: number, tz: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number): void {
        if (this.rm_Vertex === undefined || this.view_proj_matrix === undefined || this.color1 === undefined || this.color2 === undefined) {
            return;
        }

        const gl = renderer.gl;
        gl.uniform4f(this.color1, this._color1[0], this._color1[1], this._color1[2], this._color1[3]);
        gl.uniform4f(this.color2, this._color2[0], this._color2[1], this._color2[2], this._color2[3]);

        super.drawModel(renderer, model, tx, ty, tz, rx, ry, rz, sx, sy, sz);
    }
}
