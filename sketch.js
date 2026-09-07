// ================= 全局配置参数 =================
// 画布设置
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 1060;

// ----- 背景色与渐变参数设置 -----
const BG_COLOR_IDLE = '#000000';       // 静止初始背景色 (HEX)
const BG_GRAD_COLOR_A = '#000000';     // 拖拽渐变端点色 A (HEX)
const BG_GRAD_COLOR_B = '#000000';     // 拖拽渐变端点色 B (HEX)
const BG_BASE_ANGLE_DEG = 45;          // 渐变基准初始角度 (度数)
const BG_ANGLE_SENSITIVITY = 1.8;      // 拖拽位移驱动渐变旋转的灵敏度

let currentBgAngle = 0;                // 实时平滑渐变角度 (弧度)

// ================= 右下角游戏操作杆参数设置 =================
const JOYSTICK_MARGIN_RIGHT = 60;      // 距离右边缘间距 (px)
const JOYSTICK_MARGIN_BOTTOM = 60;     // 距离下边缘间距 (px)
const JOYSTICK_BASE_RADIUS = 36;       // 外层大圆底盘半径 (px)
const JOYSTICK_KNOB_RADIUS = 14;       // 内层小圆摇杆半径 (px)

// 样式与颜色
const JOYSTICK_BASE_STROKE = '#ffffff';// 外圆描边颜色 (HEX)
const JOYSTICK_BASE_STROKE_WEIGHT = 1.5; // 外圆描边粗细 (px)
const JOYSTICK_BASE_FILL = '#000000';  // 外圆底盘填充颜色 (HEX)
const JOYSTICK_BASE_FILL_ALPHA = 0.20; // 外圆底盘填充不透明度 (0.0~1.0)

const JOYSTICK_KNOB_STROKE = '#ffffff';// 内圆描边颜色 (HEX)
const JOYSTICK_KNOB_STROKE_WEIGHT = 1.5; // 内圆描边粗细 (px)
const JOYSTICK_KNOB_FILL = '#ffffff';  // 内圆摇杆填充颜色 (HEX)
const JOYSTICK_KNOB_FILL_ALPHA = 0.40; // 内圆填充不透明度 (0.0~1.0)

const JOYSTICK_BASE_OPACITY = 0.70;    // 静止常驻不透明度 (0.0~1.0)
const JOYSTICK_FADE_OUT_SPEED = 0.18;  // 拖动开始时渐隐速度 (0.01~1.0)
const JOYSTICK_FADE_IN_SPEED = 0.10;   // 松手释放时恢复显现速度 (0.01~1.0)

// 摇杆运行时状态变量
let isJoystickDragging = false;        // 是否正在拖动摇杆小圆
let joystickKnobOffsetX = 0;          // 内层小圆相对中心的水平偏移
let joystickKnobOffsetY = 0;          // 内层小圆相对中心的垂直偏移
let joystickCurrentFade = 1.0;         // 实时透明度因子 (1.0 全显 ~ 0.0 全隐)

// ================= 画布底层独立排版文字参数设置 =================
const BG_CANVAS_TEXT = `李海杰 / 思花
 
2018.09—2022.06 广州美术学院 视觉艺术学院 视觉传达
2022.07—至今 腾讯-微信支付 视觉设计
2025.03—至今 思花 艺术博主 全网 100w+关注

个人主页: xhslink.cn/m/4etbxsNq9T7
Phone / WeChat: 19129214045
Email: 1332785964@qq.com
`;

const BG_CANVAS_TEXT_FONT = 'monospace';   // 字体族
const BG_CANVAS_TEXT_SIZE = 10;            // 字号大小 (px)
const BG_CANVAS_TEXT_LINE_HEIGHT = 20;     // 行高 (px)
const BG_CANVAS_TEXT_PARA_SPACING = 14;    // 段落间距 (px)
const BG_CANVAS_TEXT_COLOR_HEX = '#ffffff';// 独立文字颜色 (HEX)
const BG_CANVAS_TEXT_OPACITY = 0.70;       // 独立文字不透明度 (0.0~1.0)

const BG_CANVAS_MARGIN_TOP = 40;           // 顶边距
const BG_CANVAS_MARGIN_LEFT = 40;          // 左边距
const BG_CANVAS_MARGIN_RIGHT = 60;         // 右边距

// 圆心基准位置
let centerX = CANVAS_WIDTH / 2;
let centerY = CANVAS_HEIGHT / 2;

// ================= 滑动缩放与松手恢复参数设置 =================
const BASE_ZOOM_SCALE = 0.40;          // 静止/恢复时的基准缩放倍率 (1.0 = 原尺寸)
const SLIDE_ZOOM_TARGET_SCALE = 1.6;  // 滑动拖拽时想要达到的目标缩放倍率 (>1.0 放大, <1.0 缩小)
const ZOOM_IN_SPEED = 0.08;           // 滑动时放大插值速度 (0.01~1.0)
const ZOOM_OUT_SPRING_SPEED = 0.09;   // 松手释放后回弹恢复至基准原倍率的速度 (0.01~1.0)

let currentZoomScale = BASE_ZOOM_SCALE; // 实时平滑缩放倍率

// 半径与数量
const MIN_RADIUS = 120;               // 最小圆形半径
const MAX_RADIUS = 360;               // 最大圆形半径
const CIRCLE_COUNT = 22;              // 同心圆数量
const CIRCLE_SEGMENTS = 160;          // 每个圆的分段数量

// 基础圆环线条样式
const STROKE_WEIGHT = 0;              // 同心圆基础线条粗细
const STROKE_COLOR_HEX = '#ffffff';   // 基础线条颜色 (HEX 格式)
const FADE_EDGE = false;              // 是否在最外圈应用淡出

