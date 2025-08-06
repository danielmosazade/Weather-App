import React, { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { Skeleton } from "@mui/material";
import { useCity } from "./CityContext";

interface ForecastItem {
  dt_txt: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

interface ForecastResponse {
  list: ForecastItem[];
}

interface DailyForecast {
  dayName: string;
  morning?: ForecastItem;
  afternoon?: ForecastItem;
  evening?: ForecastItem;
}

const getHebrewDayName = (dateStr: string): string => {
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const date = new Date(dateStr);
  return days[date.getDay()];
};

const translateDescription = (desc: string): string => {
  const map: { [key: string]: string } = {
    "clear sky": "שמיים בהירים",
    "few clouds": "מעט עננים",
    "scattered clouds": "עננים מפוזרים",
    "broken clouds": "עננות שבורה",
    "overcast clouds": "מעונן",
    "light rain": "גשם קל",
    "moderate rain": "גשם בינוני",
    "heavy intensity rain": "גשם כבד",
    rain: "גשם",
    "shower rain": "ממטרים",
    thunderstorm: "סופת רעמים",
    snow: "שלג",
    mist: "ערפל",
  };

  return map[desc.toLowerCase()] || desc;
};

const groupForecastByDay = (list: ForecastItem[]): DailyForecast[] => {
  const days: { [date: string]: DailyForecast } = {};

  list.forEach((item) => {
    const dateTime = new Date(item.dt_txt);
    const dateStr = item.dt_txt.split(" ")[0];
    const hour = dateTime.getHours();

    if (!days[dateStr]) {
      days[dateStr] = { dayName: getHebrewDayName(dateStr) };
    }

    if (hour >= 6 && hour < 12) {
      days[dateStr].morning = item;
    } else if (hour >= 12 && hour < 18) {
      days[dateStr].afternoon = item;
    } else if (hour >= 18 && hour <= 23) {
      days[dateStr].evening = item;
    }
  });

  return Object.values(days).slice(0, 5);
};

const DEBOUNCE_DELAY = 500;

const Forecast = () => {
  const { city } = useCity();

  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!city) return;

    setLoading(true);
    setError(null);

    const handler = setTimeout(() => {
      const source: CancelTokenSource = axios.CancelToken.source();

      axios
        .get<ForecastResponse>(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            city
          )}&appid=b18f3bcb0124b1fa25c78c721284ef02&units=metric`,
          { cancelToken: source.token }
        )
        .then((response) => {
          const grouped = groupForecastByDay(response.data.list);
          setForecast(grouped);
          setError(null);
        })
        .catch((error) => {
          if (axios.isCancel(error)) return; // קריאה בוטלה, אין שגיאה
          setError("שגיאה בטעינת תחזית, בדוק את שם העיר");
          setForecast([]);
        })
        .finally(() => {
          setLoading(false);
        });

      // נקודה חשובה: נקי ביטול קריאה ישנה כשעושים קריאה חדשה או כשהקומפוננטה מתפרקת
      return () => {
        source.cancel();
      };
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [city]);

  const renderCell = (item?: ForecastItem) => {
    if (!item) return <div style={{ textAlign: "center" }}>-</div>;

    return (
      <div style={{ textAlign: "center", fontSize: "0.85rem", lineHeight: "1.2" }}>
        <img
          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
          alt={item.weather[0].description}
          style={{ width: 40, height: 40 }}
        />
        <div>{translateDescription(item.weather[0].description)}</div>
        <div style={{ fontWeight: "bold" }}>{Math.round(item.main.temp)}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: "1rem", fontFamily: "sans-serif", direction: "rtl" }}>
        <h1 style={{ textAlign: "center" }}>טוען תחזית...</h1>
        {/* כאן אפשר להשאיר Skeleton */}
      </div>
    );
  }

  if (error) return <div style={{ padding: "1rem", color: "red", textAlign: "center" }}>{error}</div>;

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", direction: "rtl" }}>
      <h1 style={{ textAlign: "center" }}>תחזית ל־5 ימים עבור {city}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "100px repeat(3, 1fr)", gap: "10px" }}>
        <div></div>
        <div style={{ textAlign: "center", fontWeight: "bold" }}>בוקר</div>
        <div style={{ textAlign: "center", fontWeight: "bold" }}>צהריים</div>
        <div style={{ textAlign: "center", fontWeight: "bold" }}>ערב</div>

        {forecast.map((day, index) => (
          <React.Fragment key={index}>
            <div style={{ fontWeight: "bold", textAlign: "center" }}>{day.dayName}</div>
            <div>{renderCell(day.morning)}</div>
            <div>{renderCell(day.afternoon)}</div>
            <div>{renderCell(day.evening)}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
