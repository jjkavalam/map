import React from 'react';

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

export default class HexagonalMesh extends React.Component {

    get sideLen() {
        return this.props.sideLen;
    }

    get center() {
        return this.props.center;
    }

    get g() {
        return this.props.g;
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
    bfs(g, start, fn) {
        const q = [start];
        const visited = new Set();
        const results = [];

        while (q.length > 0) {
            const c = q.shift();
            const r = fn(c, g, visited);
            results.push(r);
            visited.add(c);
            Object.values(g[c])
                .filter(neigh => !visited.has(neigh))
                .forEach(neigh => q.push(neigh));
        }

        return results;
    }

    /**
     * Draws one cell in the mesh. This function is called by the bfs routine when visiting each
     * node.
     * Sides shared with already visited cells are not rendered (as they have already been rendered)
     * @returns array of svg elements to be rendered
     */
    getSvgOfCell(cellId, g, visited) {
        const neighs = g[cellId];
        const isNotANeigh = (sideIdx) => !neighs.hasOwnProperty(sideIdx);
        const isNotVisitedNeigh = (sideIdx) => !visited.has(neighs[sideIdx]);

        return [0, 1, 2, 3, 4, 5]
        .filter(sideIdx => isNotANeigh(sideIdx) || isNotVisitedNeigh(sideIdx))
        .map(sideIdx => {
            return this.getSvgOfSide(sideIdx, this.center, this.sideLen)
        });
    }

    /**
     * Rendering involves a BFS of the graph starting at a given cell. The sides shared with already
     * drawn cells are omitted.
     */
    render() {
        if (Object.keys(this.g).length > 0) {
            const startCellId = Object.keys(this.g)[0];
            const renderResult = this.bfs(this.g, startCellId, this.getSvgOfCell.bind(this));
            console.log(renderResult);
            return (<svg className="svgbox" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {[].concat(...renderResult)}</svg>);
        }
        else {
            return <div>Empty Hexagon</div>;
        }

    }
}