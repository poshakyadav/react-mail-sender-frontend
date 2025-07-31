import ExampleTheme from "../themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "../plugins/TreeViewPlugin";
import ToolbarPlugin from "../plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "../plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "../plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "../plugins/AutoLinkPlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $isImageNode } from "../nodes/ImageNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { ImageNode, $createImageNode } from "../nodes/ImageNode";
import ImagePlugin from "../plugins/ImagePlugin";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
  ],
};

// const OnChangePlugin = ({ onChange }) => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     const updateHTML = () => {
//       editor.getEditorState().read(() => {
//         const htmlContent = $generateHtmlFromNodes(editor, null); // Get HTML content
//         onChange(htmlContent);
//       });
//     };

//     return editor.registerUpdateListener(updateHTML);
//   }, [editor, onChange]);

//   return null;
// };


// const OnChangePlugin = ({ onChange }) => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     const updateHTML = () => {
//       editor.getEditorState().read(() => {
//         try {
//           const selection = editor.getEditorState().selection;
//           if (!selection || selection.isCollapsed()) {
//             // Skip if there's no valid selection or selection is collapsed
//             return;
//           }

//           // Generate HTML from the nodes in the editor's state
//           const htmlContent = $generateHtmlFromNodes(editor, (node) => {
//             console.log("Entered on generateHtmlFromNodes() ");
//             if ($isImageNode(node)) {
//               console.log("Entered on if from the generateHtmlFromNodes() ");
//               return `<img src="${node.__src}" alt="${node.__alt}" style="width:${
//                 node.__width
//               }; height:${node.__height}; position:absolute; left:${
//                 node.__position?.left || 0
//               }px; top:${node.__position?.top || 0}px;" />`;
//             }
//             console.log("Returning null from the generateHtmlFromNodes() ");
//             return null; // Let Lexical handle other nodes
//           });

//           console.log("Generated HTML Content:", htmlContent);
//           onChange(htmlContent); // Pass the generated HTML to the parent
//         } catch (err) {
//           console.error("Error generating HTML content:", err);
//         }
//       });
//     };

//     return editor.registerUpdateListener(updateHTML);
//   }, [editor, onChange]);

//   return null;
// };

const OnChangePlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const updateHTML = () => {
      // Get the root element of the editor
      const rootElement = editor.getRootElement();

      // Initialize the HTML content to be generated
      let htmlContent = '';

      // Traverse the children of the root element (HTMLCollection)
      Array.from(rootElement.children).forEach((childNode) => {
        // Check if the child node is an image and process accordingly
        if (childNode.tagName === 'IMG') {
          const src = childNode.src;
          const alt = childNode.alt;
          const width = childNode.width;
          const height = childNode.height;
          const style = childNode.style.cssText;

          htmlContent += `<img src="${src}" alt="${alt}" style="width:${width}px; height:${height}px; ${style}" />`;
        } else {
          // Handle other types of nodes (e.g., text nodes)
          htmlContent += childNode.textContent || '';
        }
      });

      // Pass the HTML content to the parent component
      onChange(htmlContent);
    };

    // Register the update listener for the editor
    return editor.registerUpdateListener(updateHTML);
  }, [editor, onChange]);

  return null;
};



export default function Editor({ onChange }) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          {/* <TreeViewPlugin /> */}
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ImagePlugin />
          <OnChangePlugin onChange={onChange} />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
