import { Router } from "express";
import { getWeatherData, setWeatherData } from "../controllers/stats";

const router = Router();

/* Cambiar las rutas */
router
    .get("/weather", getWeatherData)

export default router;