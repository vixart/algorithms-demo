export enum Paint {
  Empty = "Empty",
  Wall = "Wall",
  Start = "Start",
  Finish = "Finish",
}

export class Brush {
  current = Paint.Empty;

  setEmpty() {
    this.current = Paint.Empty;
  }

  setWall() {
    this.current = Paint.Wall;
  }

  setStart() {
    this.current = Paint.Start;
  }

  setFinish() {
    this.current = Paint.Finish;
  }

  get isEmpty() {
    return this.current === Paint.Empty;
  }

  get isWall() {
    return this.current === Paint.Wall;
  }

  get isStart() {
    return this.current === Paint.Start;
  }

  get isFinish() {
    return this.current === Paint.Finish;
  }
}