// ================= 核心：每圈独立随机点与随机方向生长参数 =================
const CIRCLE_GROW_SPEED_MIN = 0.03;   // 各圈独立生长速度下限
const CIRCLE_GROW_SPEED_MAX = 0.07;   // 各圈独立生长速度上限
const CIRCLE_SHRINK_SPEED = 0.10;     // 松手时各圈向起点收拢撤退速度

let layerStartAngles = [];            // 每层圆各自独立的随机起点角度 (0 ~ TWO_PI)
let layerDirections = [];             // 每层圆各自独立的延展方向 (+1 顺时针, -1 逆时针)
let layerGrowSpeeds = [];             // 每层圆各自独立的生长速度
let layerGrowProgress = [];           // 每层圆各自实时的生长进度 (0.0 完全未生 ~ 1.0 闭合完整圆)

// ================= 圆心月相双圆参数设置 =================
const CENTER_CIRCLES_RADIUS = 20;     // 圆心两圆的共同半径尺寸 (px)

const CENTER_BASE_CIRCLE_FILL = '#ffffff';     // 底圆亮部填充颜色 (HEX)
const CENTER_BASE_CIRCLE_STROKE = '#63E6FF';   // 底圆轮廓描边颜色 (HEX)
const CENTER_BASE_CIRCLE_STROKE_WEIGHT = 0;    // 底圆轮廓描边粗细

const CENTER_TOP_CIRCLE_FILL = '#000000';      // 阴影遮罩颜色
const TOP_CIRCLE_MOVE_SENSITIVITY = 0.45;      // 上层遮罩受拖动手势影响的位移灵敏度
const TOP_CIRCLE_SPRING_DAMPING = 0.82;        // 上层圆松手回弹阻尼 (0.0~1.0)
const TOP_CIRCLE_SPRING_STIFFNESS = 0.12;      // 上层圆回弹刚度
const TOP_CIRCLE_MAX_OFFSET = 56;              // 上层遮罩最大位移半径限制 (px)

let topCirclePosX = 0;
let topCirclePosY = 0;
let topCircleVelX = 0;
let topCircleVelY = 0;

let centerMaskLayer;
let centerMaskDim;

// ================= 直线周围高光参数设置 =================
const HIGHLIGHT_COLOR_HEX = '#ffffff';// 高光颜色 (HEX 格式)
const HIGHLIGHT_STROKE_WEIGHT = 2.5;  // 高光处圆弧的线条粗细
const HIGHLIGHT_CHANCE = 0.85;        // 每层圆出现高光的概率 (0.0~1.0)
let layerHighlightEnabled = [];       // 保存各层是否启用高光的状态

const LAYER_SPAN_MIN = 20;            // 每层高光覆盖跨度最小值 (度数)
const LAYER_SPAN_MAX = 65;            // 每层高光覆盖跨度最大值 (度数)
let layerBaseSpansSide1 = [];         // 各层正向端基准覆盖跨度
let layerBaseSpansSide2 = [];         // 各层反向端基准覆盖跨度
let layerEffectiveSpansSide1 = [];    // 摆动时动态计算的实时跨度
let layerEffectiveSpansSide2 = [];

const LAYER_SWING_AMP_MIN = 12.0;     // 各层来回摆动振幅下限 (度数)
const LAYER_SWING_AMP_MAX = 35.0;     // 各层来回摆动振幅上限 (度数)
const LAYER_SWING_SPEED_MIN = 0.04;   // 各层独立摆速下限 (弧度/帧)
const LAYER_SWING_SPEED_MAX = 0.14;   // 各层独立摆速上限 (弧度/帧)
const LAYER_SWING_EASING = 0.10;      // 拖拽激活起摆速度
const LAYER_SWING_DAMPING = 0.82;     // 静止/松手刹停阻尼

let layerSwingSpeeds = [];            // 每层独立的摆动频率
let layerSwingPhases = [];            // 每层独立的摆动正弦相位
let layerTargetAmps = [];             // 拖拽时每层分配的目标最大振幅
let layerCurrentAmps = [];            // 每层平滑插值后的当前实际振幅
let layerCurrentRotAngles = [];       // 每层当前最终自转角 (弧度)

const OVERALL_ROTATION_OFFSET_DEG = 18;
const LAYER_ANGLE_OFFSET_MIN = -12;   // 静态偏差下限 (度数)
const LAYER_ANGLE_OFFSET_MAX = 12;    // 静态偏差上限 (度数)
let layerAngleOffsets = [];           // 存储每层的独立初始偏角

// ================= 沿圆周多层回行文字设置 =================
const PRESET_TEXT = `2018.09—2022.06 Guangzhou Academy of Fine Arts Visual Communication Design

2022.07—Present Tencent · WeChat Pay Visual Designer

2025.03—Present 思花AI × Creative Coding Artist 1M+ Followers
Profile: xhslink.cn/m/4etbxsNq9T7

Phone / WeChat: 19129214045
Email: 1332785964@qq.com`;

const TEXT_FONT_FAMILY = 'monospace'; // 等宽字体
const TEXT_FONT_SIZE = 8;             // 文字字号大小 (px)
const TEXT_COLOR_HEX = '#ffffff';     // 文字颜色 (HEX 格式)
const TEXT_MIN_RADIUS = 70;           // 允许排文字的最小内圈半径
const TEXT_APPEAR_THRESHOLD = 0.15;   // 显现阈值 (0.0~1.0)
const CHAR_GRID_WIDTH = 8;            // 每个文字格子的切向弧长尺寸 (px)
const TEXT_SHOW_ON_BOTH_SIDES = true; // 两端对齐显示相同文本

const TEXT_REVEAL_SPEED = 0.0515;     // 手势位移时文字推进显现速度
let textRevealProgress = 0;           // 文字显现进度 (0.0 ~ 1.0)
let charRandomOrder = [];             // 存储字符槽位的随机显现优先级列表

