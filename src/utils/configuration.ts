import * as vscode from "vscode";
import { Matches, MaterialIconsVersion, PreviewStyle } from "./types";

export interface Configuration {
  readonly version: MaterialIconsVersion;
  readonly previewStyle: PreviewStyle;
  readonly matches: Matches;
}

export enum ConfigKey {
  Version = "version",
  PreviewBackgroundColor = "preview.backgroundColor",
  PreviewForegroundColor = "preview.foregroundColor",
  PreviewiconFill = "preview.iconFill",
  MatchClasses = "matches.matchClasses",
  MatchTags = "matches.matchTags",
}

export function loadConfiguration(): Configuration {
  const config = vscode.workspace.getConfiguration(
    "material-icons-intellisense"
  );

  const version = config.get<MaterialIconsVersion>(
    "version",
    MaterialIconsVersion.V3
  );
  const previewStyle = {
    backgroundColor: config.get<string>(
      ConfigKey.PreviewBackgroundColor,
      "#ffffff"
    ),
    foregroundColor: config.get<string>(
      ConfigKey.PreviewForegroundColor,
      "#000000"
    ),
    iconFill: config.get<boolean>(ConfigKey.PreviewiconFill, true),
  };
  const matches = {
    matchClasses: config.get<string[]>(ConfigKey.MatchClasses, [
      "material-symbols-outlined",
      "material-symbols-rounded",
      "material-symbols-sharp",
      "material-icons",
      "material-icons-outlined",
      "material-icons-round",
      "material-icons-sharp",
      "material-icons-two-tone",
    ]),
    matchTags: config.get<string[]>(ConfigKey.MatchTags, ["span"]),
  };

  return { version, previewStyle, matches };
}
