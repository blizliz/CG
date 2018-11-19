var SCALE = 2;                          //коэффициент масштаба
var MIN_SCALE = 0.89;                   //минимальный коэффициент масштаба
var MAX_SCALE = 3;                      //максимальный коэффициент масштаба
const OBSERVER = new Vector(0, 0, 4);   //вектор наблюдателя для удаления невидимых линий
const OBS = new Vector(0, 0, 1);        //единичный вектор наблюдателя для света
const LIGHT = new Vector(1, 1, 1);      //вектор источника света
const A = 2, B = 1, H = 6;              //параметры эллипса

const canvas = document.getElementById("iso_canvas");
const approx = document.getElementById("approx");
const KSLI = document.getElementById("KSLI");
const KSFI = document.getElementById("KSFI");
const ctx = canvas.getContext("2d");
const canvasWidth = 600;
const canvasHeight = 600;

let NUM = approx.value;     //коэффициент аппроксимации
let Ka = KSLI.value;        //коэффициент диффузного отражения рассеянного света
let Kd = KSFI.value;        //коэффициент диффузного отражения падающего света

let bases = [];             //массив треугольников основания эллипт.цилиндра
let sideFaces = [];         //массив треугольников боковых сторон эллипт.цилиндра

let lastTriangles = [];     //массив для сохранения положения фигур при вращении

//считываение изменения координат экрана при вращении
canvas.onmousedown = function (e) {
    const x = e.clientX,
        y = e.clientY;
    canvas.onmousemove = function (e) {
        const moveX = e.clientX,
            moveY = e.clientY;
        const thetaY = (moveX - x) / 100;
        const thetaX = (moveY - y) / 100;
        rotate(thetaX, thetaY);
    }
};
canvas.onmouseup = function (e) {
    canvas.onmousemove = null;
    bases = lastTriangles;
};

//реакция на изменение коэффициента аппроксимации
approx.onchange = function (e) {
    NUM = approx.value;
    initGeom();
    render();
}

//реакция на изменение
//коэффициента диффузного отражения рассеянного света
KSLI.onchange = function (e) {
    Ka = KSLI.value;
    render();
}
//реакция на изменение
//коэффициента диффузного отражения падающего света
KSFI.onchange = function (e) {
    Kd = KSFI.value;
    render();
}

//изменение  масштаба с помощью колесика мыши
canvas.addEventListener('wheel', function (e) {
    if (e.deltaY < 0) {
        if (SCALE > MIN_SCALE) {
            SCALE -= 0.1;
            console.log(SCALE)
            render();
        }
    }
    if (e.deltaY > 0) {
        if (SCALE < MAX_SCALE) {
            SCALE += 0.1;
            console.log(SCALE)
            render();
        }
    }
});

//корни через уравнение элиипса для разделения его на равные части
function fplus(x) {
    return Math.sqrt((1 - (x * x) / (A * A)) * B * B);
}

function fminus(x) {
    return -Math.sqrt((1 - (x * x) / (A * A)) * B * B);
}

function initGeom() {
    bases = [];
    //аппроксимируем выпуклое тело треугольниками

    var step = 2 * A / NUM;
    //лицевые треугольники
    var z = H / 2;
    var prevX = -A, prevY = fplus(prevX);
    for (var x = -A + step; Math.floor(x) < A; x += step) {
        var y = fminus(x);
        bases.push([new Vector(0, 0, z), new Vector(prevX, prevY, z), new Vector(x, y, z)]); //++++
        bases.push([new Vector(x, y, -z), new Vector(x, y, z), new Vector(prevX, prevY, z)]);
        prevX = x;
        prevY = y;
        console.log('done')
    }
    var x = A, y = fminus(x);
    bases.push([new Vector(0, 0, z), new Vector(prevX, prevY, z), new Vector(x, y, z)]);
    bases.push([new Vector(x, y, -z), new Vector(x, y, z), new Vector(prevX, prevY, z)]);

    prevX = -A, prevY = fminus(prevX);
    for (var x = -A + step; x < A; x += step) {
        var y = fplus(x);
        bases.push([new Vector(x, y, z), new Vector(prevX, prevY, z), new Vector(0, 0, z)]); //++++
        bases.push([new Vector(prevX, prevY, -z), new Vector(prevX, prevY, z), new Vector(x, y, z)]);
        prevX = x;
        prevY = y;
    }
    var x = A, y = fplus(x);
    bases.push([new Vector(x, y, z), new Vector(prevX, prevY, z), new Vector(0, 0, z)]); //++++
    bases.push([new Vector(prevX, prevY, -z), new Vector(prevX, prevY, z), new Vector(x, y, z)]);


    // задние треугольники
    z = -H / 2;
    var prevX = -A, prevY = fplus(prevX);
    for (var x = -A + step; x < A; x += step) {
        var y = fplus(x);
        bases.push([new Vector(x, y, z), new Vector(0, 0, z), new Vector(prevX, prevY, z)]); //++++
        bases.push([new Vector(x, y, z), new Vector(prevX, prevY, z), new Vector(x, y, -z)]);
        prevX = x;
        prevY = y;
    }
    var x = A, y = fplus(x);
    bases.push([new Vector(x, y, z), new Vector(0, 0, z), new Vector(prevX, prevY, z)]); //++++
    bases.push([new Vector(x, y, z), new Vector(prevX, prevY, z), new Vector(x, y, -z)]);

    prevX = -A, prevY = fminus(prevX);
    for (var x = -A + step; x < A; x += step) {
        var y = fminus(x);
        bases.push([new Vector(prevX, prevY, z), new Vector(0, 0, z), new Vector(x, y, z)]); //++++
        bases.push([new Vector(prevX, prevY, -z), new Vector(prevX, prevY, z), new Vector(x, y, z)]);
        prevX = x;
        prevY = y;
    }
    var x = A, y = fminus(x);
    bases.push([new Vector(prevX, prevY, z), new Vector(0, 0, z), new Vector(x, y, z)]); //++++
    bases.push([new Vector(prevX, prevY, -z), new Vector(prevX, prevY, z), new Vector(x, y, z)]);
}

