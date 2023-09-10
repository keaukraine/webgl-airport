const CAMERAS_PASSENGER = [
    {
        name: "CAM1 right side",
        start: {
            position: new Float32Array([-7833.58, 1685.874, 2205.098]),
            rotation: new Float32Array([-892.116, 1634.487, 675.177]) // lookat
        },
        end: {
            position: new Float32Array([-7852.91, -1940.758, 2239.207]),
            rotation: new Float32Array([-911.445, -1992.145, 709.2865])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM3 top",
        start: {
            position: new Float32Array([-792.257, 1444.0, 15000]),
            rotation: new Float32Array([37.385, 1444.0, 675.177])
        },
        end: {
            position: new Float32Array([-811.587, -2182.632, 15000]),
            rotation: new Float32Array([18.056, -2182.631, 709.286])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM4 rear-right",
        start: {
            position: new Float32Array([-5114.0, 9242.0, 3773.0]),
            rotation: new Float32Array([831.674, 794.416, 582.775])
        },
        end: {
            position: new Float32Array([-9523.469, 5923.208, 3257.0854]),
            rotation: new Float32Array([-328.607, -121.523, 689.812])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM1 right side again",
        start: {
            position: new Float32Array([-7833.58, 1685.874, 2205.098]),
            rotation: new Float32Array([-892.116, 1634.487, 675.177]) // lookat
        },
        end: {
            position: new Float32Array([-7852.91, -1940.758, 2239.207]),
            rotation: new Float32Array([-911.445, -1992.145, 709.2865])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM2 front",
        start: {
            position: new Float32Array([-2215.693, -9555.0, 555]),
            rotation: new Float32Array([-2215.693, -3240.0, 555])
        },
        end: {
            position: new Float32Array([1741.289, -9555.0, 555]),
            rotation: new Float32Array([1741.289, -3240.0, 555])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM5 left side",
        start: {
            position: new Float32Array([7325.552, -4473.68, 200]),
            rotation: new Float32Array([-3229.788, -748.632, 518.798])
        },
        end: {
            position: new Float32Array([8661.427, -695.325, 200]),
            rotation: new Float32Array([-1893.892, 3029.717, 518.798])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM22 front rotating",
        start: {
            position: new Float32Array([-5889.242, -7895.101, 807.0224609375]),
            rotation: new Float32Array([-365.358, -435.5, 582.775])
        },
        end: {
            position: new Float32Array([4805.492, -7601.44, 809.42236328125]),
            rotation: new Float32Array([-365.358, -435.5, 582.775])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM6 top-right-front",
        start: {
            position: new Float32Array([-6780.02, -2334.765, 10222.003]),
            rotation: new Float32Array([-534.287, 1029.87, 640.805])
        },
        end: {
            position: new Float32Array([-5765.953, -4217.162, 10222.003]),
            rotation: new Float32Array([479.778, -852.527, 640.805])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM7 rear-right",
        start: {
            position: new Float32Array([-1877.286, 9460.406, 409.811]),
            rotation: new Float32Array([4.049, 2756.029, 466.811])
        },
        end: {
            position: new Float32Array([-3733.218, 8939.704, 421.216]),
            rotation: new Float32Array([-1851.883, 2235.328, 478.216])
        },
        speedMultiplier: 1.0
    }
];

const CAMERAS_FIGHTER = [
    {
        name: "CAM 1 left",
        start: {
            position: new Float32Array([-7484.467, -74.101, 1847.05]),
            rotation: new Float32Array([-52.698, -66.7, 364.453])
        },
        end: {
            position: new Float32Array([-7484.07, -1327.915, 1847.05]),
            rotation: new Float32Array([-52.305, -1320.514, 358.366])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM 2 sun",
        start: {
            position: new Float32Array([-7673.017, -7818.335, 810]),
            rotation: new Float32Array([524.432, 1927.873, 1127.0])
        },
        end: {
            position: new Float32Array([-5971.768, -9247.609, 810]),
            rotation: new Float32Array([2225.683, 498.599, 1064.422]) // lookat
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM 3 front",
        start: {
            position: new Float32Array([-1005.96, -6957.012, 247.811]),
            rotation: new Float32Array([-812.29, 1496.877, 502.233])
        },
        end: {
            position: new Float32Array([567.302, -6957.012, 247.811]),
            rotation: new Float32Array([760.972, 1496.877, 502.233]) // lookat
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM 4 sun closeup",
        start: {
            position: new Float32Array([-3075.207, -3666.483, 918.937]),
            rotation: new Float32Array([1255.741, 2147.007, 352.93])
        },
        end: {
            position: new Float32Array([-2235.0, -4293.0, 913.0]),
            rotation: new Float32Array([2095.95, 1520.489, 346.993]) // lookat
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM 5 rear top right",
        start: {
            position: new Float32Array([-3539.456, 3621.527, 5744.958]),
            rotation: new Float32Array([371.456, 306.771, 472.949])
        },
        end: {
            position: new Float32Array([-4356.865, 2703.851, 5715.571]),
            rotation: new Float32Array([-445.953, -610.906, 443.559]) // lookat
        },
        speedMultiplier: 1.0
    }
];

const CAMERAS_PRIVATE = [
    {
        name: "CAM3 left top",
        start: {
            position: new Float32Array([2005.446, -2693.32, 1705.141]),
            rotation: new Float32Array([-58.35, -789.591, 138.574]) // lookat
        },
        end: {
            position: new Float32Array([2273.788, -2389.17, 1721.237]),
            rotation: new Float32Array([209.992, -485.443, 154.67])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM1 front closeup",
        start: {
            position: new Float32Array([-2533.513, -2698.656, 73.579]),
            rotation: new Float32Array([-354.864, -624.051, 198.243]) // lookat
        },
        end: {
            position: new Float32Array([1386.1582, -1952.734, 88.058]),
            rotation: new Float32Array([220.471, -1044, 199])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM6 left w/ horizon",
        start: {
            position: new Float32Array([4436.104, -261.21, 254.898]),
            rotation: new Float32Array([200.171, -431.738, 150.401])
        },
        end: {
            position: new Float32Array([4294.794, -1996.149, 272.635]),
            rotation: new Float32Array([58.862, -1090.961, 168.138])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM2 front horizon",
        start: {
            position: new Float32Array([-446.796, -3889.132, 431.116]),
            rotation: new Float32Array([-446.796, -217.65, 154.693]),
        },
        end: {
            position: new Float32Array([697.888, -3907.597, 431.0]),
            rotation: new Float32Array([697.888, -236.114, 340.048]),
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM4 rear right",
        start: {
            position: new Float32Array([-2375.253, 925.802, 146.927]),
            rotation: new Float32Array([-49.957, -18.69, 254.764])
        },
        end: {
            position: new Float32Array([-2618.334, -388.599, 489.511]),
            rotation: new Float32Array([-342.866, -818.01, 294.263])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM5 top rear",
        start: {
            position: new Float32Array([539.251, -256.327, 3210.38]),
            rotation: new Float32Array([539.251, -583.005, 579.041])
        },
        end: {
            position: new Float32Array([-569.857, -256.327, 3210.38]),
            rotation: new Float32Array([-569.857, -583.005, 579.041])
        },
        speedMultiplier: 1.0
    },
    {
        name: "CAM7 right front sun",
        start: {
            position: new Float32Array([-3837.754, -3486.7137, 259.308]),
            rotation: new Float32Array([-811.25, -777.094, 383.623])
        },
        end: {
            position: new Float32Array([-2635.582, -4522.342, 259.308]),
            rotation: new Float32Array([-411.634, -1223.444, 383.623])
        },
        speedMultiplier: 1.0
    }
];

export const CAMERAS = [
    CAMERAS_PASSENGER,
    CAMERAS_FIGHTER,
    CAMERAS_PRIVATE
];
