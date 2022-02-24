import useSWR from "swr";
import got from "got";

interface WiktionaryPageExtractResponse {
  title: string;
  extract: string;
}

interface WiktionaryFeaturedSearchResponse {
  tfa: {
    displaytitle: string;
  };
}

interface WiktionarySearchResponse {
  query: {
    prefixsearch: Array<{
      title: string;
    }>;
  };
}

const client = got.extend({
  prefixUrl: "https://en.wiktionary.org/",
  responseType: "json",
});

export async function getRandomPageTitle() {
  const response = await client.get("api/rest_v1/page/random/summary").json<WiktionaryPageExtractResponse>();
  return response.title;
}

export async function getTodayFeaturedPageTitle() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const response = await client
    .get(`api/rest_v1/feed/featured/${year}/${month}/${day}`)
    .json<WiktionaryFeaturedSearchResponse>();
  return response.tfa.displaytitle;
}

async function findPagesByTitle(search: string) {
  if (!search) {
    return [];
  }
  const response = await client
    .get("w/api.php", {
      searchParams: {
        action: "query",
        list: "prefixsearch",
        format: "json",
        pssearch: search,
        pslimit: 9,
      },
    })
    .json<WiktionarySearchResponse>();
  return response.query.prefixsearch.map((result) => result.title);
}

async function getPageExtract(title: string) {
  const response = await client.get(`api/rest_v1/page/summary/${title}`).json<WiktionaryPageExtractResponse>();
  return response.extract;
}

export function useWiktionarySearch(search: string) {
  return useSWR(["pages", search], () => findPagesByTitle(search));
}

export function useWiktionaryPageSummary(title?: string) {
  return useSWR(title ? ["page/summary", title] : null, () => {
    if (title) {
      return getPageExtract(title);
    }
  });
}