function perspectiveProject(point) {
    const x = point[0],
        y = point[1],
        z = point[2];

    return new Vector(
        x / (z + 6),
        y / (z + 6),
        z
    );
}

function project(point) {
    const perspectivePoint = perspectiveProject(point);
    const x = perspectivePoint[0],
        y = perspectivePoint[1],
        z = perspectivePoint[2];

    return new Vector(
        canvasWidth * (x + SCALE) / (SCALE + SCALE),
        canvasHeight * (1 - (y + SCALE) / (SCALE + SCALE)),
        z
    );
}

function renderPoint(point) {
    const projectedPoint = project(point);
    const x = projectedPoint[0],
        y = projectedPoint[1];

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 1, y + 1);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function renderTriangle(triangle) {
    projectedTriangle = triangle.map(project);
    const a = projectedTriangle[0],
        b = projectedTriangle[1],
        c = projectedTriangle[2];

    const v2 = a.subtract(b);
    const v1 = c.subtract(b);
    const norm = v1.cross(v2);
    const location = norm.scalar(OBSERVER);

    if (location > 0) {
        const normMod = Math.sqrt(norm[0] * norm[0] + norm[1] * norm[1] + norm[2] * norm[2]);
        const normE = norm.scale(1 / normMod);      // единичный вектор нормали

        const LightMod = Math.sqrt(LIGHT[0] * LIGHT[0] + LIGHT[1] * LIGHT[1] + LIGHT[2] * LIGHT[2]);
        const LightE = LIGHT.scale(1 / LightMod);   //единичный вектор источника света

        const LxN = LightE.scalar(normE);           //скалярное произведение вектора света на нормаль
        const tmpV = normE.scale(2 * LxN);

        const refl = LIGHT.subtract(tmpV);          //получение отражающего вектора

        const cos = refl.scalar(OBS);               //косинус угла

        //уравнение модели освещения
        const d = 0, K = 1, Ia = 1, Ii = 10, Ks = 0.8;
        Ip = Ia * Ka + Ii * (Kd * LxN + Ks * cos * cos) / (d + K);

        color = 255 / Ip;       //получение нужного оттенка для закрашивания

        ctx.fillStyle = 'rgb(' + 0 + ',' + color + ',' + color + ')';
        ctx.strokeStyle = 'rgb(' + 0 + ',' + color + ',' + color + ')';
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.lineTo(a[0], a[1]);
        ctx.stroke();
        ctx.fill();
        ctx.stroke();
    }
}

function render() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    bases.forEach((triangle) => {
        const color = 'cyan';
        renderTriangle(triangle);
    });
}

function rotate(thetaX, thetaY) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    lastTriangles = [];
    bases.forEach((triangle, idx) => {
        const rotatedTriangle = triangle.map((point) => {
            point = point.rotateX(thetaX);
            point = point.rotateY(thetaY);
            return point;
        });
        const color = 'black';
        renderTriangle(rotatedTriangle, color);
        lastTriangles.push(rotatedTriangle);
    });
}

initGeom();
render();