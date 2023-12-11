"use client";

import { FC, useState } from "react";
import { getSpeed, setSpeed } from "@/libs/delay";
import Image from "next/image";

interface Props {}

const SpeedRange: FC<Props> = (): JSX.Element => {
  const [currentSpeed, _] = useState(getSpeed());

  return (
    <div className="pr-5 flex flex-row flex-wrap content-center justify-between">
      <Image
        priority
        src="/icons/speedometer.svg"
        alt="speedometer"
        width="23"
        height="23"
      />
      <div>
        <input
          type="range"
          min="0"
          max="10"
          defaultValue={currentSpeed}
          step="1"
          onChange={(e) => setSpeed(Number(e.currentTarget.value))}
          className={`w-full h-2 ml-1 rounded-lg cursor-pointer speedometer`}
        />
      </div>
    </div>
  );
};

export default SpeedRange;