const TEXT_INSET_MODE = 'absolute';   // 内移模式
const TEXT_RADIAL_INSET = 8;          // 向圆心内缩距离 (px)

// ================= 直线及顺时针独立随机旋转动力学设置 =================
const TRIGGER_LINE_COUNT_MIN = 1;     // 每次触发直线数量下限
const TRIGGER_LINE_COUNT_MAX = 3;     // 每次触发直线数量上限
const LINE_ANGLE_MIN = 0;             // 直线基准角度下限 (度数)
const LINE_ANGLE_MAX = 360;           // 直线基准角度上限 (度数)
const LINE_STROKE_WEIGHT = 1.0;       // 直线粗细
const LINE_COLOR_HEX = '#ffffff';     // 直线颜色 (HEX 格式)

// --- 顺时针持续旋转动力学参数 ---
const LINE_ROT_SPEED_MIN = 0.40;      // 直线顺时针旋转速度下限 (度/帧)
const LINE_ROT_SPEED_MAX = 1.60;      // 直线顺时针旋转速度上限 (度/帧)
const LINE_ROT_EASING = 0.10;         // 拖拽激活时的加速平滑系数
const LINE_ROT_DAMPING = 0.06;        // 松手后的减速刹停平滑系数

let activeLineCount = 1;              // 当前生效的随机直线数量
let lineBaseAngles = [];              // 各条直线的初始随机角度 (度数)
let lineTargetSpeeds = [];            // 拖拽时各直线的顺时针目标旋转速度 (度/帧)
let lineCurrentSpeeds = [];           // 各直线当前的实际旋转速度 (度/帧)
let lineRotationAngles = [];          // 各直线实时累加的顺时针自转角度 (度数)

// ================= 手势显隐与过渡参数 =================
const FADE_IN_SPEED = 0.20;           // 手势拖动时显现速度
const FADE_OUT_SPEED = 0.12;          // 手势松开时淡出消失速度
let gestureVisibility = 0;            // 实时显隐强度：0.0 (隐藏) ~ 1.0 (显示)

const ROTATE_SENSITIVITY = 0.006;     // 手势旋转灵敏度
const SPRING_STIFFNESS = 0.03;        // 回弹刚度
const SPRING_DAMPING = 0.72;          // 阻尼系数

let rotX = 0, rotY = 0, rotZ = 0;     // 累积三轴旋转角
let velX = 0, velY = 0, velZ = 0;     // 旋转角速度
let isDragging = false;

// 离屏 2D 图层句柄
let textLayer;
let textLayerDim;
let bgTextLayer;                       // 专属底层独立排版文字图层
// ===============================================

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);
  ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 4000);
  noFill();
  noCursor();

  currentBgAngle = radians(BG_BASE_ANGLE_DEG);

  // 1. 环形文字贴图图层
  textLayerDim = Math.ceil(MAX_RADIUS * 2 + 100);
  textLayer = createGraphics(textLayerDim, textLayerDim);
  textLayer.textAlign(CENTER, CENTER);
  textLayer.textFont(TEXT_FONT_FAMILY);

  // 2. 专属底层 2D 排版文字图层
  bgTextLayer = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
  renderCanvasBackgroundTypography(bgTextLayer);

  // 3. 月相遮罩图层
  centerMaskDim = Math.ceil(CENTER_CIRCLES_RADIUS * 4);
  centerMaskLayer = createGraphics(centerMaskDim, centerMaskDim);

  for (let i = 0; i < CIRCLE_COUNT; i++) {
    layerSwingSpeeds.push(0);
    layerSwingPhases.push(random(TWO_PI));
    layerTargetAmps.push(0);
    layerCurrentAmps.push(0);
    layerCurrentRotAngles.push(0);
    layerEffectiveSpansSide1.push(30);
    layerEffectiveSpansSide2.push(30);

    layerStartAngles.push(random(TWO_PI));
    layerDirections.push(random() < 0.5 ? 1 : -1);
    layerGrowSpeeds.push(random(CIRCLE_GROW_SPEED_MIN, CIRCLE_GROW_SPEED_MAX));
    layerGrowProgress.push(0);
  }

  generateCharRandomOrder();
  refreshLayerRandomProperties();
  refreshRandomLines();
}

