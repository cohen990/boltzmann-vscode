import { Range, TextEditor, TextEditorDecorationType } from "vscode";
import { Option } from "../option";
import { Logger } from "../logger";

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
    
    public deregisterAll(logger: Logger) {
        logger.info("disposing all decorations");
        this.inner.forEach(x => x.decoration.dispose());
    }
    
    public register(highlights: Highlight[], textEditor: Option<Highlightable>) {
        this.inner = highlights;
        this.inner.forEach(x => textEditor.then((inner) => inner.setDecorations(x.decoration, [x.range])));
    }
}

let highlights: Highlights | undefined = undefined;