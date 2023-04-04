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

export { propertieCreate, getPropertieList, getPropertie };
