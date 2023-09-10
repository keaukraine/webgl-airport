import { BaseRenderer, DiffuseShader } from "webgl-framework";
import { mat4, vec3 } from "gl-matrix";
type TimeOfDay = "DAY" | "NIGHT" | "SUNRISE" | "SUNSET";
declare enum CameraState {
    Animating = 0,
    Transitioning = 1
}
export declare class Renderer extends BaseRenderer {
    private lastTime;
    private loaded;
    private fmGround;
    private fmGroundColored;
    private fmPlaneShadow;
    private fmTrees;
    private fmClouds;
    private fmPlaneUnlit;
    private fmPlaneLit;
    private fmBus;
    private fmPlaneTraces;
    private fmPlaneDistant;
    private fmLoader;
    private texturePlaneShadowSdf;
    private paletteTextures;
    private mTriangleVerticesVignette;
    private shaderDiffuse;
    private shaderDiffuseTwoColoredSdf;
    private shaderColor;
    private shaderCloud;
    private shaderPlaneTraces;
    private shaderPlaneBody;
    private attribsDiffuseFP32;
    private attribsDiffuseCompact;
    private attribsColorFP32;
    private attribsColorCompact;
    private customCamera;
    private Z_NEAR;
    private Z_FAR;
    private timerCamera;
    private CAMERA_PERIOD;
    private timerBus;
    private timerDistantPlaneRotating;
    private BUS_PERIOD;
    private BUS_X_START;
    private BUS_X_END;
    private BUS_TRAVEL;
    private BUS_Y;
    private timerCloudsRotation;
    private CLOUDS_ROTATION_PERIOD;
    private timerCloudsAnimation;
    private CLOUDS_ANIMATION_PERIOD;
    private cameraMode;
    protected matViewInverted: mat4;
    protected matViewInvertedTransposed: mat4;
    protected matTemp: mat4;
    protected cameraPosition: vec3;
    protected cameraRotation: vec3;
    protected tmpPosition1: [number, number, number];
    protected tmpPosition2: [number, number, number];
    protected tmpPosition3: [number, number, number];
    private timeOfDay;
    config: {
        currentPlane: number;
        sdfBrightness: number;
        sdfContrast: number;
        sdfContrastMax: number;
        timeOfDay: TimeOfDay;
        plane: string;
    };
    private TIMES_OF_DAY;
    private cameraPositionInterpolator;
    private previousCameraReverse;
    private readonly CAMERA_SPEED;
    private readonly CAMERA_MIN_DURATION;
    private currentCamera;
    private stateCamera;
    private CAMERA_TRANSITION_PERIOD;
    private readyCallback;
    private viewDir;
    private viewAngle;
    private readonly PRESETS;
    constructor();
    setCustomCamera(camera: mat4 | undefined, position?: vec3, rotation?: vec3): void;
    resetCustomCamera(): void;
    onBeforeInit(): void;
    onAfterInit(): void;
    onInitError(): void;
    initShaders(): void;
    loadData(): Promise<void>;
    private setupCanvasEvents;
    resizeCanvas(): void;
    animate(): void;
    protected setCameraState(state: CameraState): void;
    /** Calculates projection matrix */
    setCameraFOV(multiplier: number): void;
    /**
     * Calculates camera matrix.
     *
     * @param a Position in [0...1] range
     */
    private positionCamera;
    /** Issues actual draw calls */
    drawScene(): void;
    protected drawVignette(shader: DiffuseShader): void;
    private drawSceneObjects;
    private drawAirplane;
    private drawGround;
    private drawDistantPlane;
    private drawDistantPlaneTraces;
    private calculateTransformMatricesWithBanking;
    changeCameraMode(): void;
    checkGlError(operation: string): void;
    set ready(callback: () => void);
    private get sceneColors();
    private get texturePalette();
    changePlane(plane: string): Promise<void>;
    private get camera();
    private get preset();
    private logCamera;
    private updateCameraInterpolator;
    private nextCamera;
}
export {};
