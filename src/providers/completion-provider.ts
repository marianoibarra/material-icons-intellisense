import { CompletionItem, CompletionItemProvider, Position, ProviderResult, TextDocument } from "vscode";
import { match } from "../utils/match";
import { Icon, Matches } from "../utils/types";

export class CompletionProvider implements CompletionItemProvider {
  private readonly partialCompletionItems: CompletionItem[] = [];
  private readonly completionItems: Map<string, CompletionItem> = new Map();
  private readonly matchOptions: Matches;

  constructor(icons: Icon[], matchOptions: Matches) {
    this.matchOptions = matchOptions;
    this.partialCompletionItems = icons.map(icon => icon.partialCompletionItem);
    this.completionItems = new Map(icons.map(icon => [icon.name, icon.completionItem]));
  }

  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[]> {
    if (match(document, position, this.matchOptions)) {
      return this.partialCompletionItems;
    }

    return undefined;
  }

  resolveCompletionItem(item: CompletionItem): ProviderResult<CompletionItem> {
    return this.completionItems.get(`${item.label}`);
  }
}
