import { makeAutoObservable } from "mobx";
import {
  genRandEvenNumber,
  genRandNumber,
  genRandOddNumber,
} from "@/libs/rand";
import { delayFactory } from "@/libs/delay";
import { setAnimationOff, setAnimationOn } from "./localstorage";
import { shuffleArray } from "@/libs/helper";
import { Tree } from "@/libs/tree";
import { dir } from "console";

enum Entity {
  Empty = "Empty",
  Wall = "Wall",
}

enum Orientation {
  Horizontal,
  Vertical,
}

var delayFn = delayFactory();

class Grid {
  rows: number;
  cols: number;
  cells: Array<Array<Cell>> = [];
  start: Cell;
  finish: Cell;
  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    let middleRow = Math.ceil(rows / 2);
    let sideIndent = Math.ceil(cols / 10);

    for (let row = 0; row < rows; row++) {
      this.cells[row] = [];
      for (let col = 0; col < cols; col++) {
        this.cells[row][col] = new Cell(row, col);
      }
    }

    this.start = this.cells[middleRow][sideIndent];
    this.finish = this.cells[middleRow][cols - sideIndent];
  }

  checkCellIsStart(cell: Cell): boolean {
    return cell === this.start;
  }

  checkCellIsFinish(cell: Cell): boolean {
    return cell === this.finish;
  }

  setStart(cell: Cell) {
    let oldStart = this.start;
    this.start = cell;
    oldStart.updatePoke();
    this.start.updatePoke();
  }

  setFinish(cell: Cell) {
    let oldFinish = this.finish;
    this.finish = cell;
    oldFinish.updatePoke();
    this.finish.updatePoke();
  }

  async genDepthFirstSearch() {
    await this.genWalls();
    await this.depthFirstSearch();
  }

  async genBinaryTree() {
    await this.clearBoard();
    await this.binaryTree();
  }

  async genRecursiveMaze() {
    await this.clearBoard();
    this.recursiveDevision(
      0,
      0,
      this.cells[0].length,
      this.cells.length,
      this.getOrientation(this.cells[0].length, this.cells.length)
    );
  }

  async genKruskal() {
    await this.genWalls();
    await this.kruskal();
    await this.whiteningAll();
  }

  async genPrim() {
    await this.genWalls();
    await this.whiteningAll();
    await this.prim();
  }

  async prim() {
    enum Direction {
      N,
      S,
      E,
      W,
    }

    const enqueueFrontiers = (frontiers: Set<Cell>) => {
      frontiers.forEach((cell: Cell) => cell.enqueue());
    };

    const adjacentFrontiers = (cell: Cell): Set<Cell> => {
      let x = cell.col;
      let y = cell.row;
      let newFrontiers: Set<Cell> = new Set();
      this.cells[y]?.[x + 2]?.isVisited === false && // right
        newFrontiers.add(this.cells[y][x + 2]);
      this.cells[y]?.[x - 2]?.isVisited === false && // left
        newFrontiers.add(this.cells[y][x - 2]);
      this.cells[y + 2]?.[x]?.isVisited === false && // down
        newFrontiers.add(this.cells[y + 2][x]);
      this.cells[y - 2]?.[x]?.isVisited === false && // up
        newFrontiers.add(this.cells[y - 2][x]);

      return newFrontiers;
    };

    const mergeWithClosestVisited = (source: Cell) => {
      let wallCells: Map<Direction, Cell> = new Map();
      this.cells[source.row]?.[source.col + 2]?.isVisited &&
        wallCells.set(Direction.N, this.cells[source.row][source.col + 1]); // up
      this.cells[source.row]?.[source.col - 2]?.isVisited &&
        wallCells.set(Direction.S, this.cells[source.row][source.col - 1]); // down
      this.cells[source.row + 2]?.[source.col]?.isVisited &&
        wallCells.set(Direction.E, this.cells[source.row + 1][source.col]); // right
      this.cells[source.row - 2]?.[source.col]?.isVisited &&
        wallCells.set(Direction.W, this.cells[source.row - 1][source.col]); // left

      if (wallCells.size !== 0) {
        let directions = [...wallCells.keys()];
        let randIdx = genRandNumber(0, directions.length - 1);
        let direction: Direction = directions[randIdx];
        let wall = wallCells.get(direction);
        if (wall) {
          wall.visit();
          wall.setEmpty();
        }
      }
    };

    const xRand = genRandEvenNumber(0, this.cells[0].length);
    const yRand = genRandEvenNumber(0, this.cells.length);
    let frontiers: Set<Cell> = new Set([this.cells[yRand][xRand]]);
    enqueueFrontiers(frontiers);

    while (frontiers.size !== 0) {
      let randFrontierIdx = genRandNumber(0, frontiers.size - 1);
      let sourceFrontier = [...frontiers][randFrontierIdx];
      frontiers.delete(sourceFrontier);

      let foundFrontiers = adjacentFrontiers(sourceFrontier);
      foundFrontiers.forEach((frontier: Cell) => frontier.enqueue());
      frontiers = new Set([...frontiers, ...foundFrontiers]);

      mergeWithClosestVisited(sourceFrontier);

      sourceFrontier.setEmpty();
      sourceFrontier.dequeue();
      sourceFrontier.visit();
      await delayFn();
    }
  }

  async kruskal() {
    enum Direction {
      E,
      S,
    }

    interface Edge {
      cell: Cell;
      direction: Direction;
    }

    const DXW = { [Direction.E]: 1, [Direction.S]: 0 };
    const DYW = { [Direction.E]: 0, [Direction.S]: 1 };
    const DX = { [Direction.E]: 2, [Direction.S]: 0 };
    const DY = { [Direction.E]: 0, [Direction.S]: 2 };

    const getSets = () => {
      let sets: Array<Array<Tree<Cell>>> = [];
      for (let i = 0; i < this.cells.length; i++) {
        sets[i] = [];
        for (let j = 0; j < this.cells[i].length; j++) {
          sets[i][j] = new Tree(this.cells[i][j]);
        }
      }

      return sets;
    };

    const getEdges = (): Array<Edge> => {
      let edges: Array<Edge> = [];
      for (let i = 0; i < this.cells.length; i++) {
        for (let j = 0; j < this.cells[i].length; j++) {
          if (i % 2 === 0 && j % 2 === 0) {
            j < this.cells[i].length - 1 &&
              edges.push({ cell: this.cells[i][j], direction: Direction.E });
            i < this.cells.length - 1 &&
              edges.push({ cell: this.cells[i][j], direction: Direction.S });
          }
        }
      }

      return edges;
    };

    const colorizeTree = async (node: Tree<Cell>, color: string) => {
      const root = node.root;
      if (root.value.color === color) return;
      for (let currentNode of root.postOrderTraversal()) {
        currentNode.value.animate();
        currentNode.value.colorize(color);
        await delayFn();
      }
    };

    const deanimateTree = async (node: Tree<Cell>) => {
      const root = node.root;
      for (let currentNode of root.postOrderTraversal()) {
        currentNode.value.deanimate();
      }
    };

    let edges = shuffleArray(getEdges());
    let sets = getSets();

    while (edges.length !== 0) {
      const edge = edges.pop();
      if (edge === undefined) break;
      const { cell, direction } = edge;

      const wx = cell.col + DXW[direction];
      const wy = cell.row + DYW[direction];

      const nx = cell.col + DX[direction];
      const ny = cell.row + DY[direction];

      let set1 = sets[cell.row][cell.col];
      let set2 = sets[ny][nx];
      if (
        sets[cell.row][cell.col].root.totalNodes() <
        sets[ny][nx].root.totalNodes()
      ) {
        set1 = sets[ny][nx];
        set2 = sets[cell.row][cell.col];
      }

      if (!set1.connected(set2)) {
        cell.setEmpty();
        this.cells[ny][nx].setEmpty();
        this.cells[wy][wx].setEmpty();
        cell.assignColor();
        set2.connect(this.cells[wy][wx]);
        this.cells[wy][wx].color = set1.root.value.color;
        await deanimateTree(set2);
        await colorizeTree(set2, set1.root.value.color);
        set1.connect(set2);
        await delayFn();
      }
    }
  }

  async depthFirstSearch() {
    const getAvailableNodes = (yRand: number, xRand: number) => {
      let nodes = [];
      if (yRand % 2 === 0 && xRand % 2 === 0) {
        this.cells[yRand]?.[xRand + 2]?.isVisited === false && // right
          nodes.push(this.cells[yRand][xRand + 1]);
        this.cells[yRand]?.[xRand - 2]?.isVisited === false && // left
          nodes.push(this.cells[yRand][xRand - 1]);
        this.cells[yRand + 2]?.[xRand]?.isVisited === false && // down
          nodes.push(this.cells[yRand + 1][xRand]);
        this.cells[yRand - 2]?.[xRand]?.isVisited === false && // up
          nodes.push(this.cells[yRand - 1][xRand]);
      } else if (xRand % 2 !== 0) {
        // only row empty
        this.cells[yRand]?.[xRand + 1]?.isVisited === false && // right
          nodes.push(this.cells[yRand][xRand + 1]);
        this.cells[yRand]?.[xRand - 1]?.isVisited === false && // left
          nodes.push(this.cells[yRand][xRand - 1]);
      } else if (yRand % 2 !== 0) {
        // only col empty
        this.cells[yRand + 1]?.[xRand]?.isVisited === false && // down
          nodes.push(this.cells[yRand + 1][xRand]);
        this.cells[yRand - 1]?.[xRand]?.isVisited === false && // up
          nodes.push(this.cells[yRand - 1][xRand]);
      }

      return nodes;
    };

    let items: Array<Cell> = [];
    const xRand = genRandEvenNumber(0, this.cells[0].length);
    const yRand = genRandEvenNumber(0, this.cells.length);
    items.push(this.cells[yRand][xRand]);

    while (items.length !== 0) {
      let currentCell = items[items.length - 1];
      currentCell.setEmpty();
      currentCell.enqueue();
      currentCell.visit();
      let availableNodes = getAvailableNodes(currentCell.row, currentCell.col);
      if (availableNodes.length === 0) {
        items[items.length - 1].dequeue();
        items.pop();
        await delayFn();
        continue;
      }

      let shuffledNodes = shuffleArray(availableNodes) as Array<Cell>;
      items.push(shuffledNodes[0]);
      await delayFn();
    }
  }

  async binaryTree() {
    for (let i = 0; i < this.cells.length - 1; i++) {
      for (let j = 0; j < this.cells[i].length - 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          if (this.cells?.[i]?.[j + 1] && this.cells?.[i + 1]?.[j]) {
            let rand = genRandNumber(0, 1);
            rand && this.cells[i][j + 1].setWall();
            !rand && this.cells[i + 1]?.[j].setWall();
          } else if (this.cells?.[i]?.[j + 1]) {
            this.cells[i][j + 1].setWall();
          } else if (this.cells?.[i + 1]?.[j]) {
            this.cells?.[i + 1][j].setWall();
          }
          this.cells[i + 1]?.[j + 1]?.setWall();
          await delayFn();
        }
      }
    }
  }

  async recursiveDevision(
    x: number,
    y: number,
    width: number,
    height: number,
    orientation: Orientation
  ) {
    if (width < 2 || height < 2) {
      return;
    }

    if (orientation == Orientation.Horizontal) {
      let evenCol = genRandEvenNumber(x, x + width - 1);
      let oddGap = genRandOddNumber(y, y + height - 1);
      if (height === 2 && (y === 0 || y + height === this.cells.length)) {
        oddGap = genRandNumber(y, y + height - 1);
      }
      for (let i = 0; i < height; i++) {
        if (y + i != oddGap) {
          this.cells[y + i][evenCol].setWall();
          await delayFn();
        }
      }
      await this.recursiveDevision(
        x,
        y,
        evenCol - x,
        height,
        this.getOrientation(evenCol - x, height)
      );
      await this.recursiveDevision(
        evenCol + 1,
        y,
        width - (evenCol - x + 1),
        height,
        this.getOrientation(width - (evenCol - x + 1), height)
      );
    } else {
      let evenRow = genRandEvenNumber(y, y + height - 1);
      let oddGap = genRandOddNumber(x, x + width - 1);
      if (width === 2 && (x === 0 || x + width === this.cells[0].length)) {
        oddGap = genRandNumber(x, x + width - 1);
      }
      for (let i = 0; i < width; i++) {
        if (x + i != oddGap) {
          this.cells[evenRow][x + i].setWall();
          await delayFn();
        }
      }
      await this.recursiveDevision(
        x,
        y,
        width,
        evenRow - y,
        this.getOrientation(width, evenRow - y)
      );
      await this.recursiveDevision(
        x,
        evenRow + 1,
        width,
        height - (evenRow - y + 1),
        this.getOrientation(width, height - (evenRow - y + 1))
      );
    }
  }

  getOrientation(width: number, height: number) {
    if (width > height) {
      return Orientation.Horizontal;
    } else if (height > width) {
      return Orientation.Vertical;
    } else {
      return Math.round(Math.random()) == 0
        ? Orientation.Horizontal
        : Orientation.Vertical;
    }
  }

  async clearBoard() {
    setAnimationOff();
    await this.clear();
    setAnimationOn();
  }

  async clear() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].setEmpty();
      }
      await delayFn({ skip: 1, delay: 1 });
    }
  }

  async genWalls() {
    setAnimationOff();
    await this.walls();
    setAnimationOn();
  }

  async whiteningAll() {
    setAnimationOff();
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].whitening();
      }
      await delayFn({ skip: 1, delay: 1 });
    }
    setAnimationOn();
  }

  async walls() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].setWall();
      }
      await delayFn({ skip: 1, delay: 1 });
    }
  }
}

