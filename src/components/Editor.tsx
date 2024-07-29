"use client";

import { fabric } from "fabric";
import React, { useEffect } from "react";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import "@/utils/fabric-utils";
import { Resources } from "./Resources";
import { ElementsPanel } from "./panels/ElementsPanel";
import { Menu } from "./Menu";
import { TimeLine } from "./TimeLine";

export const Editor = observer(() => {
  const store = React.useContext(StoreContext);

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      height: 397.202,
      width: 223.433,
      backgroundColor: "#000000",
    });
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#00a0f5";
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerStrokeColor = "#0063d8";
    fabric.Object.prototype.cornerSize = 10;
    // canvas mouse down without target should deselect active object
    canvas.on("mouse:down", function (e) {
      if (!e.target) {
        store.setSelectedElement(null);
      }
    });

    store.setCanvas(canvas);
    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  }, []);
  return (
    <div className="grid grid-rows-[20px_500px_1fr] grid-cols-[60px_200px_800px_1fr] h-[100%]">
      <div className="col-span-4 bg-white text-right px-2 text-xs">
      
      </div>
      <div className="tile bg-black row-span-2 flex flex-col">
        <Menu />
      </div>
      <div className="bg-[#0e0e11] row-span-2 flex flex-col overflow-auto">
        <Resources />
      </div>
      <div className="flex bg-[#eff3f5] items-center justify-center">
        <canvas id="canvas" className="h-[500px] w-[800px] m-auto" />
      </div>
      <div className="bg-white col-start-4 row-start-2">
        <ElementsPanel />
      </div>
      <div className="bg-white col-start-3 row-start-3 col-span-2 relative overflow-scroll px-[10px] py-[4px]">
        <TimeLine />
      </div>
    </div>
  );
});
