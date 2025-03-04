import { Hover, HoverProvider as IHoverProvider, Position, ProviderResult, Range, TextDocument } from "vscode";
import { match } from "../utils/match";
import { Icon, Matches } from "../utils/types";

export class HoverProvider implements IHoverProvider {
  private readonly hoverItems: Map<string, Hover>;
  private readonly matchOptions: Matches;

  constructor(icons: Icon[], matchOptions: Matches) {
    this.matchOptions = matchOptions;
    this.hoverItems = new Map(icons.map(icon => [icon.name, icon.hoverItem]));
  }

  provideHover(document: TextDocument, position: Position): ProviderResult<Hover> {
    const wordRange: Range = document.getWordRangeAtPosition(position)!;
    if (!wordRange) {
      return;
    }

    if (!match(document, wordRange.end, this.matchOptions)) {
      return;
    }

    const text: string = document.getText(wordRange);

    if (this.hoverItems.has(text)) {
      return this.hoverItems.get(text);
    }
  }
}
