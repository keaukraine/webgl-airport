"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const webgl_framework_1 = require("webgl-framework");
const gl_matrix_1 = require("gl-matrix");
const CameraMode_1 = require("./CameraMode");
const PlaneBodyLitShader_1 = require("./shaders/PlaneBodyLitShader");
const ColorShader_1 = require("./shaders/ColorShader");
const DiffuseTwoColoredSdfShader_1 = require("./shaders/DiffuseTwoColoredSdfShader");
const CloudShader_1 = require("./shaders/CloudShader");
const PlaneTracesShader_1 = require("./shaders/PlaneTracesShader");
const CameraPositionInterpolator_1 = require("./CameraPositionInterpolator");
const Cameras_1 = require("./Cameras");
const FOV_LANDSCAPE = 25.0;
const FOV_PORTRAIT = 35.0;
const FOV_TRANSITION = 30.0;
const PLANE_DISTANT_XFORM = {
    translation: [200000 / 4.0, 100000 / 4, 22000 / 4],
    rotation: [-25.0 * Math.PI / 180, 0.0, 0.0],
    scale: 0.3,
    travel: -140000.0,
    period: 82200,
    banking: Math.PI * -0.15
};
var CameraState;
(function (CameraState) {
    CameraState[CameraState["Animating"] = 0] = "Animating";
    CameraState[CameraState["Transitioning"] = 1] = "Transitioning";
})(CameraState || (CameraState = {}));
class Renderer extends webgl_framework_1.BaseRenderer {
    constructor() {
        super();
        this.lastTime = 0;
        this.loaded = false;
        this.fmGround = new webgl_framework_1.FullModel();
        this.fmGroundColored = new webgl_framework_1.FullModel();
        this.fmPlaneShadow = new webgl_framework_1.FullModel();
        this.fmTrees = new webgl_framework_1.FullModel();
        this.fmClouds = new webgl_framework_1.FullModel();
        this.fmPlaneUnlit = new webgl_framework_1.FullModel();
        this.fmPlaneLit = new webgl_framework_1.FullModel();
        this.fmBus = new webgl_framework_1.FullModel();
        this.fmPlaneTraces = new webgl_framework_1.FullModel();
        this.fmPlaneDistant = new webgl_framework_1.FullModel();
        this.fmLoader = new webgl_framework_1.FullModel();
        this.paletteTextures = {
            DAY: undefined,
            NIGHT: undefined,
            SUNRISE: undefined,
            SUNSET: undefined
        };
        this.attribsDiffuseFP32 = new Map();
        this.attribsDiffuseCompact = new Map();
        this.attribsColorFP32 = new Map();
        this.attribsColorCompact = new Map();
        this.Z_NEAR = 500.0;
        this.Z_FAR = 280000.0;
        this.timerCamera = 0;
        this.CAMERA_PERIOD = 87000;
        this.timerBus = 0;
        this.timerDistantPlaneRotating = 0;
        this.BUS_PERIOD = 60000;
        this.BUS_X_START = -94150.047;
        this.BUS_X_END = 105455.586;
        this.BUS_TRAVEL = this.BUS_X_END - this.BUS_X_START;
        this.BUS_Y = 4612.632;
        this.timerCloudsRotation = 0;
        this.CLOUDS_ROTATION_PERIOD = 500000;
        this.timerCloudsAnimation = 0;
        this.CLOUDS_ANIMATION_PERIOD = 15000;
        this.cameraMode = CameraMode_1.CameraMode.Rotating;
        this.matViewInverted = gl_matrix_1.mat4.create();
        this.matViewInvertedTransposed = gl_matrix_1.mat4.create();
        this.matTemp = gl_matrix_1.mat4.create();
        this.cameraPosition = gl_matrix_1.vec3.create();
        this.cameraRotation = gl_matrix_1.vec3.create();
        this.tmpPosition1 = [0, 0, 0];
        this.tmpPosition2 = [0, 0, 0];
        this.tmpPosition3 = [0, 0, 0];
        this.timeOfDay = "DAY";
        this.config = {
            currentPlane: 0,
            sdfBrightness: 0.51,
            sdfContrast: 8,
            sdfContrastMax: 60,
            timeOfDay: this.timeOfDay,
            plane: "1"
        };
        this.TIMES_OF_DAY = {
            DAY: {
                SKY: [203 / 255, 215 / 255, 199 / 255],
                GROUND: [154 / 255, 178 / 255, 181 / 255],
                GROUND_SHADOW: [43 / 255, 62 / 255, 99 / 255],
                TREES: [42 / 255, 61 / 255, 98 / 255],
                CLOUDS: [170 / 255, 180 / 255, 182 / 255],
                PLANE_SHADOW: [215 / 255, 223 / 255, 202 / 255],
                PLANE_BODY: [250 / 255, 244 / 255, 210 / 255],
                PLANE_DISTANT: [238 / 255, 237 / 255, 207 / 255],
                PLANE_DISTANT_TRACES: [250 / 255, 244 / 255, 210 / 255],
            },
            NIGHT: {
                SKY: [0 / 255, 24 / 255, 64 / 255],
                GROUND: [8 / 255, 58 / 255, 100 / 255],
                GROUND_SHADOW: [0 / 255, 13 / 255, 29 / 255],
                TREES: [1 / 255, 44 / 255, 82 / 255],
                CLOUDS: [10 / 255, 37 / 255, 74 / 255],
                PLANE_SHADOW: [96 / 255, 136 / 255, 170 / 255],
                PLANE_BODY: [157 / 255, 187 / 255, 212 / 255],
                PLANE_DISTANT: [54 / 255, 82 / 255, 122 / 255],
                PLANE_DISTANT_TRACES: [31 / 255, 61 / 255, 102 / 255],
            },
            SUNRISE: {
                SKY: [252 / 255, 136 / 255, 84 / 255],
                GROUND: [120 / 255, 50 / 255, 66 / 255],
                GROUND_SHADOW: [85 / 255, 24 / 255, 34 / 255],
                TREES: [229 / 255, 51 / 255, 77 / 255],
                CLOUDS: [252 / 255, 110 / 255, 85 / 255],
                PLANE_SHADOW: [193 / 255, 161 / 255, 109 / 255],
                PLANE_BODY: [234 / 255, 220 / 255, 196 / 255],
                PLANE_DISTANT: [251 / 255, 226 / 255, 182 / 255],
                PLANE_DISTANT_TRACES: [251 / 255, 202 / 255, 155 / 255]
            },
            SUNSET: {
                SKY: [170 / 255, 60 / 255, 91 / 255],
                GROUND: [85 / 255, 57 / 255, 82 / 255],
                GROUND_SHADOW: [45 / 255, 24 / 255, 42 / 255],
                TREES: [72 / 255, 52 / 255, 79 / 255],
                CLOUDS: [158 / 255, 55 / 255, 94 / 255],
                PLANE_SHADOW: [194 / 255, 145 / 255, 171 / 255],
                PLANE_BODY: [245 / 255, 203 / 255, 209 / 255],
                PLANE_DISTANT: [206 / 255, 130 / 255, 151 / 255],
                PLANE_DISTANT_TRACES: [189 / 255, 97 / 255, 122 / 255],
            }
        };
        this.cameraPositionInterpolator = new CameraPositionInterpolator_1.CameraPositionInterpolator();
        this.previousCameraReverse = false;
        this.CAMERA_SPEED = 1 * 1000000; // FIXME
        this.CAMERA_MIN_DURATION = 8000 / 3; // FIXME
        this.currentCamera = 0;
        this.stateCamera = CameraState.Animating;
        this.CAMERA_TRANSITION_PERIOD = 1100;
        this.viewDir = gl_matrix_1.vec3.create();
        this.viewAngle = 0;
        this.PRESETS = [
            {
                lightDir: [0.30151134729385376, 0.30151134729385376, 0.9045340418815613],
                lightDir2: [0.16222141683101654, 0.16222141683101654, 0.9733285307884216],
                diffuseCoef: 3.0,
                diffuseCoef2: 1.2,
                drawLoader: true
            },
            {
                lightDir: [0.7069963216781616, 0.7069963216781616, 0.01767490804195404],
                lightDir2: [0.16222141683101654, 0.16222141683101654, 0.9733285307884216],
                diffuseCoef: 3.0,
                diffuseCoef2: 4.0,
                drawLoader: true
            },
            {
                lightDir: [0.7069963216781616, 0.7069963216781616, 0.01767490804195404],
                lightDir2: [0.16222141683101654, 0.16222141683101654, 0.9733285307884216],
                diffuseCoef: 3.1,
                diffuseCoef2: 3.1,
                drawLoader: false
            }
        ];
        this.cameraPositionInterpolator.speed = this.CAMERA_SPEED;
        this.cameraPositionInterpolator.minDuration = this.CAMERA_MIN_DURATION;
        this.updateCameraInterpolator();
        document.addEventListener("keypress", event => {
            if (event.key === "1") {
                this.camera[0].start = {
                    position: new Float32Array([this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]]),
                    rotation: new Float32Array([this.cameraRotation[0], this.cameraRotation[1], this.cameraRotation[2]]),
                };
                this.logCamera();
            }
            else if (event.key === "2") {
                this.camera[0].end = {
                    position: new Float32Array([this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]]),
                    rotation: new Float32Array([this.cameraRotation[0], this.cameraRotation[1], this.cameraRotation[2]]),
                };
                this.logCamera();
            }
            else if (event.key === "n") {
                this.nextCamera();
            }
        });
    }
    setCustomCamera(camera, position, rotation) {
        this.customCamera = camera;
        if (position !== undefined) {
            this.cameraPosition = position;
        }
        if (rotation !== undefined) {
            this.cameraRotation = rotation;
        }
    }
    resetCustomCamera() {
        this.customCamera = undefined;
    }
    onBeforeInit() {
    }
    onAfterInit() {
    }
    onInitError() {
        var _a, _b;
        (_a = document.getElementById("canvasGL")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        (_b = document.getElementById("alertError")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
    }
    initShaders() {
        this.shaderDiffuse = new webgl_framework_1.DiffuseShader(this.gl);
        this.shaderDiffuseTwoColoredSdf = new DiffuseTwoColoredSdfShader_1.DiffuseTwoColoredSdfShader(this.gl);
        this.shaderColor = new ColorShader_1.ColorShader(this.gl);
        this.shaderCloud = new CloudShader_1.CloudShader(this.gl);
        this.shaderPlaneBody = new PlaneBodyLitShader_1.PlaneBodyLitShader(this.gl);
        this.shaderPlaneTraces = new PlaneTracesShader_1.PlaneTracesShader(this.gl);
        const gl = this.gl;
        this.attribsDiffuseFP32.set(this.shaderDiffuse.rm_Vertex, [3, gl.FLOAT, false, 16, 0]);
        this.attribsDiffuseFP32.set(this.shaderDiffuse.rm_TexCoord0, [2, gl.UNSIGNED_BYTE, true, 16, 12]);
        this.attribsDiffuseCompact.set(this.shaderDiffuse.rm_Vertex, [3, gl.HALF_FLOAT, false, 8, 0]);
        this.attribsDiffuseCompact.set(this.shaderDiffuse.rm_TexCoord0, [2, gl.UNSIGNED_BYTE, true, 8, 6]);
        this.attribsColorCompact.set(this.shaderColor.rm_Vertex, [3, gl.HALF_FLOAT, false, 8, 0]);
    }
    async loadData() {
        var _a;
        const results = await Promise.all([
            webgl_framework_1.UncompressedTextureLoader.load(`data/textures/palette-day.webp`, this.gl, this.gl.NEAREST, this.gl.NEAREST, true),
            webgl_framework_1.UncompressedTextureLoader.load(`data/textures/palette-night.webp`, this.gl, this.gl.NEAREST, this.gl.NEAREST, true),
            webgl_framework_1.UncompressedTextureLoader.load(`data/textures/palette-sunrise.webp`, this.gl, this.gl.NEAREST, this.gl.NEAREST, true),
            webgl_framework_1.UncompressedTextureLoader.load(`data/textures/palette-sunset.webp`, this.gl, this.gl.NEAREST, this.gl.NEAREST, true),
            this.fmGround.load("data/models/ground", this.gl),
            this.fmGroundColored.load("data/models/ground-colored", this.gl),
            this.fmTrees.load("data/models/trees", this.gl),
            this.fmClouds.load("data/models/clouds", this.gl),
            this.fmBus.load("data/models/bus", this.gl),
            this.fmPlaneTraces.load("data/models/plane-traces", this.gl),
            this.fmPlaneDistant.load("data/models/plane-distant", this.gl),
            this.fmLoader.load("data/models/loader", this.gl)
        ]);
        [
            this.paletteTextures.DAY,
            this.paletteTextures.NIGHT,
            this.paletteTextures.SUNRISE,
            this.paletteTextures.SUNSET
        ] = results;
        await this.changePlane("1");
        this.loaded = true;
        console.log("Loaded all assets");
        this.setupCanvasEvents();
        (_a = this.readyCallback) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    setupCanvasEvents() {
        if (!this.canvas) {
            return;
        }
        const canvas = this.canvas;
        canvas.addEventListener("touchstart", (eventStart) => {
            const touchend = (eventEnd) => {
                const touchStart = eventStart.touches.item(0);
                const touchEnd = eventEnd.changedTouches.item(0);
                if (touchStart && touchEnd) {
                    const diff = touchEnd.clientX - touchStart.clientX;
                    if (Math.abs(diff) > 5) {
                        const prevReverse = this.cameraPositionInterpolator.reverse;
                        if (diff > 0) {
                            if (prevReverse === false) {
                                this.cameraPositionInterpolator.reverse = true;
                                this.cameraPositionInterpolator.timer = 1 - this.cameraPositionInterpolator.timer;
                            }
                        }
                        else {
                            if (prevReverse === true) {
                                this.cameraPositionInterpolator.reverse = false;
                                this.cameraPositionInterpolator.timer = 1 - this.cameraPositionInterpolator.timer;
                            }
                        }
                    }
                }
                canvas.removeEventListener("touchend", touchend);
            };
            canvas.addEventListener("touchend", touchend);
        });
        canvas.addEventListener("click", () => this.nextCamera());
    }
    resizeCanvas() {
        if (this.canvas === undefined) {
            return;
        }
        super.resizeCanvas();
    }
    animate() {
        const timeNow = new Date().getTime();
        if (this.lastTime != 0) {
            this.timerCamera = this.cameraMode === CameraMode_1.CameraMode.Rotating
                ? (timeNow % this.CAMERA_PERIOD) / this.CAMERA_PERIOD
                : 0.13;
            this.timerBus = (timeNow % this.BUS_PERIOD) / this.BUS_PERIOD;
            this.timerDistantPlaneRotating = (timeNow % PLANE_DISTANT_XFORM.period) / PLANE_DISTANT_XFORM.period;
            this.timerCloudsRotation = (timeNow % this.CLOUDS_ROTATION_PERIOD) / this.CLOUDS_ROTATION_PERIOD;
            this.timerCloudsAnimation = (timeNow % this.CLOUDS_ANIMATION_PERIOD) / this.CLOUDS_ANIMATION_PERIOD;
            this.cameraPositionInterpolator.iterate(timeNow);
            if (this.cameraPositionInterpolator.timer === 1.0) {
                if (this.stateCamera === CameraState.Animating) {
                    this.cameraPositionInterpolator.reverse = !this.cameraPositionInterpolator.reverse;
                    this.cameraPositionInterpolator.reset();
                }
                else {
                    this.setCameraState(CameraState.Animating);
                }
            }
        }
        this.lastTime = timeNow;
    }
    setCameraState(state) {
        if (this.stateCamera === CameraState.Animating && state === CameraState.Transitioning) {
            this.currentCamera++;
            this.currentCamera %= this.camera.length;
            const camera = this.camera[this.currentCamera];
            console.log(camera.name);
            this.cameraPositionInterpolator.minDuration = this.CAMERA_TRANSITION_PERIOD;
            this.cameraPositionInterpolator.position = {
                start: {
                    position: [...this.cameraPositionInterpolator.cameraPosition],
                    rotation: [...this.cameraPositionInterpolator.cameraRotation]
                },
                end: {
                    position: [
                        (camera.end.position[0] - camera.start.position[0]) / 2 + camera.start.position[0],
                        (camera.end.position[1] - camera.start.position[1]) / 2 + camera.start.position[1],
                        (camera.end.position[2] - camera.start.position[2]) / 2 + camera.start.position[2]
                    ],
                    rotation: [
                        (camera.end.rotation[0] - camera.start.rotation[0]) / 2 + camera.start.rotation[0],
                        (camera.end.rotation[1] - camera.start.rotation[1]) / 2 + camera.start.rotation[1],
                        (camera.end.rotation[2] - camera.start.rotation[2]) / 2 + camera.start.rotation[2]
                    ]
                }
            };
            this.previousCameraReverse = this.cameraPositionInterpolator.reverse;
            this.cameraPositionInterpolator.reverse = false;
            this.cameraPositionInterpolator.reset();
        }
        else if (this.stateCamera === CameraState.Transitioning && state === CameraState.Animating) {
            this.updateCameraInterpolator();
            this.cameraPositionInterpolator.reverse = this.previousCameraReverse;
            this.cameraPositionInterpolator.timer = 0.5; // start from the center of new path
        }
        this.stateCamera = state;
    }
    /** Calculates projection matrix */
    setCameraFOV(multiplier) {
        var ratio;
        if (this.gl.canvas.height > 0) {
            ratio = this.gl.canvas.width / this.gl.canvas.height;
        }
        else {
            ratio = 1.0;
        }
        let fov = 0;
        if (this.gl.canvas.width >= this.gl.canvas.height) {
            fov = FOV_LANDSCAPE * multiplier;
        }
        else {
            fov = FOV_PORTRAIT * multiplier;
        }
        if (this.stateCamera === CameraState.Transitioning) {
            const a = Math.pow(Math.sin(this.cameraPositionInterpolator.timer * Math.PI), 2);
            fov += FOV_TRANSITION * a;
        }
        this.setFOV(this.mProjMatrix, fov, ratio, this.Z_NEAR, this.Z_FAR);
    }
    /**
     * Calculates camera matrix.
     *
     * @param a Position in [0...1] range
     */
    positionCamera(a) {
        if (this.customCamera !== undefined) {
            this.mVMatrix = this.customCamera;
            return;
        }
        const [eyeX, eyeY, eyeZ] = this.cameraPositionInterpolator.cameraPosition;
        const [centerX, centerY, centerZ] = this.cameraPositionInterpolator.cameraRotation;
        gl_matrix_1.mat4.lookAt(this.mVMatrix, [eyeX, eyeY, eyeZ], // eye
        [centerX, centerY, centerZ], // center
        [0, 0, 1] // up vector
        );
        this.cameraPosition[0] = eyeX;
        this.cameraPosition[1] = eyeY;
        this.cameraPosition[2] = eyeZ;
        this.viewDir[0] = eyeX - centerX;
        this.viewDir[1] = eyeY - centerY;
        this.viewDir[2] = eyeZ - centerZ;
        gl_matrix_1.vec3.normalize(this.viewDir, this.viewDir);
        this.viewAngle = gl_matrix_1.vec3.dot(this.viewDir, [0, 0, 1]);
    }
    /** Issues actual draw calls */
    drawScene() {
        if (!this.loaded) {
            return;
        }
        this.positionCamera(this.timerCamera);
        this.setCameraFOV(1.0);
        this.gl.clearColor(this.sceneColors.SKY[0], this.sceneColors.SKY[1], this.sceneColors.SKY[2], 0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.colorMask(true, true, true, true);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null); // This differs from OpenGL ES
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.drawSceneObjects();
    }
    drawVignette(shader) {
        this.unbindBuffers();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mTriangleVerticesVignette);
        this.gl.enableVertexAttribArray(shader.rm_Vertex);
        this.gl.vertexAttribPointer(shader.rm_Vertex, 3, this.gl.FLOAT, false, 20, 0);
        this.gl.enableVertexAttribArray(shader.rm_TexCoord0);
        this.gl.vertexAttribPointer(shader.rm_TexCoord0, 2, this.gl.FLOAT, false, 20, 4 * 3);
        this.gl.uniformMatrix4fv(shader.view_proj_matrix, false, this.getOrthoMatrix());
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    drawSceneObjects() {
        if (this.shaderDiffuse === undefined) {
            console.log("undefined shaders");
            return;
        }
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.disable(this.gl.BLEND);
        this.drawAirplane();
        this.drawGround();
        this.gl.disable(this.gl.BLEND);
        this.gl.depthMask(true);
    }
    drawAirplane() {
        var _a;
        if (this.shaderDiffuseTwoColoredSdf === undefined
            || this.shaderDiffuse === undefined
            || this.shaderPlaneBody === undefined) {
            return;
        }
        (_a = this.shaderDiffuse) === null || _a === void 0 ? void 0 : _a.use();
        this.setTexture2D(0, this.texturePalette, this.shaderDiffuse.sTexture);
        this.shaderDiffuse.drawModel(this, this.fmPlaneUnlit, 0, 0, 0, 0, 0, 0, 1, 1, 1, this.attribsDiffuseCompact);
        this.shaderPlaneBody.use();
        this.setTexture2D(0, this.texturePalette, this.shaderPlaneBody.sTexture);
        this.gl.uniform4f(this.shaderPlaneBody.lightDir, this.preset.lightDir[0], this.preset.lightDir[1], this.preset.lightDir[2], 0);
        this.gl.uniform4f(this.shaderPlaneBody.lightDir2, this.preset.lightDir2[0], this.preset.lightDir2[1], this.preset.lightDir2[2], 0);
        this.gl.uniform4f(this.shaderPlaneBody.ambient, this.sceneColors.PLANE_SHADOW[0], this.sceneColors.PLANE_SHADOW[1], this.sceneColors.PLANE_SHADOW[2], 0);
        this.gl.uniform4f(this.shaderPlaneBody.ambient2, this.sceneColors.GROUND_SHADOW[0], this.sceneColors.GROUND_SHADOW[1], this.sceneColors.GROUND_SHADOW[2], 0);
        this.gl.uniform4f(this.shaderPlaneBody.diffuse, this.sceneColors.PLANE_BODY[0], this.sceneColors.PLANE_BODY[1], this.sceneColors.PLANE_BODY[2], 0);
        this.gl.uniform1f(this.shaderPlaneBody.diffuseCoef, this.preset.diffuseCoef);
        this.gl.uniform1f(this.shaderPlaneBody.diffuseCoef2, this.preset.diffuseCoef2);
        this.gl.uniform1f(this.shaderPlaneBody.diffuseExponent, 124.0);
        this.shaderPlaneBody.drawModel(this, this.fmPlaneLit, 0, 0, 0, 0, 0, 0, 1, 1, 1);
        // Bus 1
        this.shaderPlaneBody.drawModel(this, this.fmBus, this.BUS_X_START + this.timerBus * this.BUS_TRAVEL, this.BUS_Y, 0, 0, 0, 0, 1, 1, 1);
        // Bus 2
        this.shaderPlaneBody.drawModel(this, this.fmBus, this.BUS_X_START + (this.timerBus + 0.5) % 1 * this.BUS_TRAVEL, this.BUS_Y, 0, 0, 0, 0, 1, 1, 1);
        if (this.preset.drawLoader) {
            this.shaderPlaneBody.drawModel(this, this.fmLoader, 0, 0, 0, 0, 0, 0, 1, 1, 1);
        }
    }
    drawGround() {
        if (this.shaderDiffuseTwoColoredSdf === undefined
            || this.shaderColor === undefined
            || this.shaderCloud === undefined
            || this.shaderPlaneTraces === undefined
            || this.shaderDiffuse === undefined) {
            return;
        }
        const shader = this.shaderDiffuseTwoColoredSdf;
        shader.use();
        const contrast = this.config.sdfContrast + Math.max(this.viewAngle, 0) * this.config.sdfContrastMax;
        this.gl.uniform2f(this.shaderDiffuseTwoColoredSdf.uBrightnessContrast, this.config.sdfBrightness, contrast);
        this.setTexture2D(0, this.texturePlaneShadowSdf, shader.sTexture);
        shader.setColor1(this.sceneColors.GROUND[0], this.sceneColors.GROUND[1], this.sceneColors.GROUND[2], 1.0);
        shader.setColor2(this.sceneColors.GROUND_SHADOW[0], this.sceneColors.GROUND_SHADOW[1], this.sceneColors.GROUND_SHADOW[2], 1.0);
        shader.drawModel(this, this.fmPlaneShadow, 0, 0, 0, 0, 0, 0, 1, 1, 1);
        this.shaderColor.use();
        this.shaderColor.setColor(this.sceneColors.GROUND_SHADOW[0], this.sceneColors.GROUND_SHADOW[1], this.sceneColors.GROUND_SHADOW[2], 1.0);
        this.shaderColor.drawModel(this, this.fmGround, 0, 0, 0, 0, 0, 0, 1, 1, 1);
        this.shaderColor.setColor(this.sceneColors.TREES[0], this.sceneColors.TREES[1], this.sceneColors.TREES[2], 1.0);
        this.shaderColor.drawModel(this, this.fmTrees, 0, 0, 0, 0, 0, 0, 1, 1, 1);
        // ground-colored
        this.shaderDiffuse.use();
        this.setTexture2D(0, this.texturePalette, this.shaderDiffuse.sTexture);
        this.shaderDiffuse.drawModel(this, this.fmGroundColored, 0, 0, 0, 0, 0, 0, 1, 1, 1, this.attribsDiffuseFP32);
        this.drawDistantPlane(0, 0);
        this.drawDistantPlane(Math.PI, 3500);
        this.gl.depthMask(false);
        this.shaderCloud.use();
        this.shaderCloud.setColor(this.sceneColors.CLOUDS[0], this.sceneColors.CLOUDS[1], this.sceneColors.CLOUDS[2], 1.0);
        this.shaderCloud.setTime(Math.sin(this.timerCloudsAnimation * Math.PI * 2));
        this.shaderCloud.drawModel(this, this.fmClouds, -7737.234, -28334.416, 0, 0, 0, this.timerCloudsRotation * Math.PI * 2, 1.15, 1.15, 1);
        this.gl.depthMask(true);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ZERO, this.gl.ONE);
        this.drawDistantPlaneTraces(0, 0);
        this.drawDistantPlaneTraces(Math.PI, 3500);
        this.gl.disable(this.gl.BLEND);
    }
    drawDistantPlane(rotationOffset, zOffset) {
        if (this.shaderColor === undefined) {
            return;
        }
        const angle = this.timerDistantPlaneRotating * Math.PI * 2 + rotationOffset;
        this.calculateTransformMatricesWithBanking(Math.sin(angle) * PLANE_DISTANT_XFORM.translation[0], Math.cos(angle) * PLANE_DISTANT_XFORM.translation[0], PLANE_DISTANT_XFORM.translation[2] + zOffset, 0, 0, Math.PI - angle, PLANE_DISTANT_XFORM.scale, PLANE_DISTANT_XFORM.scale, PLANE_DISTANT_XFORM.scale, PLANE_DISTANT_XFORM.banking);
        this.shaderColor.use();
        this.shaderColor.setColor(this.sceneColors.PLANE_DISTANT[0], this.sceneColors.PLANE_DISTANT[1], this.sceneColors.PLANE_DISTANT[2], 1.0);
        this.shaderColor.drawModelWithoutTransform(this, this.fmPlaneDistant, this.attribsColorCompact);
    }
    drawDistantPlaneTraces(rotationOffset, zOffset) {
        if (this.shaderPlaneTraces === undefined) {
            return;
        }
        const angle = this.timerDistantPlaneRotating * Math.PI * 2 + rotationOffset;
        this.calculateTransformMatricesWithBanking(Math.sin(angle) * PLANE_DISTANT_XFORM.translation[0], Math.cos(angle) * PLANE_DISTANT_XFORM.translation[0], PLANE_DISTANT_XFORM.translation[2] + zOffset, 0, 0, Math.PI - angle, PLANE_DISTANT_XFORM.scale, PLANE_DISTANT_XFORM.scale, PLANE_DISTANT_XFORM.scale, PLANE_DISTANT_XFORM.banking);
        this.shaderPlaneTraces.use();
        this.shaderPlaneTraces.setColor(this.sceneColors.PLANE_DISTANT_TRACES[0], this.sceneColors.PLANE_DISTANT_TRACES[1], this.sceneColors.PLANE_DISTANT_TRACES[2], 1.0);
        this.shaderPlaneTraces.drawModelWithoutTransform(this, this.fmPlaneTraces);
    }
    calculateTransformMatricesWithBanking(tx, ty, tz, rx, ry, rz, sx, sy, sz, banking) {
        gl_matrix_1.mat4.identity(this.mMMatrix);
        gl_matrix_1.mat4.rotate(this.mMMatrix, this.mMMatrix, 0, [1, 0, 0]);
        gl_matrix_1.mat4.translate(this.mMMatrix, this.mMMatrix, [tx, ty, tz]);
        gl_matrix_1.mat4.scale(this.mMMatrix, this.mMMatrix, [sx, sy, sz]);
        gl_matrix_1.mat4.rotateX(this.mMMatrix, this.mMMatrix, rx);
        gl_matrix_1.mat4.rotateY(this.mMMatrix, this.mMMatrix, ry);
        gl_matrix_1.mat4.rotateZ(this.mMMatrix, this.mMMatrix, rz);
        gl_matrix_1.mat4.rotateX(this.mMMatrix, this.mMMatrix, banking);
        gl_matrix_1.mat4.multiply(this.mMVPMatrix, this.mVMatrix, this.mMMatrix);
        gl_matrix_1.mat4.multiply(this.mMVPMatrix, this.mProjMatrix, this.mMVPMatrix);
    }
    changeCameraMode() {
        if (this.cameraMode === CameraMode_1.CameraMode.Fixed) {
            this.cameraMode = CameraMode_1.CameraMode.Rotating;
        }
        else {
            this.cameraMode = CameraMode_1.CameraMode.Fixed;
        }
    }
    checkGlError(operation) {
        // Do nothing in production build.
    }
    set ready(callback) {
        this.readyCallback = callback;
    }
    get sceneColors() {
        return this.TIMES_OF_DAY[this.config.timeOfDay];
    }
    get texturePalette() {
        return this.paletteTextures[this.config.timeOfDay];
    }
    async changePlane(plane) {
        const loaded = await Promise.all([
            webgl_framework_1.UncompressedTextureLoader.load(`data/textures/plane-shadow-${plane}-sdf.webp`, this.gl, this.gl.LINEAR, this.gl.LINEAR, false),
            this.fmPlaneShadow.load(`data/models/plane-shadow-${plane}`, this.gl),
            this.fmPlaneUnlit.load(`data/models/plane-unlit-${plane}`, this.gl),
            this.fmPlaneLit.load(`data/models/plane-lit-${plane}`, this.gl)
        ]);
        const [shadowTexture] = loaded;
        if (this.texturePlaneShadowSdf !== undefined) {
            this.gl.deleteTexture(this.texturePlaneShadowSdf);
        }
        this.texturePlaneShadowSdf = shadowTexture;
        this.generateMipmaps(this.texturePlaneShadowSdf);
        this.config.currentPlane = +plane - 1;
        this.currentCamera = 0;
        this.updateCameraInterpolator();
    }
    get camera() {
        return Cameras_1.CAMERAS[this.config.currentPlane];
    }
    get preset() {
        return this.PRESETS[this.config.currentPlane];
    }
    logCamera() {
        const camera = this.camera[0];
        console.log(`
        {
            start: {
                position: new Float32Array([${camera.start.position.toString()}]),
                rotation: new Float32Array([${camera.start.rotation.toString()}])
            },
            end: {
                position: new Float32Array([${camera.end.position.toString()}]),
                rotation: new Float32Array([${camera.end.rotation.toString()}])
            },
            speedMultiplier: 1.0
        },
        `);
    }
    updateCameraInterpolator() {
        const camera = this.camera[this.currentCamera];
        this.cameraPositionInterpolator.minDuration = this.CAMERA_MIN_DURATION;
        this.cameraPositionInterpolator.position = camera;
        this.cameraPositionInterpolator.reset();
    }
    nextCamera() {
        this.setCameraState(CameraState.Transitioning);
    }
}
exports.Renderer = Renderer;
//# sourceMappingURL=Renderer.js.map