class Cell {
  isVisited: boolean;
  isAnimated: boolean;
  entity: Entity;
  row: number;
  col: number;
  poke: Date;
  color: string;
  properties: Array<string>;
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.isVisited = false;
    this.isAnimated = true;
    this.entity = Entity.Empty;
    this.poke = new Date();
    this.color = "";
    this.properties = [];

    makeAutoObservable(this);
  }

  setWall() {
    this.entity = Entity.Wall;
    this.isVisited = false;
  }

  setEmpty() {
    this.entity = Entity.Empty;
  }

  visit() {
    this.isVisited = true;
    this.updatePoke();
  }

  unvisit() {
    this.isVisited = false;
    this.updatePoke();
  }

  assignColor() {
    if (this.color !== "") return;
    let randNumber = Math.floor(Math.random() * 10);
    this.color = `random-color${randNumber}`;
    this.updatePoke();
  }

  colorize(color: string) {
    this.color = color;
    this.updatePoke();
  }

  deanimate() {
    this.isAnimated = false;
    this.updatePoke();
  }

  animate() {
    this.isAnimated = true;
    this.updatePoke();
  }

  whitening() {
    this.color = "";
    this.updatePoke();
  }

  updatePoke() {
    this.poke = new Date();
  }

  enqueue() {
    this.properties.push("queued");
    this.updatePoke();
  }

  dequeue() {
    this.properties = this.properties.filter((item) => item !== "queued");
    this.updatePoke();
  }

  get isWall() {
    return this.entity === Entity.Wall;
  }

  get isEmpty() {
    return this.entity === Entity.Empty;
  }
}

export { Grid, Cell, type Orientation };
