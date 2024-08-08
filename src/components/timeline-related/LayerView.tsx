"use client";
import React from "react";
import { Layer } from "@/types";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import { TimeFrameView } from "./TimeFrameView";

export const LayerView = observer((props: { layer: Layer }) => {
  const store = React.useContext(StoreContext);
  const { layer } = props;
  const isSelected = store.selectedLayerId === layer.id;

  return (
    <div 
      className={`relative width-full my-2 ${
        isSelected ? "border-2 border-indigo-600 bg-slate-200" : ""
      }`}
    >
      <div 
        onClick={() => store.selectLayer(layer.id)}
        className={`text-white text-xs px-2 py-1 ${isSelected ? "bg-indigo-600" : "bg-slate-600"}`}
      >
        Layer {store.layers.indexOf(layer) + 1} 
      </div>

      {layer.elements.map((element) => (
        <TimeFrameView key={element.id} element={element} />
      ))}
    </div>
  );
});