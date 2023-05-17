/*  Sistemas y Tecnologías Web - Fabra Caro, Francisco
*   Proyecto:                    Zaragoza en Juego 
*   Fichero:                     stats.ts
*   Desarrolladores:             Aréjula Aísa, Íñigo                  - 785370              
*                                González Martínez de Apellániz, Ibón - 756878
*                                Ruiz Borao, Juan José                - 756640
*                                Penacho, Ismael                      - 774572
*/

import mongoose, { Model, Schema } from "mongoose";
import { Kind } from "./kindRules";

export type State = "sunny" | "cloudy" | "rainy" ;

export interface WeatherData {
  date: Date;
  temperature: number;
  state: string;
  electricity: number;
}

const weatherDataSchema = new Schema<WeatherData>({
  date: { type: Date, required: true },
  temperature: { type: Number, required: true },
  state: { type: String, required: false },
  electricity: { type: Number, required: true },
});

const WeatherDataModel: Model<WeatherData> =
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  mongoose.models.WeatherData ||
  mongoose.model("WeatherData", weatherDataSchema);

export default WeatherDataModel;
