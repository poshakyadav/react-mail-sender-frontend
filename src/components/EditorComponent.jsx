import "../assets/css/style.css";
import Editor from "../editor/Editor";

export default function EditorComponent() {
  return (
    <div className="App">
      <h1>Rich Text Example</h1>
      <p>Note: this is an experimental build of Lexical</p>
      <Editor />
      
    </div>
  );
}
