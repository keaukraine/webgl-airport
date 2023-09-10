import { FullScreenUtils } from "webgl-framework";
import { Renderer } from "./Renderer";
import { FreeMovement } from "./FreeMovement";
import { GUI } from 'dat.gui'

function ready(fn: () => void) {
    if (document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


let renderer: Renderer;

ready(() => {
    renderer = new Renderer();
    renderer.ready = () => {
        initUI();
    };
    renderer.init("canvasGL", true);
    const canvas = document.getElementById("canvasGL")!;
    new FreeMovement(
        renderer,
        {
            canvas,
            movementSpeed: 1000,
            rotationSpeed: 0.003
        }
    );

    const fullScreenUtils = new FullScreenUtils();

    const toggleFullscreenElement = document.getElementById("toggleFullscreen")!;
    toggleFullscreenElement.addEventListener("click", () => {
        if (document.body.classList.contains("fs")) {
            fullScreenUtils.exitFullScreen();
        } else {
            fullScreenUtils.enterFullScreen();
        }
        fullScreenUtils.addFullScreenListener(function () {
            if (fullScreenUtils.isFullScreen()) {
                document.body.classList.add("fs");
            } else {
                document.body.classList.remove("fs");
            }
        });
    });
});

function initUI(): void {
    document.getElementById("message")?.classList.add("hidden");
    document.getElementById("canvasGL")?.classList.remove("transparent");
    setTimeout(() => document.querySelector(".promo")?.classList.remove("transparent"), 4000);
    setTimeout(() => document.querySelector("#toggleFullscreen")?.classList.remove("transparent"), 1800);

    const config = {
        github: () => window.open("https://github.com/keaukraine/webgl-airport")
    };

    const gui = new GUI();

    gui.add(
        renderer.config,
        "timeOfDay",
        {
            "Day": "DAY",
            "Night": "NIGHT",
            "Sunrise": "SUNRISE",
            "Sunset": "SUNSET"
        }
    )
    .name("Time Of Day")
    .onChange(value => renderer.config.timeOfDay = value);

    gui.add(
        renderer.config,
        "plane",
        {
            "Passenger": "1",
            "Fighter Jet": "2",
            "Private": "3"
        }
    )
    .name("Plane")
    .onChange(value => renderer.changePlane(value));

    gui.add(config, "github").name("Source on Github");
}
