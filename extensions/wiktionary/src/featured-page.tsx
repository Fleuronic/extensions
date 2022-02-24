import { getTodayFeaturedPageTitle } from "./wiktionary";
import { closeMainWindow, open } from "@raycast/api";

export default async function () {
  const pageTitle = await getTodayFeaturedPageTitle();
  await open(`https://wiktionary.org/wiki/${pageTitle}`);
  await closeMainWindow({ clearRootSearch: true });
}