function draw() {
  let isMoving = isDragging && (mouseX !== pmouseX || mouseY !== pmouseY);

  if (!isDragging) {
    currentZoomScale = lerp(currentZoomScale, BASE_ZOOM_SCALE, ZOOM_OUT_SPRING_SPEED);

    let forceX = -rotX * SPRING_STIFFNESS;
    let forceY = -rotY * SPRING_STIFFNESS;
    let forceZ = -rotZ * SPRING_STIFFNESS;

    velX = (velX + forceX) * SPRING_DAMPING;
    velY = (velY + forceY) * SPRING_DAMPING;
    velZ = (velZ + forceZ) * SPRING_DAMPING;

    gestureVisibility = lerp(gestureVisibility, 0, FADE_OUT_SPEED);
    textRevealProgress = lerp(textRevealProgress, 0, 0.08);

    let baseRad = radians(BG_BASE_ANGLE_DEG);
    currentBgAngle = lerp(currentBgAngle, baseRad, 0.08);

    for (let i = 0; i < CIRCLE_COUNT; i++) {
      layerGrowProgress[i] = lerp(layerGrowProgress[i], 0, CIRCLE_SHRINK_SPEED);
      layerCurrentAmps[i] = lerp(layerCurrentAmps[i], 0, LAYER_SWING_DAMPING);
      layerCurrentRotAngles[i] = lerp(layerCurrentRotAngles[i], 0, 0.08);
    }

    // 松手时直线的旋转速度平滑减速刹停
    for (let k = 0; k < activeLineCount; k++) {
      lineCurrentSpeeds[k] = lerp(lineCurrentSpeeds[k], 0, LINE_ROT_DAMPING);
      lineRotationAngles[k] += lineCurrentSpeeds[k];
    }

    let springForceX = -topCirclePosX * TOP_CIRCLE_SPRING_STIFFNESS;
    let springForceY = -topCirclePosY * TOP_CIRCLE_SPRING_STIFFNESS;
    topCircleVelX = (topCircleVelX + springForceX) * TOP_CIRCLE_SPRING_DAMPING;
    topCircleVelY = (topCircleVelY + springForceY) * TOP_CIRCLE_SPRING_DAMPING;
    topCirclePosX += topCircleVelX;
    topCirclePosY += topCircleVelY;

    // 摇杆松手释放后恢复显现，小圆弹性归零
    joystickKnobOffsetX = lerp(joystickKnobOffsetX, 0, 0.15);
    joystickKnobOffsetY = lerp(joystickKnobOffsetY, 0, 0.15);
    joystickCurrentFade = lerp(joystickCurrentFade, 1.0, JOYSTICK_FADE_IN_SPEED);
  } else {
    currentZoomScale = lerp(currentZoomScale, SLIDE_ZOOM_TARGET_SCALE, ZOOM_IN_SPEED);
    gestureVisibility = lerp(gestureVisibility, 1.0, FADE_IN_SPEED);

    let targetGradAngle = radians(BG_BASE_ANGLE_DEG) + rotZ + (rotY - rotX) * BG_ANGLE_SENSITIVITY;
    currentBgAngle = lerp(currentBgAngle, targetGradAngle, 0.12);

    if (isMoving) {
      textRevealProgress = constrain(textRevealProgress + TEXT_REVEAL_SPEED, 0, 1.0);
    }

    for (let i = 0; i < CIRCLE_COUNT; i++) {
      if (isMoving) {
        layerGrowProgress[i] = constrain(layerGrowProgress[i] + layerGrowSpeeds[i], 0, 1.0);
      }
    }

    // 拖拽激活中：只要按住，直线就持续以各自独立的随机速度顺时针旋转
    for (let k = 0; k < activeLineCount; k++) {
      lineCurrentSpeeds[k] = lerp(lineCurrentSpeeds[k], lineTargetSpeeds[k], LINE_ROT_EASING);
      lineRotationAngles[k] += lineCurrentSpeeds[k];
    }

    topCircleVelX *= 0.65;
    topCircleVelY *= 0.65;
    topCirclePosX += topCircleVelX;
    topCirclePosY += topCircleVelY;

    let d = Math.sqrt(topCirclePosX * topCirclePosX + topCirclePosY * topCirclePosY);
    if (d > TOP_CIRCLE_MAX_OFFSET) {
      let scaleFactor = TOP_CIRCLE_MAX_OFFSET / d;
      topCirclePosX *= scaleFactor;
      topCirclePosY *= scaleFactor;
    }

    for (let i = 0; i < CIRCLE_COUNT; i++) {
      if (isMoving) {
        layerCurrentAmps[i] = lerp(layerCurrentAmps[i], layerTargetAmps[i], LAYER_SWING_EASING);
        layerSwingPhases[i] += layerSwingSpeeds[i];
      } else {
        layerCurrentAmps[i] = lerp(layerCurrentAmps[i], 0, 0.20);
      }

      let swingDelta = sin(layerSwingPhases[i]) * radians(layerCurrentAmps[i]);
      layerCurrentRotAngles[i] = swingDelta;

      let spanModulation = cos(layerSwingPhases[i] * 1.5) * 12.0;
      layerEffectiveSpansSide1[i] = constrain(layerBaseSpansSide1[i] + spanModulation, LAYER_SPAN_MIN, LAYER_SPAN_MAX);
      layerEffectiveSpansSide2[i] = constrain(layerBaseSpansSide2[i] - spanModulation, LAYER_SPAN_MIN, LAYER_SPAN_MAX);
    }

    // 拖动时摇杆平滑淡出
    joystickCurrentFade = lerp(joystickCurrentFade, 0.0, JOYSTICK_FADE_OUT_SPEED);
  }

  if (gestureVisibility < 0.001) {
    gestureVisibility = 0;
  }

  rotX += velX;
  rotY += velY;
  rotZ += velZ;

  // ---------------- 0. 最底层：动态线性渐变背景 (Z = -500) ----------------
  renderDynamicGradientBackground(gestureVisibility, currentBgAngle);

  // ---------------- 0.5. 底层独立 2D 排版文字层 (Z = -400) ----------------
  push();
  translate(0, 0, -400);
  noStroke();
  noTint();
  texture(bgTextLayer);
  plane(CANVAS_WIDTH, CANVAS_HEIGHT);
  pop();

  // 计算每条顺时针旋转直线的实时角度与空间投影
  let linesData = [];
  for (let k = 0; k < activeLineCount; k++) {
    let effectiveDeg = lineBaseAngles[k] + OVERALL_ROTATION_OFFSET_DEG + lineRotationAngles[k];
    let rad = radians(effectiveDeg);
    let isect = getIntersectionData(rad, MAX_RADIUS, rotX, rotY, rotZ);
    linesData.push({
      targetAngleRad: rad,
      localRayAngle: isect.localAngle,
      dynamicRadius: isect.length
    });
  }

  let baseColor = color(STROKE_COLOR_HEX);
  let highlightColor = color(HIGHLIGHT_COLOR_HEX);
  let txtColor = color(TEXT_COLOR_HEX);

  let textAlphaFactor = 0;
  if (gestureVisibility > TEXT_APPEAR_THRESHOLD) {
    textAlphaFactor = map(gestureVisibility, TEXT_APPEAR_THRESHOLD, 1.0, 0, 1.0, true);
  }

  const ringSpacing = CIRCLE_COUNT > 1 ? (MAX_RADIUS - MIN_RADIUS) / (CIRCLE_COUNT - 1) : 0;

  // ---------------- 1. 离屏 2D 画布排版圆周文字 ----------------
  textLayer.clear();

  if (textAlphaFactor > 0 && textRevealProgress > 0) {
    textLayer.push();
    textLayer.translate(textLayer.width / 2, textLayer.height / 2);

    for (let k = 0; k < activeLineCount; k++) {
      let currentRayAngle = linesData[k].localRayAngle;

      renderMultiLayerWrappedText(
        textLayer,
        PRESET_TEXT,
        ringSpacing,
        currentRayAngle,
        layerEffectiveSpansSide1,
        txtColor,
        textAlphaFactor * 255,
        textRevealProgress
      );

      if (TEXT_SHOW_ON_BOTH_SIDES) {
        renderMultiLayerWrappedText(
          textLayer,
          PRESET_TEXT,
          ringSpacing,
          currentRayAngle + PI,
          layerEffectiveSpansSide2,
          txtColor,
          textAlphaFactor * 255,
          textRevealProgress
        );
      }
    }

    textLayer.pop();
  }

  // ---------------- 2. 离屏渲染月相 ----------------
  centerMaskLayer.clear();
  let midM = centerMaskDim / 2;
  let ctx = centerMaskLayer.drawingContext;

  centerMaskLayer.push();
  centerMaskLayer.translate(midM, midM);

  centerMaskLayer.fill(color(CENTER_BASE_CIRCLE_FILL));
  centerMaskLayer.noStroke();
  centerMaskLayer.circle(0, 0, CENTER_CIRCLES_RADIUS * 2);

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, CENTER_CIRCLES_RADIUS, 0, Math.PI * 2);
  ctx.clip();

  centerMaskLayer.fill(color(CENTER_TOP_CIRCLE_FILL));
  centerMaskLayer.noStroke();
  centerMaskLayer.circle(topCirclePosX, topCirclePosY, CENTER_CIRCLES_RADIUS * 2);
  ctx.restore();

  if (CENTER_BASE_CIRCLE_STROKE_WEIGHT > 0) {
    centerMaskLayer.noFill();
    centerMaskLayer.stroke(color(CENTER_BASE_CIRCLE_STROKE));
    centerMaskLayer.strokeWeight(CENTER_BASE_CIRCLE_STROKE_WEIGHT);
    centerMaskLayer.circle(0, 0, CENTER_CIRCLES_RADIUS * 2);
  }

  centerMaskLayer.pop();

  // ---------------- 3. 绘制 3D 同心圆、圆心月牙及文字贴图 ----------------
  push();
  translate(centerX - width / 2, centerY - height / 2, 0);

  scale(currentZoomScale);

  rotateX(rotX);
  rotateY(rotY);
  rotateZ(rotZ);

  // A. 绘制各层圆环
  for (let i = 0; i < CIRCLE_COUNT; i++) {
    let growProg = layerGrowProgress[i];
    if (growProg <= 0.001) continue;

    let currentRadius = CIRCLE_COUNT === 1 ? (MIN_RADIUS + MAX_RADIUS) / 2 : MIN_RADIUS + i * ringSpacing;
    let progress = CIRCLE_COUNT > 1 ? i / (CIRCLE_COUNT - 1) : 0;
    let baseAlpha = FADE_EDGE ? lerp(255, 60, progress) : 255;
    
    let segAlpha = baseAlpha * constrain(growProg * 2.0, 0, 1.0);
    let hasHighlight = layerHighlightEnabled[i];

    let halfSpanRad1 = radians(layerEffectiveSpansSide1[i] / 2);
    let halfSpanRad2 = radians(layerEffectiveSpansSide2[i] / 2);

    let startA = layerStartAngles[i];
    let dir = layerDirections[i];
    let visibleArcSpan = TWO_PI * growProg;

    push();
    rotateZ(layerCurrentRotAngles[i]);

    for (let s = 0; s < CIRCLE_SEGMENTS; s++) {
      let a1 = (TWO_PI / CIRCLE_SEGMENTS) * s;
      let a2 = (TWO_PI / CIRCLE_SEGMENTS) * (s + 1);
      let midAngle = (a1 + a2) / 2;

      let deltaAngle = 0;
      if (dir > 0) {
        deltaAngle = (midAngle - startA + TWO_PI * 4) % TWO_PI;
      } else {
        deltaAngle = (startA - midAngle + TWO_PI * 4) % TWO_PI;
      }

      if (deltaAngle > visibleArcSpan) {
        continue;
      }

      let maxHighlightIntensity = 0;

      if (hasHighlight && gestureVisibility > 0) {
        for (let k = 0; k < activeLineCount; k++) {
          let layerLocalAngle = linesData[k].localRayAngle - layerCurrentRotAngles[i] + radians(layerAngleOffsets[i]);

          let diff1 = Math.abs(normalizeAngle(midAngle - layerLocalAngle));
          let diff2 = Math.abs(normalizeAngle(midAngle - (layerLocalAngle + PI)));

          let norm1 = diff1 < halfSpanRad1 ? diff1 / halfSpanRad1 : 1;
          let norm2 = diff2 < halfSpanRad2 ? diff2 / halfSpanRad2 : 1;
          let minNorm = Math.min(norm1, norm2);

          if (minNorm < 1) {
            let intensity = cos(minNorm * HALF_PI);
            if (intensity > maxHighlightIntensity) {
              maxHighlightIntensity = intensity;
            }
          }
        }
      }

      let segColor = baseColor;
      let segWeight = STROKE_WEIGHT;

      if (maxHighlightIntensity > 0) {
        let totalIntensity = maxHighlightIntensity * gestureVisibility;
        segColor = lerpColor(baseColor, highlightColor, totalIntensity);
        segWeight = lerp(STROKE_WEIGHT, HIGHLIGHT_STROKE_WEIGHT, totalIntensity);
      }

      if (segWeight > 0) {
        stroke(red(segColor), green(segColor), blue(segColor), segAlpha);
        strokeWeight(segWeight);

        let x1 = cos(a1) * currentRadius;
        let y1 = sin(a1) * currentRadius;
        let x2 = cos(a2) * currentRadius;
        let y2 = sin(a2) * currentRadius;

        line(x1, y1, 0, x2, y2, 0);
      }
    }
    pop();
  }

  // B. 绘制圆心月牙组件
  push();
  translate(0, 0, 0.8);
  noStroke();
  texture(centerMaskLayer);
  plane(centerMaskDim, centerMaskDim);
  pop();

  // C. 3D 贴合文字层
  if (textAlphaFactor > 0 && textRevealProgress > 0) {
    push();
    translate(0, 0, 1.5);
    noStroke();
    texture(textLayer);
    plane(textLayerDim, textLayerDim);
    pop();
  }

  pop();

  // ---------------- 4. 绘制多条顺时针旋转导引直线 ----------------
  if (gestureVisibility > 0 && LINE_STROKE_WEIGHT > 0) {
    push();
    translate(centerX - width / 2, centerY - height / 2, 0);
    scale(currentZoomScale);

    for (let k = 0; k < activeLineCount; k++) {
      let lData = linesData[k];
      let endX1 = cos(lData.targetAngleRad) * lData.dynamicRadius;
      let endY1 = sin(lData.targetAngleRad) * lData.dynamicRadius;
      let endX2 = -endX1;
      let endY2 = -endY1;

      let alphaMultiplier = k === 0 ? 1.0 : 0.65;
      strokeWeight(LINE_STROKE_WEIGHT);
      let lineCol = color(LINE_COLOR_HEX);
      stroke(red(lineCol), green(lineCol), blue(lineCol), 255 * gestureVisibility * alphaMultiplier);
      line(endX1, endY1, 0, endX2, endY2, 0);
    }

    pop();
  }

  // ---------------- 5. 顶层 2D 绘制：可拖拽游戏摇杆 ----------------
  renderBottomRightJoystick(joystickCurrentFade);
}

