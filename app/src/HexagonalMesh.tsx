import React from 'react';
import {CellId, Neighbours, Cell} from "./Model";

/**
 * Renders a mesh of hexagons using SVG
 * Expects an object describing the spatial ordering of the cells in the `cells` prop
 * {
 *  <cellid>: { 0: <cellid>, 1: <cellid>, ..., 5: <cellid> }
 * 
 * }
 * 
 * Neighbouring cells on each of the six sides of each hexagon are specified.
 * If any side doesn't have a cell, that entry may be omitted.
 * 
 */

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
 * Gives the cartesian coordinates centered around `center` of (r, theta)
 * `theta` should be in radians
 */
function polarToCartesian(center, r, theta) {
    return {
        x: center.x + r * Math.cos(theta),
        y: center.y + r * Math.sin(theta)
    }
}

type Props = {
    sideLen: number,
    center: {x: number, y: number},
    cells: Array<Cell>
};

export default class HexagonalMesh extends React.Component<Props> {

    get sideLen() {
        return this.props.sideLen;
    }

    get center() {
        return this.props.center;
    }

    get cells() {
        return this.props.cells;
    }

    /**
     * Returns an svg representation of one side of a hexagonal cell
     * @param {number} sideIdx An integer in the range [0 ... 5] that identifies the side
     * @param {{x: number, y: number}} center 
     * @param {number} a Length of side
     * 
     * Note: sideIdx 0 corresponds to the side at 0 degree. Subsequent sides are found by moving
     * counterclockwise
     */
    getSvgOfSide(sideIdx, center, a) {
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
     * Traverses the given graph using BFS from the given start node and calls `fn` on each visit
     * @param {*} g A graph representation as explained on top of this file
     * @param {*} start Identifies the start node
     * @param {*} fn This function will be invoked when visiting a node and will be passed 
     *  `vertex, graph, visited-set` as arguments
     * @returns aggregated list of values returned by each `fn` invocation
     */
    renderMesh(g: Map<CellId, Neighbours>, start: CellId) {
        const q = [{
            id: start,
            center: this.center
        }];
        const visited: Set<CellId> = new Set();
        const results = [];

        while (q.length > 0) {
            const { id, center } = q.shift();

            const neighs = g.get(id);
            const hasNoNeigh = (sideIdx) => !neighs[sideIdx];
            const isNotVisitedNeigh = (sideIdx) => !visited.has(neighs[sideIdx]);

            // Sides shared with already visited cells are not rendered 
            const sidesToDraw = [0, 1, 2, 3, 4, 5]
            .filter(sideIdx => hasNoNeigh(sideIdx) || isNotVisitedNeigh(sideIdx));
            
            const r = this.getSvgOfCell(id, center, sidesToDraw);
    
            results.push(r);
            visited.add(id);

            // add not visited neighbours to the queue
            // calculate center of the neighbour relative to current cell's center
            Object.entries(neighs)
                .filter(([_, neigh]) => !visited.has(neigh))
                .forEach(([sideIdx, neigh]) => {
                    q.push({
                        id: neigh,
                        // center of neighbour is sqrt(3)*A length away at the given angle
                        center: polarToCartesian(center, this.sideLen * Math.sqrt(3), parseInt(sideIdx) * Math.PI / 3)
                    });
                });
        }

        return results;
    }

    /**
     * Draws the specified sides of a hexagonal cell.
     * @returns array of svg elements to be rendered
     */
    getSvgOfCell(cellId, center, sidesToDraw) {
        console.log("center", center);
        return [ ...sidesToDraw
        .map(sideIdx => {
            return this.getSvgOfSide(sideIdx, center, this.sideLen)
        }),
            <circle cx={center.x} cy={center.y} r="1" />
        ];
    }

    /**
     * Rendering involves a BFS of the graph starting at a given cell. The sides shared with already
     * drawn cells are omitted.
     */
    render() {
        if (this.cells.length > 0) {
            const startCellId = this.cells[0].id;
            
            // build adjacency map
            const g: Map<CellId, Neighbours> = new Map();
            this.cells.forEach(cell => g.set(cell.id, cell.neighbours));

            const renderResult = this.renderMesh(g, startCellId);
            console.log(renderResult);
            return (<svg className="svgbox" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {[].concat(...renderResult)}</svg>);
        }
        else {
            return <div>Empty Hexagon</div>;
        }

    }
}