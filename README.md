# Iraq Weather App

A bilingual (Arabic / English) weather app covering all 18 Iraqi governorates, built with React and the OpenWeather API. Switching language flips the whole interface between RTL and LTR.

**Live demo:** <LIVE_URL>

## Features

- Current weather for all 18 governorates: temperature, conditions with icon, and min / max.
- Arabic and English interface with a one-click toggle; the layout direction switches between RTL and LTR.
- Localized date (weekday, day, month, year) using the browser's built-in `Intl` support, with no date library.
- Weather descriptions are returned by the API in the selected language.
- Loading and error states with translated messages, including a "city not found" case.
- Outdated requests are cancelled when you switch city or language quickly (`AbortController`), so the UI never shows data for the wrong city.
- Responsive card layout (CSS Grid + Flexbox) that works on phones and desktop.

## Tech stack

- React (hooks)
- Vite
- OpenWeather Current Weather API
- Plain CSS (Grid, Flexbox)

## Run locally

```bash
git clone https://github.com/ALI-cmd-front-developer/iraq-weather-app.git
cd iraq-weather-app
npm install
cp .env.example .env   # then add your own key
npm run dev
```

Get a free API key at [openweathermap.org](https://openweathermap.org/api) and put it in `.env`:

```
VITE_WEATHER_KEY=your_openweather_api_key
```

Restart the dev server after changing `.env`; Vite reads it only at startup.

## Design notes

- **Identity vs. display vs. query.** Each governorate has three separate values: an English key (used as the `<select>` value and app state), an Arabic label (display only), and the query sent to the API. Language changes never alter the selected city.
- **Governorate to capital mapping.** The API matches city names, not governorates, so each governorate is mapped to its capital (for example Nineveh to Mosul).
- **HTTP errors are checked manually.** `fetch` does not reject on 404 or 401, so the response status is checked and turned into an error. The error state stores a key that is translated at render time, so messages follow the language toggle.
- **Request cleanup.** The data-fetching effect depends on `[city, language]` and aborts the previous request in its cleanup function.

## Limitations

- Min / max come from the Current Weather endpoint, so they reflect variation across the city at request time, not the day's forecast range.
- The API key is bundled into client-side code and is visible in the browser. That is acceptable for a free-tier demo key; a production app should send requests through a small backend proxy that keeps the key secret.

## Author

Ali, Frontend / React developer. [GitHub](https://github.com/ALI-cmd-front-developer)