import mongoose from "mongoose";
import Propertie from "../models/properties";
import { Request, Response } from "express";

const propertieList = (req: Request, res: Response) => {
  Propertie.find()
    .then((list) => res.status(200).json(list))
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

  try {
    const updatedPropertie = await Propertie.findByIdAndUpdate(
      propertieId,
      { owner: body.ownerId },
      { new: true }
    );

    res.status(200).json(updatedPropertie);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export { propertieCreate, propertieList, propertieBuy };
