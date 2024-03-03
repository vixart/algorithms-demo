import { FC } from "react";

import { observer } from "mobx-react-lite";
import { Grid, Cell } from "@/libs/board";
import { Brush } from "@/libs/brush";
import { getAnimationOn, isMouseDown } from "@/libs/localstorage";

interface Props {
  cell: Cell;
  grid: Grid;
  brush: Brush;
}

const GridCell: FC<Props> = observer(({ cell, grid, brush }) => {
  let fakeUpdate = cell.poke;
  let cellClass = () => {
    if (grid.checkCellIsStart(cell)) return "start";
    if (grid.checkCellIsFinish(cell)) return "finish";
    if (cell.isWall) return "wall";
    return "empty";
  };

  const animation = () => {
    if (!getAnimationOn() || !cell.isAnimated) return "";
    if (grid.checkCellIsStart(cell) && brush.isStart) return "animation";
    if (grid.checkCellIsFinish(cell) && brush.isFinish) return "animation";
    if (!grid.checkCellIsStart(cell) && !grid.checkCellIsFinish(cell)) {
      if (cell.isEmpty && !brush.isStart && !brush.isFinish) return "animation";
      if (cell.isWall) return "animation";
    }
    return "";
  };

  const onMouseDown = () => {
    if (grid.checkCellIsStart(cell)) {
      brush.setStart();
      cell.updatePoke();
    } else if (grid.checkCellIsFinish(cell)) {
      brush.setFinish();
      cell.updatePoke();
    } else if (cell.isEmpty || cell.isWall) {
      brush.setWall();
      cell.setWall();
    }
  };

  const onMouseOver = () => {
    if (!isMouseDown()) return;
    if (brush.isWall) cell.setWall();
    if (brush.isStart) grid.setStart(cell);
    if (brush.isFinish) grid.setFinish(cell);
  };

  const onMouseUp = () => {
    brush.setEmpty();
    grid.start.updatePoke();
    grid.finish.updatePoke();
  };

  const additionalClasses = cell.properties.join(" ");
  const emptyColor = cell.color;

  return (
    <td
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      width={25}
      height={25}
      className={`p-0 border border-slate-300 border-solid ${cellClass()} ${animation()} ${additionalClasses} ${emptyColor}`}
    ></td>
  );
});

export default GridCell;
