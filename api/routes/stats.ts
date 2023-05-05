import { Request, Response, Router } from "express";
import { getWeatherData } from "../controllers/stats";

const router = Router();

router
    .get("/weather", getWeatherData)

export default router;