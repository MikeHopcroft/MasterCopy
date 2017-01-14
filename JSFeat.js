// The MIT License
// 
// Copyright (c) 2012 Eugene Zatepyakin
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Code adapted from https://github.com/inspirit/jsfeat.

function perspective_4point_transform(src_x0, src_y0, dst_x0, dst_y0,
                                      src_x1, src_y1, dst_x1, dst_y1,
                                      src_x2, src_y2, dst_x2, dst_y2,
                                      src_x3, src_y3, dst_x3, dst_y3) {
    var t1 = src_x0;
    var t2 = src_x2;
    var t4 = src_y1;
    var t5 = t1 * t2 * t4;
    var t6 = src_y3;
    var t7 = t1 * t6;
    var t8 = t2 * t7;
    var t9 = src_y2;
    var t10 = t1 * t9;
    var t11 = src_x1;
    var t14 = src_y0;
    var t15 = src_x3;
    var t16 = t14 * t15;
    var t18 = t16 * t11;
    var t20 = t15 * t11 * t9;
    var t21 = t15 * t4;
    var t24 = t15 * t9;
    var t25 = t2 * t4;
    var t26 = t6 * t2;
    var t27 = t6 * t11;
    var t28 = t9 * t11;
    var t30 = 1.0 / (t21 - t24 - t25 + t26 - t27 + t28);
    var t32 = t1 * t15;
    var t35 = t14 * t11;
    var t41 = t4 * t1;
    var t42 = t6 * t41;
    var t43 = t14 * t2;
    var t46 = t16 * t9;
    var t48 = t14 * t9 * t11;
    var t51 = t4 * t6 * t2;
    var t55 = t6 * t14;
    var Hr0 = -(t8 - t5 + t10 * t11 - t11 * t7 - t16 * t2 + t18 - t20 + t21 * t2) * t30;
    var Hr1 = (t5 - t8 - t32 * t4 + t32 * t9 + t18 - t2 * t35 + t27 * t2 - t20) * t30;
    var Hr2 = t1;
    var Hr3 = (-t9 * t7 + t42 + t43 * t4 - t16 * t4 + t46 - t48 + t27 * t9 - t51) * t30;
    var Hr4 = (-t42 + t41 * t9 - t55 * t2 + t46 - t48 + t55 * t11 + t51 - t21 * t9) * t30;
    var Hr5 = t14;
    var Hr6 = (-t10 + t41 + t43 - t35 + t24 - t21 - t26 + t27) * t30;
    var Hr7 = (-t7 + t10 + t16 - t43 + t27 - t28 - t21 + t25) * t30;

    t1 = dst_x0;
    t2 = dst_x2;
    t4 = dst_y1;
    t5 = t1 * t2 * t4;
    t6 = dst_y3;
    t7 = t1 * t6;
    t8 = t2 * t7;
    t9 = dst_y2;
    t10 = t1 * t9;
    t11 = dst_x1;
    t14 = dst_y0;
    t15 = dst_x3;
    t16 = t14 * t15;
    t18 = t16 * t11;
    t20 = t15 * t11 * t9;
    t21 = t15 * t4;
    t24 = t15 * t9;
    t25 = t2 * t4;
    t26 = t6 * t2;
    t27 = t6 * t11;
    t28 = t9 * t11;
    t30 = 1.0 / (t21 - t24 - t25 + t26 - t27 + t28);
    t32 = t1 * t15;
    t35 = t14 * t11;
    t41 = t4 * t1;
    t42 = t6 * t41;
    t43 = t14 * t2;
    t46 = t16 * t9;
    t48 = t14 * t9 * t11;
    t51 = t4 * t6 * t2;
    t55 = t6 * t14;
    var Hl0 = -(t8 - t5 + t10 * t11 - t11 * t7 - t16 * t2 + t18 - t20 + t21 * t2) * t30;
    var Hl1 = (t5 - t8 - t32 * t4 + t32 * t9 + t18 - t2 * t35 + t27 * t2 - t20) * t30;
    var Hl2 = t1;
    var Hl3 = (-t9 * t7 + t42 + t43 * t4 - t16 * t4 + t46 - t48 + t27 * t9 - t51) * t30;
    var Hl4 = (-t42 + t41 * t9 - t55 * t2 + t46 - t48 + t55 * t11 + t51 - t21 * t9) * t30;
    var Hl5 = t14;
    var Hl6 = (-t10 + t41 + t43 - t35 + t24 - t21 - t26 + t27) * t30;
    var Hl7 = (-t7 + t10 + t16 - t43 + t27 - t28 - t21 + t25) * t30;

    // the following code computes R = Hl * inverse Hr
    t2 = Hr4 - Hr7 * Hr5;
    t4 = Hr0 * Hr4;
    t5 = Hr0 * Hr5;
    t7 = Hr3 * Hr1;
    t8 = Hr2 * Hr3;
    t10 = Hr1 * Hr6;
    var t12 = Hr2 * Hr6;
    t15 = 1.0 / (t4 - t5 * Hr7 - t7 + t8 * Hr7 + t10 * Hr5 - t12 * Hr4);
    t18 = -Hr3 + Hr5 * Hr6;
    var t23 = -Hr3 * Hr7 + Hr4 * Hr6;
    t28 = -Hr1 + Hr2 * Hr7;
    var t31 = Hr0 - t12;
    t35 = Hr0 * Hr7 - t10;
    t41 = -Hr1 * Hr5 + Hr2 * Hr4;
    var t44 = t5 - t8;
    var t47 = t4 - t7;
    t48 = t2 * t15;
    var t49 = t28 * t15;
    var t50 = t41 * t15;
    var M = [
        Hl0 * t48 + Hl1 * (t18 * t15) - Hl2 * (t23 * t15),
        Hl0 * t49 + Hl1 * (t31 * t15) - Hl2 * (t35 * t15),
        -Hl0 * t50 - Hl1 * (t44 * t15) + Hl2 * (t47 * t15),
        Hl3 * t48 + Hl4 * (t18 * t15) - Hl5 * (t23 * t15),
        Hl3 * t49 + Hl4 * (t31 * t15) - Hl5 * (t35 * t15),
        -Hl3 * t50 - Hl4 * (t44 * t15) + Hl5 * (t47 * t15),
        Hl6 * t48 + Hl7 * (t18 * t15) - t23 * t15,
        Hl6 * t49 + Hl7 * (t31 * t15) - t35 * t15,
        -Hl6 * t50 - Hl7 * (t44 * t15) + t47 * t15
    ];

    var T =
    [
        [M[0], M[1], 0, M[2]],
        [M[3], M[4], 0, M[5]],
        [0, 0, 1, 0],
        [M[6], M[7], 0, M[8]]
    ];

    return T;
}