/**
 * 绘制右下角双圆游戏操作杆组件
 */
function renderBottomRightJoystick(fadeAlphaFactor) {
  let effectiveAlpha = fadeAlphaFactor * JOYSTICK_BASE_OPACITY;
  if (effectiveAlpha <= 0.005) return;

  push();
  translate(-width / 2, -height / 2, 100);

  let cx = width - JOYSTICK_MARGIN_RIGHT - JOYSTICK_BASE_RADIUS;
  let cy = height - JOYSTICK_MARGIN_BOTTOM - JOYSTICK_BASE_RADIUS;

  // 1. 绘制外层大圆底盘
  let cBaseStroke = color(JOYSTICK_BASE_STROKE);
  let cBaseFill = color(JOYSTICK_BASE_FILL);
  stroke(red(cBaseStroke), green(cBaseStroke), blue(cBaseStroke), effectiveAlpha * 255);
  strokeWeight(JOYSTICK_BASE_STROKE_WEIGHT);
  fill(red(cBaseFill), green(cBaseFill), blue(cBaseFill), effectiveAlpha * JOYSTICK_BASE_FILL_ALPHA * 255);
  circle(cx, cy, JOYSTICK_BASE_RADIUS * 2);

  // 2. 绘制内层小圆摇杆
  let knobX = cx + joystickKnobOffsetX;
  let knobY = cy + joystickKnobOffsetY;

  let cKnobStroke = color(JOYSTICK_KNOB_STROKE);
  let cKnobFill = color(JOYSTICK_KNOB_FILL);
  stroke(red(cKnobStroke), green(cKnobStroke), blue(cKnobStroke), effectiveAlpha * 255);
  strokeWeight(JOYSTICK_KNOB_STROKE_WEIGHT);
  fill(red(cKnobFill), green(cKnobFill), blue(cKnobFill), effectiveAlpha * JOYSTICK_KNOB_FILL_ALPHA * 255);
  circle(knobX, knobY, JOYSTICK_KNOB_RADIUS * 2);

  pop();
}

