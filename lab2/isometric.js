const btnIso = document.getElementById('iso');
btnIso.addEventListener('click', isometric);

function isometric(event) {
    var SCALE = 1;
    var MIN_SCALE = 1.1;
    var MAX_SCALE = 0;
    const OBSERVER = new Vector(0, 0, 2);

    const canvas = document.getElementById("iso_canvas");
    const isoCanvasWrapper = document.getElementById('iso_canvas_wrapper');
    const ortCanvasWrapper = document.getElementById('ort_canvas_wrapper');
    const ctx = canvas.getContext("2d");
    const canvasWidth = 600;
    const canvasHeight = 600;
    // const points = [];
    let triangles = [];
    let lastTriangles = [];
    const colors = ["yellow", "red", "green", "blue", "white", "purple", "cyan", "orange"];

    ortCanvasWrapper.classList.add('hide');
    isoCanvasWrapper.classList.remove('hide');

    canvas.onmousedown = function(e) {
        const x = e.clientX,
            y = e.clientY;
        canvas.onmousemove = function(e) {
            const moveX = e.clientX,
                moveY = e.clientY;
            const thetaY = (moveX - x) / 100;
            const thetaX = (moveY - y) / 100;
            rotate(thetaX, thetaY);
        }
    };

    canvas.onmouseup = function(e) {
        canvas.onmousemove = null;
        triangles = lastTriangles;
    };

    canvas.addEventListener('wheel', function(e) {
        if(e.deltaY < 0) {
            if(SCALE > 0.4) {
                SCALE -= 0.1;
                render();
                console.log(SCALE);
            }
        }
        if(e.deltaY > 0) {
            if (SCALE < 3) {
                SCALE += 0.1;
                render();
            }
        }
    });

    function initGeom() {

        triangles = [];

        triangles.push([new Vector(0, 1, 0), new Vector(-1, 0, 0), new Vector(0, 0, 1)]);
        triangles.push([new Vector(0, 1, 0), new Vector(0, 0, 1), new Vector(1, 0, 0)]);
        triangles.push([new Vector(0, 1, 0), new Vector(1, 0, 0), new Vector(0, 0, -1)]);
        triangles.push([new Vector(0, 1, 0), new Vector(0, 0, -1), new Vector(-1, 0, 0)]);
        triangles.push([new Vector(0, -1, 0), new Vector(1, 0, 0), new Vector(0, 0, 1)]);
        triangles.push([new Vector(0, -1, 0), new Vector(0, 0, 1), new Vector(-1, 0, 0)]);
        triangles.push([new Vector(0, -1, 0), new Vector(-1, 0, 0), new Vector(0, 0, -1)]);
        triangles.push([new Vector(0, -1, 0), new Vector(0, 0, -1), new Vector(1, 0, 0)]);
    }

    function perspectiveProject(point) {
        const x = point[0],
              y = point[1],
              z = point[2];

        return new Vector(
            x / (z + 4),
            y / (z + 4),
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

    function renderTriangle(triangle, color) {
        projectedTriangle = triangle.map(project);
        const a = projectedTriangle[0],
              b = projectedTriangle[1],
              c = projectedTriangle[2];

        const v2 = a.subtract(b);
        const v1 = c.subtract(b);
        const norm = v1.cross(v2);
        const location = norm.checkLoc(OBSERVER);

        if(location > 0) {
            ctx.beginPath();
            ctx.moveTo(a[0], a[1]);
            ctx.lineTo(b[0], b[1]);
            ctx.lineTo(c[0], c[1]);
            ctx.lineTo(a[0], a[1]);
            ctx.strokeStyle = 'white';
            ctx.fillStyle = color;
            ctx.stroke();
            ctx.fill();
            ctx.stroke();
        }
    }

    function render() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        triangles.forEach((triangle, idx) => {
            const color = colors[idx];
            renderTriangle(triangle, color);
        });
    }

    function rotate(thetaX, thetaY) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        lastTriangles = [];
        triangles.forEach((triangle, idx) => {
            const rotatedTriangle = triangle.map((point) => {
                point = point.rotateX(thetaX);
                point = point.rotateY(thetaY);
                return point;
            });
            const color = colors[idx];
            renderTriangle(rotatedTriangle, color);
            lastTriangles.push(rotatedTriangle);
        });
    }

    initGeom();
    render();
}
