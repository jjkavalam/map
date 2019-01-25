export type CellId = string;
export type Neighbours = {0?: CellId, 1?: CellId, 2?: CellId, 3?: CellId, 4?: CellId, 5?: CellId};

export class Cell {
    id: CellId;
    neighbours: Neighbours;
    text;

    constructor(id: CellId, neighbours: Neighbours, text?) {
        this.id = id;
        this.neighbours = neighbours;
        this.text = text;
    }

}