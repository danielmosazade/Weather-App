import React, { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { useCity } from "./CityContext";
import { useMediaQuery, Box, Typography, Paper } from "@mui/material";

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

    if (!days[dateStr]) days[dateStr] = { dayName: getHebrewDayName(dateStr) };

    if (hour >= 6 && hour < 12) days[dateStr].morning = item;
    else if (hour >= 12 && hour < 18) days[dateStr].afternoon = item;
    else if (hour >= 18 && hour <= 23) days[dateStr].evening = item;
  });

  return Object.values(days).slice(0, 5);
};

const DEBOUNCE_DELAY = 500;

const WeatherData = () => {
  const { city } = useCity();
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isMobile = useMediaQuery("(max-width:768px)");

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
          setForecast(groupForecastByDay(response.data.list));
          setError(null);
        })
        .catch((error) => {
          if (axios.isCancel(error)) return;
          setError("שגיאה בטעינת תחזית, בדוק את שם העיר");
          setForecast([]);
        })
        .finally(() => setLoading(false));

      return () => source.cancel();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [city]);

  const renderCell = (item?: ForecastItem) => {
    if (!item)
      return <Typography sx={{ textAlign: "center" }}>-</Typography>;

    const size = isMobile ? 30 : 50;
    const fontSize = isMobile ? "0.7rem" : "0.9rem";

    return (
      <Box sx={{ textAlign: "center", fontSize, lineHeight: 1.2 }}>
        <img
          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
          alt={item.weather[0].description}
          style={{ width: size, height: size }}
        />
        <div>{translateDescription(item.weather[0].description)}</div>
        <div style={{ fontWeight: "bold" }}>{Math.round(item.main.temp)}°C</div>
      </Box>
    );
  };

  if (loading)
    return (
      <Box sx={{ padding: 2, textAlign: "center", direction: "rtl" }}>
        <Typography variant="h6">טוען תחזית...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ padding: 2, textAlign: "center", color: "red", direction: "rtl" }}>
        {error}
      </Box>
    );

  return (
    <Box sx={{ padding: 2, fontFamily: "sans-serif", direction: "rtl" }}>
      <Typography variant="h5" textAlign="center" mb={2}>
        תחזית ל־5 ימים עבור {city}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          justifyContent: isMobile ? "stretch" : "space-between",
        }}
      >
        {forecast.map((day, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              flex: 1,
              padding: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography fontWeight="bold" mb={1}>
              {day.dayName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "row" : "column",
                gap: 1,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <Box>
                <Typography fontWeight="bold">בוקר</Typography>
                {renderCell(day.morning)}
              </Box>
              <Box>
                <Typography fontWeight="bold">צהריים</Typography>
                {renderCell(day.afternoon)}
              </Box>
              <Box>
                <Typography fontWeight="bold">ערב</Typography>
                {renderCell(day.evening)}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default WeatherData;
