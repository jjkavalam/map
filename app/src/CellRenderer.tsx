import React from 'react';

import { CellRenderer } from "./HexagonalMesh";

const Root3By2 = Math.sqrt(3) / 2;

// [[x1, y1], [x2, y2], ... [x6, y6]]
const vertices = [
    [Root3By2, -0.5],
    [Root3By2, 0.5],
    [0, 1.0],
    [-Root3By2, 0.5],
    [-Root3By2, -0.5],
    [0, -1.0]
];

/**
 * Returns an svg representation of one side of a hexagonal cell
 * @param {number} sideIdx An integer in the range [0 ... 5] that identifies the side
 * @param {{x: number, y: number}} center 
 * @param {number} a Length of side
 * 
 * Note: sideIdx 0 corresponds to the side at 0 degree. Subsequent sides are found by moving
 * counterclockwise
 */
function getSvgOfSide(sideIdx, center, a) {
    const p0 = vertices[sideIdx];
    const p1 = vertices[(sideIdx + 1) % 6];

    return <line 
        x1={center.x + a * p0[0]} 
        y1={center.y + a * p0[1]} 
        x2={center.x + a * p1[0]} 
        y2={center.y + a * p1[1]} 
        stroke="black" />;
}

/**
 * Draws the specified sides of a hexagonal cell.
 * @returns array of svg elements to be rendered
 */
const cellRenderer: CellRenderer = function(cell, renderInfo, sideLen) {
    const {center, sidesToDraw} = renderInfo;
    console.log("center", center);
    return [ ...sidesToDraw
    .map(sideIdx => {
        return getSvgOfSide(sideIdx, center, sideLen)
    }),
        <circle cx={center.x} cy={center.y} r="1" />
    ];
};

export default cellRenderer;