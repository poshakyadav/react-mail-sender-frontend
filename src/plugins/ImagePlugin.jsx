import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ImageNode, $createImageNode } from "../nodes/ImageNode";
import { $getRoot } from "lexical";


export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  // const handleUpload = () => {
  //   const url = prompt("Enter the image URL:");
  //   if (url) {
  //     editor.update(() => {
  //       const editorContainer = document.querySelector(".editor-input");
  //       const editorBounds = editorContainer.getBoundingClientRect();

  //       // Ensure the initial image is within bounds
  //       const initialWidth = Math.min(200, editorBounds.width);
  //       const initialHeight = "auto";

  //       const imageNode = $createImageNode(url, "", initialWidth, initialHeight);
  //       // const root = editor.getEditorState().read(() => $getRoot());
  //       // root.append(imageNode);
  //       editor.update(() => {
  //         const root = $getRoot();
  //         root.append(imageNode);
  //       });
  //     });
  //   }
  // };

  const handleUpload = () => {
    const url = prompt("Enter the image URL:");
    if (url) {
      editor.update(() => {
        const root = $getRoot();
        const initialWidth = "200px";
        const initialHeight = "auto";
        const imageNode = $createImageNode(
          url,
          "Image description",
          initialWidth,
          initialHeight
        );
        root.append(imageNode);
      });
    }
  };
  return (
    <button onClick={handleUpload} className="image-upload-button">
      Add Image
    </button>
  );
}
