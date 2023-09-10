"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffuseTwoColoredSdfShader = void 0;
const DiffuseTwoColoredShader_1 = require("./DiffuseTwoColoredShader");
class DiffuseTwoColoredSdfShader extends DiffuseTwoColoredShader_1.DiffuseTwoColoredShader {
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
exports.DiffuseTwoColoredSdfShader = DiffuseTwoColoredSdfShader;
//# sourceMappingURL=DiffuseTwoColoredSdfShader.js.map