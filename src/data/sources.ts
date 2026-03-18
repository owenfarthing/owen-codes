export const DATA_SOURCES = {
  countries: {
    name: "REST Countries",
    url: "https://restcountries.com",
    endpoint: "https://restcountries.com/v3.1/all",
    license: "CC BY 4.0",
  },
  climate: {
    name: "Open-Meteo",
    url: "https://open-meteo.com",
    endpoint: "https://api.open-meteo.com/v1/forecast",
    license: "Open Source (AGPL)",
  },
  openLibrary: {
    name: "Open Library",
    url: "https://openlibrary.org",
    endpoint: "https://openlibrary.org/trending/daily.json",
    license: "Open Data",
  },
  artic: {
    name: "Art Institute of Chicago",
    url: "https://www.artic.edu",
    endpoint: "https://api.artic.edu/api/v1/artworks",
    license: "CC0 Public Domain",
  },
} as const;

export type DataSourceKey = keyof typeof DATA_SOURCES;
