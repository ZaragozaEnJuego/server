import Propertie from "../models/properties";
import { Request, Response } from "express";
import WeatherDataModel from "../models/temperature";
import KindRulesModel from "../models/kindRules";
import mongoose from "mongoose";

const getPropertieList = (req: Request, res: Response) => {
    Propertie.find()
        .then((list) => res.status(200).json(list))
        .catch((err) => res.status(500).json(err));
};

const getPropertie = async (req: Request, res: Response) => {
    if (req.params.id === undefined) {
        res.status(400).json({ msg: "No id provided" });
        return;
    }
    const propertie = await Propertie.findById(req.params.id);
    if (propertie === null) {
        res.status(400).json({ msg: "Propertie does not exist" });
        return;
    }

    const today = new Date(); // Get current date
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // Date last month

    // Realiza la consulta a la base de datos
    const weatherData = await WeatherDataModel.find({
        date: { $gte: thirtyDaysAgo, $lte: today },
    });
    if (weatherData === null) {
        res.status(500).json({ msg: "Internal error" });
        return;
    }

    const kindResData = await KindRulesModel.findOne({
        kind: propertie.kind,
    });
    if (kindResData === null) {
        res.status(500).json({ msg: "Internal error" });
        return;
    }

    interface statsDTO {
        date: Date;
        income: number;
    }
    const stats = weatherData.map((dayData): statsDTO => {
        //calculate the income modifier
        let tempModifier = 0;
        if (kindResData.MaxTemperature.value < dayData.temperature) {
            tempModifier =
                propertie.income * kindResData.MaxTemperature.modifier;
        } else if (kindResData.MinTemperature.value > dayData.temperature) {
            tempModifier =
                propertie.income * kindResData.MinTemperature.modifier;
        }
        //calculate the electricity modifier

        const electricityPrice =
            kindResData.EnergyConsumption * dayData.electricity;
        //calculate the weather modifier
        let weatherModifier = 0;
        switch (dayData.state) {
            case "sunny":
                weatherModifier = propertie.income * kindResData.Weather.sunny;
                break;
            case "cloudy":
                weatherModifier = propertie.income * kindResData.Weather.cloudy;
                break;
            case "rainy":
                weatherModifier = propertie.income * kindResData.Weather.rainy;
                break;

            default:
                break;
        }

        return {
            date: dayData.date,
            income:
                propertie.income +
                tempModifier -
                electricityPrice +
                weatherModifier,
        };
    });
    res.status(200).json({
        name: propertie.name,
        _id: propertie._id,
        address: propertie.address,
        price: propertie.price,
        income: propertie.income,
        owner: propertie.owner,
        kind: propertie.kind,
        stats: stats,
    });
};

const getPropertieRules = async (req: Request, res: Response) => {
    const propertieId = req.params.id;
    //check propertie id was provided
    if (!propertieId) {
        res.status(404).json({
            message: "Not found, propertie id is required",
        });
        return;
    }

    Propertie.findById(propertieId)
        .then((propertie) => {
            KindRulesModel.find({ kind: propertie?.kind })
                .then((kindRules) => {
                    res.status(200).json(kindRules);
                })
                .catch((reason) =>
                    res.status(500).json({
                        message: "Propertie have not kind rules associated",
                    })
                );
        })
        .catch((reason) => {
            res.status(404).json({
                message: "Not found, propertie does not exist",
            });
        });
};

const propertieBuy = async (req: Request, res: Response) => {
    interface IBody {
        ownerId: string;
    }
    const propertieId = req.params.id;
    const body: IBody = req.body;

    //check propertie id was provided
    if (!propertieId) {
        res.status(404).json({
            message: "Not found, propertie id is required",
        });
        return;
    }

    //check owner id was provided
    if (!body.ownerId) {
        res.status(400).json({
            message: "owner id is required",
        });
        return;
    }

    // Iniciar una nueva sesión de MongoDB para garantizar atomicidad en todas las consultas
    const session = await mongoose.startSession();

    //validate newOwner

    try {
        await session.withTransaction(async () => {
            const updatedPropertie = await Propertie.findByIdAndUpdate(
                propertieId,
                { owner: body.ownerId },
                { new: true }
            );
            res.status(201).json(updatedPropertie);
        });
    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    } finally {
        // Finalizar la sesión de MongoDB
        session.endSession();
    }
};

const propertieCreate = (req: Request, res: Response) => {
    const propertie = Propertie.create({
        name: "Nombre",
        address: "Dirección",
        income: 100,
        price: 10000,
        kind: "Health",
    })
        .then((propertie) => {
            res.status(201).json(propertie);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
};

export {
    propertieCreate,
    getPropertieList,
    getPropertie,
    getPropertieRules,
    propertieBuy,
};
