import React, { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useCity } from "../components/CityContext";
import Navbar from "../components/Navbar";

interface ForecastResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: { description: string; icon: string }[];
    wind: { speed: number };
    clouds: { all: number };
  }[];
}

const MoreInfoForecast = () => {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { city } = useCity();

  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();
    setLoading(true);
    setError(null);

    axios
      .get<ForecastResponse>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city
        )}&appid=b18f3bcb0124b1fa25c78c721284ef02&units=metric`,
        { cancelToken: source.token }
      )
      .then((res) => {
        console.log(res);
        setForecast(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) setError(err.message);
        setLoading(false);
      });

    return () => {
      source.cancel();
    };
  }, [city]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography color="error" mt={4} align="center">
        שגיאה: {error}
      </Typography>
    );
  if (!forecast) return null;

  // לוקח את התחזית הראשונה כ״נוכחית״
  const first = forecast.list[0];
  const iconUrl = `https://openweathermap.org/img/wn/${first.weather[0].icon}@2x.png`;

  return (
    <>
      <Navbar />
      <Box display="flex" justifyContent="center" mt={4}>
        <Card sx={{ maxWidth: 345, textAlign: "center", p: 2, boxShadow: 3 }}>
          <CardMedia
            component="img"
            image={iconUrl}
            alt={first.weather[0].description}
            sx={{ width: "100px", margin: "0 auto", mt: 2 }}
          />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {city}
            </Typography>
            <Typography variant="h5" gutterBottom>
              טמפרטורה נוכחית: {first.main.temp} מעלות 
            </Typography>

            <Box display="flex" justifyContent="space-between" mt={1} mb={1}>
              <Typography variant="body2">
                מקסימום: {first.main.temp_max}
              </Typography>
              <Typography variant="body2">
                מינימום: {first.main.temp_min}
              </Typography>
            </Box>

            <Typography variant="body2">
              לחות: {first.main.humidity}%
            </Typography>
            <Typography variant="body2">
              לחץ אוויר: {first.main.pressure} hPa
            </Typography>
            <Typography variant="body2">
              מהירות רוח: {first.wind.speed} m/s
            </Typography>
            <Typography variant="body2">עננות: {first.clouds.all}%</Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default MoreInfoForecast;
