import { useCallback, useEffect } from "react";
import { setIsMouseDown, unsetIsMouseDown } from "./localstorage";

const useMouseDown = () => {
  const handleMouseDown = useCallback(() => {
    setIsMouseDown();
  }, []);

  const handleMouseUp = useCallback(() => {
    unsetIsMouseDown();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp, handleMouseDown]);
};

export default useMouseDown;
