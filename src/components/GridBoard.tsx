"use client";

import { FC } from "react";
import { Grid } from "@/libs/board";
import GridCell from "./GridCell";
import { Brush } from "@/libs/brush";

interface Props {
  grid: Grid;
}

export const GridBoard: FC<Props> = ({ grid }): JSX.Element => {
  const brush = new Brush();
  return (
    <table id="board" className="prevent-select">
      <tbody className="pathfinder-table">
        {grid.cells.map((row, rowId) => (
          <tr key={rowId}>
            {row.map((cell, colId) => {
              return (
                <GridCell
                  grid={grid}
                  cell={cell}
                  brush={brush}
                  key={`${rowId}-${colId}`}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
