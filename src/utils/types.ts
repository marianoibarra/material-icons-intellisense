import { CompletionItem, CompletionItemKind, Hover, MarkdownString } from "vscode";
import { Configuration } from "./configuration";

export type IconRaw = {
  category: string;
  unicode: string;
  svg: {
    fill: string;
    outline: string;
  };
};

export interface PreviewStyle {
  backgroundColor: string;
  foregroundColor: string;
  iconFill: boolean;
}

export enum MaterialIconsVersion {
  V3 = "3",
  V4 = "4",
}

export interface Matches {
  matchClasses: string[];
  matchTags: string[];
}

const SVG_VIEWBOX: Record<MaterialIconsVersion, string> = {
  [MaterialIconsVersion.V3]: "-2 -2 28 28",
  [MaterialIconsVersion.V4]: "0 -960 960 960",
};

export class Icon {
  private readonly iconUri: string;

  constructor(public name: string, private entry: IconRaw, private config: Configuration) {
    const innerSvg = this.entry.svg[this.config.previewStyle.iconFill ? "fill" : "outline"]
      .replaceAll("<path", `<path fill="${this.config.previewStyle.foregroundColor}"`)
      .replaceAll("<circle", `<circle fill="${this.config.previewStyle.foregroundColor}"`);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="${
      SVG_VIEWBOX[this.config.version]
    }" style="background-color: ${this.config.previewStyle.backgroundColor}">${innerSvg}</svg>`;

    this.iconUri = "data:image/svg+xml;utf8;base64," + Buffer.from(svg).toString("base64");
  }

  private get documentation(): MarkdownString {
    return new MarkdownString(
      [
        `### ${this.titlelize(this.name)}`,
        `![](${this.iconUri}%20|%20width=64%20height=64")`,
        `| Category&nbsp;&nbsp;      | \`${this.entry.category}\` |`,
        `|:--------------------------|:---------------------------|`,
        `| **Unicode**               | \`${this.entry.unicode}\`  |`,
      ].join("\n")
    );
  }

  get partialCompletionItem(): CompletionItem {
    return {
      label: this.name,
      kind: CompletionItemKind.Color,
    };
  }

  get completionItem(): CompletionItem {
    return {
      label: this.name,
      kind: CompletionItemKind.Color,
      documentation: this.documentation,
    };
  }

  get hoverItem(): Hover {
    return new Hover(this.documentation);
  }

  private titlelize(str: string): string {
    str = str.replace(/_/g, " ");
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
