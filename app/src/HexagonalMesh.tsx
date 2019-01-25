import React from 'react';
import {CellId, Neighbours, Cell, Point, SideIdx} from "./Model";
import cellRenderer from './CellRenderer';

export interface CellRenderer {
    (cell: Cell, renderInfo: CellRenderInfo, sideLen: number) : React.ReactNode;
}

export interface CellRenderInfo {
    center: Point;
    sidesToDraw: Array<SideIdx>;
}

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
     * Traverses the given graph using BFS from the given start node and builds the render info
     */
    computeRenderInfo(cells: Array<Cell>, start: CellId, sideLen: number): Map<CellId, CellRenderInfo> {

        // build adjacency map
        const g: Map<CellId, Neighbours> = new Map();
        cells.forEach(cell => g.set(cell.id, cell.neighbours));

        const q = [{
            id: start,
            center: this.center
        }];
        const visited: Set<CellId> = new Set();
        const results = new Map<CellId, CellRenderInfo>();

        while (q.length > 0) {
            const { id, center } = q.shift();

            const neighs = g.get(id);
            const hasNoNeigh = (sideIdx) => !neighs[sideIdx];
            const isNotVisitedNeigh = (sideIdx) => !visited.has(neighs[sideIdx]);

            // Sides shared with already visited cells are not rendered 
            const sidesToDraw = ([0, 1, 2, 3, 4, 5] as Array<SideIdx>)
            .filter(sideIdx => hasNoNeigh(sideIdx) || isNotVisitedNeigh(sideIdx));
            
            results.set(id, {
                center,
                sidesToDraw,
            });

            visited.add(id);

            // add not visited neighbours to the queue
            // calculate center of the neighbour relative to current cell's center
            Object.entries(neighs)
                .filter(([_, neigh]) => !visited.has(neigh))
                .forEach(([sideIdx, neigh]) => {
                    q.push({
                        id: neigh,
                        // center of neighbour is sqrt(3)*A length away at the given angle
                        center: polarToCartesian(
                            center, sideLen * Math.sqrt(3), parseInt(sideIdx) * Math.PI / 3)
                    });
                });
        }

        return results;
    }

    /**
     * Rendering involves a BFS of the graph starting at a given cell. The sides shared with already
     * drawn cells are omitted.
     */
    render() {
        if (this.cells.length > 0) {
            const startCellId = this.cells[0].id;
            
            const renderInfoMap = this.computeRenderInfo(this.cells, startCellId, this.sideLen);
            const renderResult = this.cells.map(
                cell => cellRenderer(cell, renderInfoMap.get(cell.id), this.sideLen));


            return (<svg className="svgbox" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {renderResult}</svg>);
        }
        else {
            return <div>Empty Hexagon</div>;
        }

    }
}