/**
 * 在正交投影底层渲染自适应过渡与角度旋转的线性渐变底板
 */
function renderDynamicGradientBackground(fadeT, angleRad) {
  let cIdle = color(BG_COLOR_IDLE);
  let cGradA = color(BG_GRAD_COLOR_A);
  let cGradB = color(BG_GRAD_COLOR_B);

  let currentA = lerpColor(cIdle, cGradA, fadeT);
  let currentB = lerpColor(cIdle, cGradB, fadeT);

  push();
  translate(0, 0, -500);
  rotateZ(angleRad);
  noStroke();

  let diag = Math.sqrt(width * width + height * height) * 1.2;
  let halfD = diag / 2;

  beginShape(QUADS);
  fill(currentA);
  vertex(-halfD, -halfD);
  vertex(halfD, -halfD);

  fill(currentB);
  vertex(halfD, halfD);
  vertex(-halfD, halfD);
  endShape();

  pop();
}

/**
 * 专属函数：使用独立字段与排版配置在离屏层渲染画布底层 2D 文字
 */
function renderCanvasBackgroundTypography(pg) {
  pg.clear();
  pg.textFont(BG_CANVAS_TEXT_FONT);
  pg.textSize(BG_CANVAS_TEXT_SIZE);
  pg.textAlign(LEFT, TOP);
  pg.noStroke();

  let c = color(BG_CANVAS_TEXT_COLOR_HEX);
  pg.fill(red(c), green(c), blue(c), BG_CANVAS_TEXT_OPACITY * 255);

  let maxWidth = CANVAS_WIDTH - BG_CANVAS_MARGIN_LEFT - BG_CANVAS_MARGIN_RIGHT;
  let startX = BG_CANVAS_MARGIN_LEFT;
  let currentY = BG_CANVAS_MARGIN_TOP;

  let paragraphs = BG_CANVAS_TEXT.split(/\r?\n/);

  for (let p = 0; p < paragraphs.length; p++) {
    let rawPara = paragraphs[p];

    if (rawPara.trim() === '') {
      currentY += BG_CANVAS_TEXT_PARA_SPACING;
      continue;
    }

    let words = rawPara.split(' ');
    let currentLine = '';

    for (let w = 0; w < words.length; w++) {
      let word = words[w];
      let testLine = currentLine.length === 0 ? word : currentLine + ' ' + word;
      let testW = pg.textWidth(testLine);

      if (testW > maxWidth && currentLine.length > 0) {
        pg.text(currentLine, startX, currentY);
        currentY += BG_CANVAS_TEXT_LINE_HEIGHT;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine.length > 0) {
      pg.text(currentLine, startX, currentY);
      currentY += BG_CANVAS_TEXT_LINE_HEIGHT;
    }
  }
}

/**
 * 每一层按自身的实时自转角与动态开角进行网格折行 (圆环文字)
 */
function renderMultiLayerWrappedText(g, fullText, ringSpacing, baseAngle, spansArray, col, alphaVal, revealProg) {
  if (!fullText || fullText.length === 0) return;

  g.textSize(TEXT_FONT_SIZE);
  g.noStroke();

  let charCursor = 0;
  let totalLength = fullText.length;
  let maxVisibleChars = Math.floor(totalLength * revealProg);

  for (let layer = CIRCLE_COUNT - 1; layer >= 0; layer--) {
    if (charCursor >= totalLength) break;

    if (layerGrowProgress[layer] < 0.15) {
      continue;
    }

    let ringRadius = CIRCLE_COUNT === 1 ? (MIN_RADIUS + MAX_RADIUS) / 2 : MIN_RADIUS + layer * ringSpacing;

    if (!layerHighlightEnabled[layer] || ringRadius < TEXT_MIN_RADIUS) {
      continue;
    }

    let layerCenterAngle = baseAngle + layerCurrentRotAngles[layer] + radians(layerAngleOffsets[layer]);
    let layerHalfSpan = radians(spansArray[layer] / 2);

    let insetDist = 0;
    if (TEXT_INSET_MODE === 'step_ratio') {
      insetDist = ringSpacing * TEXT_RADIAL_INSET;
    } else {
      insetDist = TEXT_RADIAL_INSET;
    }
    let textRadius = Math.max(10, ringRadius - insetDist);

    let angularSpacing = CHAR_GRID_WIDTH / textRadius;
    let availableArcAngle = layerHalfSpan * 1.8;
    let capacity = Math.floor(availableArcAngle / angularSpacing);

    if (capacity <= 0) continue;

    let countInThisLayer = 0;
    while (charCursor + countInThisLayer < totalLength && countInThisLayer < capacity) {
      let ch = fullText[charCursor + countInThisLayer];
      if (ch === '\n' || ch === '\r') {
        break;
      }
      countInThisLayer++;
    }

    if (countInThisLayer > 0) {
      let startAngle = layerCenterAngle - ((countInThisLayer - 1) * angularSpacing) / 2;

      for (let i = 0; i < countInThisLayer; i++) {
        let charIdx = charCursor + i;
        let charAngle = startAngle + i * angularSpacing;
        let charDiff = Math.abs(normalizeAngle(charAngle - layerCenterAngle));

        let norm = constrain(charDiff / layerHalfSpan, 0, 1);
        let charIntensity = cos(norm * HALF_PI);

        let isVisible = false;
        let charRevealAlpha = 0;

        if (charIdx < charRandomOrder.length) {
          let orderRank = charRandomOrder[charIdx];
          if (orderRank < maxVisibleChars) {
            isVisible = true;
            let diffToEdge = maxVisibleChars - orderRank;
            charRevealAlpha = constrain(map(diffToEdge, 0, 4, 0.25, 1.0), 0.25, 1.0);
          }
        }

        if (isVisible) {
          let finalAlpha = alphaVal * charIntensity * charRevealAlpha * constrain(layerGrowProgress[layer] * 1.5, 0, 1.0);
          g.fill(red(col), green(col), blue(col), finalAlpha);

          let x = cos(charAngle) * textRadius;
          let y = sin(charAngle) * textRadius;

          g.push();
          g.translate(x, y);
          g.rotate(charAngle + HALF_PI);
          g.text(fullText[charIdx], 0, 0);
          g.pop();
        }
      }
    }

    charCursor += countInThisLayer;
    while (charCursor < totalLength && (fullText[charCursor] === '\n' || fullText[charCursor] === '\r')) {
      charCursor++;
    }
  }
}

function generateCharRandomOrder() {
  charRandomOrder = [];
  let len = PRESET_TEXT.length;
  for (let i = 0; i < len; i++) {
    charRandomOrder.push(i);
  }
  for (let i = len - 1; i > 0; i--) {
    let j = Math.floor(random(i + 1));
    let temp = charRandomOrder[i];
    charRandomOrder[i] = charRandomOrder[j];
    charRandomOrder[j] = temp;
  }
}

function refreshLayerRandomProperties() {
  layerHighlightEnabled = [];
  layerBaseSpansSide1 = [];
  layerBaseSpansSide2 = [];
  layerAngleOffsets = [];
  layerSwingSpeeds = [];
  layerTargetAmps = [];

  for (let i = 0; i < CIRCLE_COUNT; i++) {
    layerHighlightEnabled.push(random() < HIGHLIGHT_CHANCE);
    layerBaseSpansSide1.push(random(LAYER_SPAN_MIN, LAYER_SPAN_MAX));
    layerBaseSpansSide2.push(random(LAYER_SPAN_MIN, LAYER_SPAN_MAX));
    layerAngleOffsets.push(random(LAYER_ANGLE_OFFSET_MIN, LAYER_ANGLE_OFFSET_MAX));

    layerSwingSpeeds.push(random(LAYER_SWING_SPEED_MIN, LAYER_SWING_SPEED_MAX));
    layerTargetAmps.push(random(LAYER_SWING_AMP_MIN, LAYER_SWING_AMP_MAX));
  }
}

function refreshRandomLines() {
  activeLineCount = floor(random(TRIGGER_LINE_COUNT_MIN, TRIGGER_LINE_COUNT_MAX + 1));
  lineBaseAngles = [];
  lineTargetSpeeds = [];
  lineCurrentSpeeds = [];
  lineRotationAngles = [];

  for (let k = 0; k < activeLineCount; k++) {
    let spreadAngle = random(LINE_ANGLE_MIN, LINE_ANGLE_MAX) + (k * 22);
    lineBaseAngles.push(spreadAngle);
    lineTargetSpeeds.push(random(LINE_ROT_SPEED_MIN, LINE_ROT_SPEED_MAX));
    lineCurrentSpeeds.push(0);
    lineRotationAngles.push(0);
  }
}

function refreshCircleGrowthProperties() {
  layerStartAngles = [];
  layerDirections = [];
  layerGrowSpeeds = [];
  for (let i = 0; i < CIRCLE_COUNT; i++) {
    layerStartAngles.push(random(TWO_PI));
    layerDirections.push(random() < 0.5 ? 1 : -1);
    layerGrowSpeeds.push(random(CIRCLE_GROW_SPEED_MIN, CIRCLE_GROW_SPEED_MAX));
  }
}

function getIntersectionData(theta, R, rx, ry, rz) {
  let cx = cos(rx), sx = sin(rx);
  let cy = cos(ry), sy = sin(ry);
  let cz = cos(rz), sz = sin(rz);

  let ux = cy * cz;
  let uy = cx * sz + sx * sy * cz;

  let vx = -cy * sz;
  let vy = cx * cz - sx * sy * sz;

  let cosT = cos(theta);
  let sinT = sin(theta);

  let A = uy * cosT - ux * sinT;
  let B = vy * cosT - vx * sinT;

  const EPSILON = 1e-6;
  if (Math.abs(A) < EPSILON && Math.abs(B) < EPSILON) {
    return {
      localAngle: theta,
      length: R
    };
  }

  let t = atan2(-A, B);

  let x = R * (ux * cos(t) + vx * sin(t));
  let y = R * (uy * cos(t) + vy * sin(t));
  let proj = x * cosT + y * sinT;

  if (proj < 0) {
    t += PI;
    proj = -proj;
  }

  return {
    localAngle: normalizeAngle(t),
    length: Math.abs(proj)
  };
}

function normalizeAngle(ang) {
  ang = ang % TWO_PI;
  if (ang > PI) ang -= TWO_PI;
  if (ang < -PI) ang += TWO_PI;
  return ang;
}

function isMouseInsideJoystick() {
  let jCenterX = width - JOYSTICK_MARGIN_RIGHT - JOYSTICK_BASE_RADIUS;
  let jCenterY = height - JOYSTICK_MARGIN_BOTTOM - JOYSTICK_BASE_RADIUS;
  let distToJ = dist(mouseX, mouseY, jCenterX, jCenterY);
  return distToJ <= (JOYSTICK_BASE_RADIUS + 12);
}

function mousePressed() {
  if (!isDragging) {
    generateCharRandomOrder();
    refreshLayerRandomProperties();
    refreshRandomLines();
    refreshCircleGrowthProperties();
  }

  isDragging = true;
  isJoystickDragging = isMouseInsideJoystick();

  if (isJoystickDragging) {
    updateJoystickKnobPosition();
  }
}

function mouseDragged() {
  if (!isDragging) {
    mousePressed();
  }

  let dx = mouseX - pmouseX;
  let dy = mouseY - pmouseY;

  if (isJoystickDragging) {
    updateJoystickKnobPosition();
  }

  velX += -dy * ROTATE_SENSITIVITY;
  velY += dx * ROTATE_SENSITIVITY;

  let offsetX = (mouseX - width / 2) / (width / 2);
  let offsetY = (mouseY - height / 2) / (height / 2);
  let torque = (offsetX * dy - offsetY * dx) * 0.5;
  velZ += torque * ROTATE_SENSITIVITY;

  velX *= 0.7;
  velY *= 0.7;
  velZ *= 0.7;

  topCircleVelX += dx * TOP_CIRCLE_MOVE_SENSITIVITY;
  topCircleVelY += dy * TOP_CIRCLE_MOVE_SENSITIVITY;

  return false;
}

function updateJoystickKnobPosition() {
  let jCenterX = width - JOYSTICK_MARGIN_RIGHT - JOYSTICK_BASE_RADIUS;
  let jCenterY = height - JOYSTICK_MARGIN_BOTTOM - JOYSTICK_BASE_RADIUS;

  let rawOffX = mouseX - jCenterX;
  let rawOffY = mouseY - jCenterY;

  let maxOffset = JOYSTICK_BASE_RADIUS - JOYSTICK_KNOB_RADIUS;
  let currentDist = Math.sqrt(rawOffX * rawOffX + rawOffY * rawOffY);

  if (currentDist > maxOffset) {
    let s = maxOffset / currentDist;
    joystickKnobOffsetX = rawOffX * s;
    joystickKnobOffsetY = rawOffY * s;
  } else {
    joystickKnobOffsetX = rawOffX;
    joystickKnobOffsetY = rawOffY;
  }
}

function mouseReleased() {
  isDragging = false;
  isJoystickDragging = false;
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}
