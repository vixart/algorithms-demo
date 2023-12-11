import { FC } from "react";
import { Grid } from "@/libs/board";
import DDMaze from "./Dropdown/DDMaze";
import SpeedRange from "./Dropdown/SpeedRange";

interface Props {
  grid: Grid;
}

const GridMenu: FC<Props> = ({ grid }): JSX.Element => {
  return (
    <div className="flex flex-row justify-between w-full h-12 border p-2 bg-neutral-2">
      <div>
        <DDMaze grid={grid} />
      </div>
      <div>
        <SpeedRange />
      </div>
    </div>
  );
};

export default GridMenu;
