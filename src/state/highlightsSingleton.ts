import { Range, TextEditor, TextEditorDecorationType } from "vscode";
import { Option } from "../option";
import { Logger } from "../logger";

export type Highlight = { decoration: TextEditorDecorationType, range: Range }
type Highlightable = TextEditor

export class Highlights {
    private inner: Highlight[] = [];
    private enabled: boolean = false;
    
    static Singleton(){
        if(highlights === undefined) {
            highlights = new Highlights();
        }
        
        return highlights;
    }

    static Disabled(): boolean {
        return !this.Singleton().enabled;
    }

    static Enabled() {
        return this.Singleton().enabled;
    }

	static Enable() {
        this.Singleton().enabled = true;
	}

	static Disable() {
        this.Singleton().enabled = false;
	}

    
    public deregisterAll(logger: Logger) {
        logger.info("disposing all decorations");
        this.inner.forEach(x => x.decoration.dispose());
    }
    
    public register(highlights: Highlight[], textEditor: Option<Highlightable>) {
        if(!this.enabled) { return; }
        this.inner = highlights;
        this.inner.forEach(x => textEditor.then((inner) => inner.setDecorations(x.decoration, [x.range])));
    }

}

let highlights: Highlights | undefined = undefined;