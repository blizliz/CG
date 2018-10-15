const btnOrth = document.getElementById('ort');
btnOrth.addEventListener('click', orthographic);

function orthographic(event) {
    const canvas = document.getElementById("ort_canvas");
    const ctx = canvas.getContext("2d");
    const isoCanvasWrapper = document.getElementById('iso_canvas_wrapper');
    const ortCanvasWrapper = document.getElementById('ort_canvas_wrapper');

    isoCanvasWrapper.classList.add('hide');
    ortCanvasWrapper.classList.remove('hide');

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);    // фон(белый прямоугольник)

    ctx.font = '17px serif';
    ctx.fillStyle = '#000';

    // ctx.strokeStyle = '#a6a6a6';
    ctx.beginPath();

    ///////////////////////////////////////////
    //плоскость Оху
    ctx.moveTo(40, 40);

    //стрелка y
    ctx.lineTo(40 - 3, 40 + 15);
    ctx.moveTo(40, 40);
    ctx.lineTo(40 + 3, 40 + 15);
    ctx.fillText('y', 40 + 6, 40 + 15);

    //ось y
    ctx.moveTo(40, 40);
    ctx.lineTo(40, 260);

    //ось x
    ctx.lineTo(260, 260);

    //стрелка x
    ctx.lineTo(260 - 15, 260 - 3);
    ctx.moveTo(260, 260);
    ctx.lineTo(260 - 15, 260 + 3);
    ctx.fillText('x', 260 - 15, 260 + 15);

    //проекция фигуры
    ctx.moveTo(40, 150);
    ctx.lineTo(150, 40);
    ctx.lineTo(260, 150);
    ctx.lineTo(150, 260);
    ctx.lineTo(40,150);
    ctx.lineTo(260,150);
    ctx.moveTo(150, 40);
    ctx.lineTo(150, 260);

    ///////////////////////////////////////////
    //плоскость Oyz

    ctx.moveTo(340, 40);

    //стрелка y
    ctx.lineTo(340 - 3, 40 + 15);
    ctx.moveTo(340, 40);
    ctx.lineTo(340 + 3, 40 + 15);
    ctx.fillText('y', 340 + 6, 40 + 15);

    //ось y
    ctx.moveTo(340, 40);
    ctx.lineTo(340, 260);

    //ось z
    ctx.lineTo(560, 260);

    //стрелка z
    ctx.lineTo(560 - 15, 260 -3);
    ctx.moveTo(560, 260);
    ctx.lineTo(560 - 15, 260 + 3);
    ctx.fillText('z', 560 - 15, 260 + 15);

    //проекция фигуры
    ctx.moveTo(340, 150);
    ctx.lineTo(450, 40);
    ctx.lineTo(560, 150);
    ctx.lineTo(450, 260);
    ctx.lineTo(340, 150);
    ctx.lineTo(560,150);
    ctx.moveTo(450, 40);
    ctx.lineTo(450, 260);

    ///////////////////////////////////////////

    //плоскость Oxz
    ctx.moveTo(40, 340);

    //стрелка x
    ctx.lineTo(40 - 3, 340 + 15);
    ctx.moveTo(40, 340);
    ctx.lineTo(40 + 3, 340 + 15);
    ctx.fillText('x', 40 + 6, 340 + 15);

    //ось x
    ctx.moveTo(40, 340);
    ctx.lineTo(40, 560);

    //ось z
    ctx.lineTo(260, 560);

    //стрелка z
    ctx.lineTo(260 - 15, 560 -3);
    ctx.moveTo(260, 560);
    ctx.lineTo(260 - 15, 560 + 3);
    ctx.fillText('z', 260 - 15, 560 + 15);

    //проекция фигуры
    ctx.moveTo(40, 450);
    ctx.lineTo(150, 340);
    ctx.lineTo(260, 450);
    ctx.lineTo(150, 560);
    ctx.lineTo(40, 450);
    ctx.lineTo(260, 450);
    ctx.moveTo(150, 340);
    ctx.lineTo(150, 560);

    ctx.stroke();
}