import { ActionPanel, CopyToClipboardAction, Icon, List, OpenInBrowserAction } from "@raycast/api";
import { useState } from "react";
import { useWiktionaryPageSummary, useWiktionarySearch } from "./wiktionary";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const { data: titles, isValidating } = useWiktionarySearch(search);

  return (
    <List
      throttle
      isLoading={isValidating}
      onSearchTextChange={setSearch}
      searchBarPlaceholder="Search pages by name..."
    >
      {titles?.map((title) => (
        <PageItem key={title} title={title} />
      ))}
    </List>
  );
}

function PageItem({ title }: { title: string }) {
  const { data: extract } = useWiktionaryPageSummary(title);
  const escapedTitle = title.replaceAll(" ", "_");
  return (
    <List.Item
      icon={Icon.TextDocument}
      id={title}
      key={title}
      title={title}
      subtitle={extract}
      actions={
        <ActionPanel>
          <OpenInBrowserAction url={`https://wiktionary.org/wiki/${escapedTitle}`} />
          <CopyToClipboardAction
            title="Copy URL"
            shortcut={{ modifiers: ["cmd"], key: "." }}
            content={`https://wiktionary.org/wiki/${escapedTitle}`}
          />
        </ActionPanel>
      }
    />
  );
}
