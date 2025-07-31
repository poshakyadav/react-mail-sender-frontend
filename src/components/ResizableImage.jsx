import React, { useState, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";

export default function ResizableImage({ src, alt, width, height, nodeKey, position }) {
  const [editor] = useLexicalComposerContext();
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);
  const [currentPosition, setCurrentPosition] = useState(position);
  const isResizing = useRef(false);
  const isDragging = useRef(false);

  const startResize = (e) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseInt(currentWidth, 10);
    const startHeight = parseInt(currentHeight, 10);

    const onMouseMove = (moveEvent) => {
      if (isResizing.current) {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        const newHeight = startHeight + (moveEvent.clientY - startY);
        setCurrentWidth(`${Math.max(newWidth, 50)}px`);
        setCurrentHeight(`${Math.max(newHeight, 50)}px`);
      }
    };

    const onMouseUp = () => {
      isResizing.current = false;
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node) {
          node.setWidth(currentWidth);
          node.setHeight(currentHeight);
        }
      });
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const startDrag = (e) => {
    e.preventDefault();
    isDragging.current = true;
    const startX = e.clientX - currentPosition.left;
    const startY = e.clientY - currentPosition.top;

    const onMouseMove = (moveEvent) => {
      if (isDragging.current) {
        setCurrentPosition({
          left: moveEvent.clientX - startX,
          top: moveEvent.clientY - startY,
        });
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node) {
          node.setPosition(currentPosition);
        }
      });
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: currentPosition.top,
        left: currentPosition.left,
        width: currentWidth,
        height: currentHeight,
        cursor: "move",
      }}
      onMouseDown={startDrag}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: currentWidth,
          height: currentHeight,
          maxWidth: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "10px",
          height: "10px",
          backgroundColor: "blue",
          cursor: "nwse-resize",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          startResize(e);
        }}
      />
    </div>
  );
}
