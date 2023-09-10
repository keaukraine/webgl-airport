import { DiffuseShader, FullModel } from "webgl-framework";
import { DrawableShader } from "webgl-framework/dist/types/DrawableShader";
import { RendererWithExposedMethods } from "webgl-framework/dist/types/RendererWithExposedMethods";
export declare class DiffuseTwoColoredShader extends DiffuseShader implements DrawableShader {
    /** Uniforms are of type `WebGLUniformLocation` */
    color1: WebGLUniformLocation | undefined;
    private _color1;
    color2: WebGLUniformLocation | undefined;
    private _color2;
    fillCode(): void;
    fillUniformsAttributes(): void;
    setColor1(r: number, g: number, b: number, a: number): void;
    setColor2(r: number, g: number, b: number, a: number): void;
    drawModel(renderer: RendererWithExposedMethods, model: FullModel, tx: number, ty: number, tz: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number): void;
}
