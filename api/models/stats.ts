import mongoose, { Model, Schema } from "mongoose";

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
