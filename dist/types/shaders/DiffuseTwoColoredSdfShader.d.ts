import { DiffuseTwoColoredShader } from "./DiffuseTwoColoredShader";
export declare class DiffuseTwoColoredSdfShader extends DiffuseTwoColoredShader {
    uBrightnessContrast: WebGLUniformLocation | undefined;
    fillCode(): void;
    fillUniformsAttributes(): void;
}
