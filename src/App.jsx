import { useState, useEffect } from "react";
import "./App.css";

const iraqGovernorates = {
  Baghdad: { ar: "بغداد", query: "Baghdad,IQ" },
  Basra: { ar: "البصرة", query: "Basra,IQ" },
  Nineveh: { ar: "نينوى", query: "Mosul,IQ" },
  Erbil: { ar: "أربيل", query: "Erbil,IQ" },
  Sulaymaniyah: { ar: "السليمانية", query: "Sulaymaniyah,IQ" },
  Duhok: { ar: "دهوك", query: "Duhok,IQ" },
  Kirkuk: { ar: "كركوك", query: "Kirkuk,IQ" },
  "Salah al-Din": { ar: "صلاح الدين", query: "Tikrit,IQ" },
  Anbar: { ar: "الأنبار", query: "Ramadi,IQ" },
  Diyala: { ar: "ديالى", query: "Baqubah,IQ" },
  Babylon: { ar: "بابل", query: "Al Hillah,IQ" },
  Karbala: { ar: "كربلاء", query: "Karbala,IQ" },
  Najaf: { ar: "النجف", query: "Najaf,IQ" },
  "Al-Qadisiyah": { ar: "القادسية", query: "Diwaniyah,IQ" },
  Muthanna: { ar: "المثنى", query: " As Samawah,IQ" },
  "Thi Qar": { ar: "ذي قار", query: "Nasiriyah,IQ" },
  Maysan: { ar: "ميسان", query: "Amarah,IQ" },
  Wasit: { ar: "واسط", query: "Kut,IQ" },
};
const translations = {
  en: {
    notFound: "City not found",
    generic: "Something went wrong",
    loading: "Loading ...",
    title: "Choose A City.",
    minima: "Minima",
    maxima: "Maxima",
  },
  ar: {
    notFound: "لم يتم العثور على المدينة",
    generic: "حدث خطأ ما",
    loading: "جاري التحميل ...",
    title: "إختر مدينة",
    minima: "الصغرى",
    maxima: "الكبرى",
  },
};
function App() {
  const API_KEY = import.meta.env.VITE_WEATHER_KEY;
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Baghdad");
  const [language, setLanguage] = useState("en");
  const t = translations[language];
  const date = new Date().toLocaleDateString(language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${iraqGovernorates[city].query}&units=metric&appid=${API_KEY}&lang=${language}`,
      { signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok)
          throw new Error(res.status === 404 ? "notFound" : "generic");
        return res.json();
      })
      .then(setWeather)
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [API_KEY, city, language]);
  //==================funcs==============================
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  function handleLanguage() {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"));
  }

  //================================================

  return (
    <div className="container">
      <div className="with-button">
        <h1>{t.title}</h1>
        <button onClick={handleLanguage}>
          {language === "ar" ? "ENGLISH" : "العربية"}
        </button>
      </div>
      <div className="select-wrapper">
        <select
          id="select"
          aria-label={t.title}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          {Object.entries(iraqGovernorates).map(([en, gov]) => (
            <option key={en} value={en}>
              {language === "ar" ? gov.ar : en}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>{t.loading}</p>}
      {error && <p>{t[error] ?? t.generic}</p>}
      <div className="date">{date}</div>
      {!loading && !error && weather && (
        <div className="weather">
          <h2 className="temp">{Math.round(weather.main.temp)}°C</h2>
          <img
            className="icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p className="desc">{weather.weather[0].description}</p>
          <p className="min">
            {t.minima} : {Math.round(weather.main.temp_min)}°
          </p>
          <p className="max">
            {t.maxima} : {Math.round(weather.main.temp_max)}°
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
