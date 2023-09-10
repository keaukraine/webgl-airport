"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaneBodyLitShader = void 0;
const webgl_framework_1 = require("webgl-framework");
class PlaneBodyLitShader extends webgl_framework_1.DiffuseShader {
    fillCode() {
        this.vertexShaderCode = `#version 300 es
            precision highp float;
            uniform vec4 lightDir;
            uniform vec4 lightDir2;
            uniform mat4 view_matrix;
            uniform mat4 model_matrix;
            uniform mat4 view_proj_matrix;

            in float rm_TexCoord0;
            in vec4 rm_Vertex;
            in vec3 rm_Normal;

            out vec4 vTexAndColors; // xy = texture coord; z = color coeff 1, w = color coeff 2

            void main(void) {
               gl_Position = view_proj_matrix * rm_Vertex;

               vec3 vLightVec = -(view_matrix * lightDir).xyz;
               vec3 vLightVec2 = -(view_matrix * lightDir2).xyz;
               vec4 normal = model_matrix * vec4(rm_Normal, 0.0);
               vec3 vNormal = normalize(view_matrix * normal).xyz;

               float c1 = max(0.05, dot(vNormal, normalize(vLightVec)));
               float c2 = max(0.05, dot(vNormal, normalize(vLightVec2)));

               vTexAndColors = vec4(rm_TexCoord0, 0.5, c1, c2);
            }`;
        this.fragmentShaderCode = `#version 300 es
            precision mediump float;

            uniform sampler2D sTexture;
            uniform vec4 diffuse;
            uniform vec4 ambient;
            uniform vec4 ambient2;
            uniform float diffuseCoef;
            uniform float diffuseCoef2;
            uniform float diffuseExponent;

            in vec4 vTexAndColors;

            out vec4 fragColor;

            void main(void) {
               vec2 vTexCoord = vTexAndColors.xy;
               float c1 = vTexAndColors.z;
               float c2 = vTexAndColors.w;

               float d1 = pow(c1 * diffuseCoef, diffuseExponent);
               d1 = clamp(d1, 0.0, 1.0);
               float d2 = pow(c2 * diffuseCoef2, diffuseExponent);
               d2 = clamp(d2, 0.0, 1.0);
               vec4 vDiffuseColor = mix(diffuse, ambient, d1);
               vDiffuseColor = mix(vDiffuseColor, ambient2, d2);
               fragColor = vDiffuseColor * textureLod(sTexture, vTexCoord, 0.0);
            }`;
    }
    fillUniformsAttributes() {
        super.fillUniformsAttributes();
        this.view_matrix = this.getUniform("view_matrix");
        this.model_matrix = this.getUniform("model_matrix");
        this.rm_Normal = this.getAttrib("rm_Normal");
        this.ambient = this.getUniform("ambient");
        this.ambient2 = this.getUniform("ambient2");
        this.diffuse = this.getUniform("diffuse");
        this.lightDir = this.getUniform("lightDir");
        this.lightDir2 = this.getUniform("lightDir2");
        this.diffuseCoef = this.getUniform("diffuseCoef");
        this.diffuseCoef2 = this.getUniform("diffuseCoef2");
        this.diffuseExponent = this.getUniform("diffuseExponent");
    }
    /** @inheritdoc */
    drawModel(renderer, model, tx, ty, tz, rx, ry, rz, sx, sy, sz) {
        if (this.rm_Vertex === undefined
            || this.rm_TexCoord0 === undefined
            || this.rm_Normal === undefined
            || this.view_proj_matrix === undefined
            || this.view_matrix === undefined
            || this.model_matrix === undefined) {
            return;
        }
        const gl = renderer.gl;
        model.bindBuffers(gl);
        gl.enableVertexAttribArray(this.rm_Vertex);
        gl.enableVertexAttribArray(this.rm_TexCoord0);
        gl.enableVertexAttribArray(this.rm_Normal);
        gl.vertexAttribPointer(this.rm_Vertex, 3, gl.HALF_FLOAT, false, 12, 0);
        gl.vertexAttribPointer(this.rm_TexCoord0, 1, gl.UNSIGNED_BYTE, true, 12, 6);
        gl.vertexAttribPointer(this.rm_Normal, 3, gl.BYTE, true, 12, 7);
        renderer.calculateMVPMatrix(tx, ty, tz, rx, ry, rz, sx, sy, sz);
        gl.uniformMatrix4fv(this.view_proj_matrix, false, renderer.getMVPMatrix());
        gl.uniformMatrix4fv(this.view_matrix, false, renderer.getViewMatrix());
        gl.uniformMatrix4fv(this.model_matrix, false, renderer.getModelMatrix());
        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);
        renderer.checkGlError("PlaneBodyLitShader glDrawElements");
    }
}
exports.PlaneBodyLitShader = PlaneBodyLitShader;
//# sourceMappingURL=PlaneBodyLitShader.js.map