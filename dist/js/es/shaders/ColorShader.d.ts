import { BaseShader, FullModel } from "webgl-framework";
import { AttributeDescriptor, DrawableShader } from "webgl-framework/dist/types/DrawableShader";
import { RendererWithExposedMethods } from "webgl-framework/dist/types/RendererWithExposedMethods";
export declare class ColorShader extends BaseShader implements DrawableShader {
    view_proj_matrix: WebGLUniformLocation | undefined;
    color: WebGLUniformLocation | undefined;
    private _color;
    rm_Vertex: number | undefined;
    fillCode(): void;
    setColor(r: number, g: number, b: number, a: number): void;
    fillUniformsAttributes(): void;
    drawModel(renderer: RendererWithExposedMethods, model: FullModel, tx: number, ty: number, tz: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number): void;
    drawModelWithoutTransform(renderer: RendererWithExposedMethods, model: FullModel, attribs?: Map<number, AttributeDescriptor>): void;
}
