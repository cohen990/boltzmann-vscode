import { Range, TextEditor, TextEditorDecorationType } from "vscode";

export type Highlight = { decoration: TextEditorDecorationType, range: Range }
type Highlightable = TextEditor

export class Highlights {
    private inner: Highlight[] = [];

    static Singleton(){
        if(highlights === undefined) {
            highlights = new Highlights();
        }

        return highlights;
    }

    public deregisterAll() {
        this.inner.forEach(x => x.decoration.dispose());
    }

	public register(highlights: Highlight[], textEditor: Highlightable) {
        this.inner = highlights;
        this.inner.forEach(x => textEditor.setDecorations(x.decoration, [x.range]));
	}
}

let highlights: Highlights | undefined = undefined;