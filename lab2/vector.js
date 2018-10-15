'use strict';

class Vector {
    constructor(x, y, z) {
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    cross(other) {
        return new Vector(
            this[1] * other[2] - this[2] * other[1],
            this[0] * other[2] - this[2] * other[0],
            this[0] * other [1] - this[1] * other[0],
        );
    }

    add(other) {
        return new Vector(
            this[0] + other[0],
            this[1] + other[1],
            this[2] + other[2]
        );
    }

    scale(par) {
        return new Vector(
            par * this[0],
            par * this[1],
            par * this[2]
        );
    }

    subtract(other) {
        return this.add(other.scale(-1));
    }

    rotateY(THETA) {
        var x = this[0],
            y = this[1],
            z = this[2];
        return new Vector(
            Math.cos(THETA) * x - Math.sin(THETA) * z,
            y,
            Math.sin(THETA) * x + Math.cos(THETA) * z
        );
    }

    rotateX(THETA) {
        var x = this[0],
            y = this[1],
            z = this[2];
        return new Vector(
            x,
            Math.cos(THETA) * y + Math.sin(THETA) * z,
            Math.cos(THETA) * z - Math.sin(THETA) * y
        );
    }

    checkLoc(obser) {
        return (obser[0] * this[0]
              + obser[1] * this[1]
              + obser[2] * this[2]);
    }
}