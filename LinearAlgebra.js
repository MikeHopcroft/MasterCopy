///////////////////////////////////////////////////////////////////////////////
//
// Class that represents a 2D point.
//
///////////////////////////////////////////////////////////////////////////////
function Point(x, y) {
    return {
        x: x,
        y: y,
        Magnitude: function () {
            return Math.sqrt(x * x + y * y);
        },
        toString: function () {
            return "(" + this.x.toPrecision(3) + ", " + this.y.toPrecision(3) + ")";
        }
    }
}


// Returns the product of 3x3 matrices a and b.
// Both matrices are layed out in row-major order. 
function MatrixMatrix3(a, b) {
    return [
        a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
        a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
        a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

        a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
        a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
        a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

        a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
        a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
        a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
    ];
}


// Returns the product of 3x3 matrix m and 3x1 vector v.
function MatrixVector3(m, v) {
    return [
        m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
        m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
        m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
    ];
}


// Returns the product of 4x4 matrix m and 4x1 vector v.
function MatrixVector4(m, v) {
    return [
        m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
        m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
        m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3],
        m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3]
    ];
}
