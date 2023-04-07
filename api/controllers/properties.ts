import mongoose from "mongoose";
import Propertie from "../models/properties";
import { Request, Response } from "express";

const getPropertieList = (req: Request, res: Response) => {
  Propertie.find()
    .then((list) => res.status(200).json(list))
    .catch((err) => res.status(500).json(err));
};

const getPropertie = (req: Request, res: Response) => {
  Propertie.findById(req.params.id)
    .then((propertie) => res.status(200).json(propertie))
    .catch((err) => res.status(500).json(err));
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
      res.status(200).json(updatedPropertie);
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  } finally {
    // Finalizar la sesión de MongoDB
    session.endSession();
  }
};

export { propertieCreate, getPropertieList, getPropertie, propertieBuy };
