"use client";

import { FC, useCallback } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { Grid } from "@/libs/board";

interface Props {
  grid: Grid;
}

const DDMaze: FC<Props> = ({ grid }): JSX.Element => {
  let classNames = useCallback(
    (...classes: string[]) => classes.filter(Boolean).join(" "),
    []
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-primary-5 px-2 py-1 text-sm font-semibold text-neutral-10 shadow-sm ring-1 ring-inset ring-primary-4 hover:bg-primary-4">
          Mazes
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-neutral-8 duration-75"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-75"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-neutral-9 shadow-lg ring-1 ring-neutral-1 ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-neutral-10 text-neutral-1" : "text-neutral-3",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                  onClick={() => grid.genRecursiveMaze()}
                >
                  Recursive Division
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-neutral-10 text-neutral-1" : "text-neutral-3",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                  onClick={() => grid.genDepthFirstSearch()}
                >
                  Depth-First Search
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-neutral-10 text-neutral-1" : "text-neutral-3",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                  onClick={() => grid.genKruskal()}
                >
                  Kruskal&apos;s Algorithm
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-neutral-10 text-neutral-1" : "text-neutral-3",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                  onClick={() => grid.genPrim()}
                >
                  {`Prim's Algorithm`}
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-neutral-10 text-neutral-1" : "text-neutral-3",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                  onClick={() => grid.genBinaryTree()}
                >
                  Binary Tree
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-neutral-10 text-neutral-1" : "text-neutral-3",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                  onClick={() => grid.clearBoard()}
                >
                  Clear
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DDMaze;
