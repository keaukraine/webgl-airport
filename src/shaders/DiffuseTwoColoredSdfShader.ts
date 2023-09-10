import { DiffuseTwoColoredShader } from "./DiffuseTwoColoredShader";

export class DiffuseTwoColoredSdfShader extends DiffuseTwoColoredShader {
    uBrightnessContrast: WebGLUniformLocation | undefined;

    fillCode() {
        super.fillCode();

        this.fragmentShaderCode = `precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D sTexture;
            uniform vec4 color1;
            uniform vec4 color2;
            uniform vec2 uBrightnessContrast;

            void main() {
                float a = texture2D(sTexture, vTextureCoord)[0];
                a = (a - uBrightnessContrast.x) * uBrightnessContrast.y;
                a = clamp(a, 0.0, 1.0);
                gl_FragColor = mix(color2, color1, a);
            }`;
    }

    fillUniformsAttributes() {
        super.fillUniformsAttributes();

        this.uBrightnessContrast = this.getUniform("uBrightnessContrast");
    }
}
