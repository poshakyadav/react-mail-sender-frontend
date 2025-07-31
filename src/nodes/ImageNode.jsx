import { DecoratorNode } from "lexical";
import React from "react";
import ResizableImage from "../components/ResizableImage";

export class ImageNode extends DecoratorNode {
  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__width,
      node.__height,
      node.__key,
      node.__position
    );
  }

  constructor(
    src,
    alt,
    width = "auto",
    height = "auto",
    key,
    position = { top: 0, left: 0 }
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
    this.__position = position;
  }

  static importJSON(serializedNode) {
    return new ImageNode(
      serializedNode.src,
      serializedNode.alt,
      serializedNode.width,
      serializedNode.height,
      serializedNode.position
    );
  }

  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
      position: this.__position,
    };
  }

  createDOM() {
    return document.createElement("div");
  }

  updateDOM() {
    return false;
  }

  static importDOM() {
    return {
      img: (node) => ({
        conversion: () => ({
          node: new ImageNode(
            node.getAttribute("src"),
            node.getAttribute("alt"),
            node.style.width || "auto",
            node.style.height || "auto"
          ),
        }),
        priority: 0,
      }),
    };
  }

  // Add the missing methods to update node properties
  setWidth(width) {
    const writable = this.getWritable();
    writable.__width = width;
  }

  setHeight(height) {
    const writable = this.getWritable();
    writable.__height = height;
  }

  setPosition(position) {
    const writable = this.getWritable();
    writable.__position = position;
  }

  decorate() {
    return (
      <ResizableImage
        src={this.__src}
        alt={this.__alt}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
        position={this.__position}
      />
    );
  }
}

export function $createImageNode(
  src,
  alt = "",
  width = "auto",
  height = "auto",
  position = { top: 0, left: 0 }
) {
  return new ImageNode(src, alt, width, height, undefined, position);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
