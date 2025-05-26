import { TextEditor } from "vscode";
import { None, Option, Some } from "../option";

export class Editor {
    static CurrentWindow(): Option<TextEditor> {
        return currentWindow;
    }

    static SetCurrentWindow(editor: TextEditor){
        currentWindow = Some(editor);
    }
}

let currentWindow: Option<TextEditor> = None();