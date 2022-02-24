import { getRandomPageTitle } from "./wiktionary";
import { closeMainWindow, open } from "@raycast/api";

export default async function () {
  const pageTitle = await getRandomPageTitle();
  await open(`https://wiktionary.org/wiki/${pageTitle}`);
  await closeMainWindow({ clearRootSearch: true });
}
