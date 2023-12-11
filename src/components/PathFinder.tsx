"use client";

import { FC, createContext, useEffect, useMemo, useRef, useState } from "react";
import GridMenu from "./GridMenu";
import { GridBoard } from "./GridBoard";
import useMouseDown from "@/libs/mousedown";
import { Grid } from "@/libs/board";

interface Props {}

const contextDefaults = { isMouseDown: false };
const PathFinderContext = createContext(contextDefaults);

const PathFinder: FC<Props> = (): JSX.Element => {
  const gridRef = useRef<Grid | null>(null);
  const gridBoardRef = useRef<HTMLDivElement>(null);
  const [renderTime, setRenderTime] = useState(new Date());

  useMouseDown();
  useEffect(() => {
    const tableNode = gridBoardRef.current;
    const width = tableNode ? tableNode.clientWidth : 75;
    const height = tableNode ? tableNode.clientHeight : 75;
    console.log(width, height);
    let rowsNum = Math.floor(height / 27);
    let colsNum = Math.floor(width / 27);
    rowsNum = rowsNum % 2 === 0 ? rowsNum - 1 : rowsNum;
    colsNum = colsNum % 2 === 0 ? colsNum - 1 : colsNum;
    gridRef.current = new Grid(rowsNum, colsNum);
    setRenderTime(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return useMemo(
    () => (
      <div className="flex flex-col flex-nowrap w-screen h-screen">
        <div className=" min-h-fit">
          {gridRef.current && <GridMenu grid={gridRef.current} />}
        </div>

        <div
          className="prevent-select flex-auto flex items-center justify-center"
          ref={gridBoardRef}
        >
          {gridRef.current && <GridBoard grid={gridRef.current} />}
        </div>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderTime]
  );
};

export default PathFinder;
export { PathFinder, PathFinderContext };
