import Users from "../models/users";
import { Request, Response, response } from "express";

const getUserList = (req: Request, res: Response) => {
  Users.find()
    .then((list) => res.status(200).json(list))
    .catch((err) => res.status(500).json(err));
};

const getUser = (req: Request, res: Response) => {
  Users.findById(req.params.id)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json(err));
};
const findOrCreateUser = (req: Request, res: Response) => {
  Users.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        userCreate(req, res);
      }
    })
    .catch((err) => res.status(500).json(err));
};
const userCreate = (req: Request, res: Response) => {
  const user = Users.create({
    name: "Nombre",
    liquidez: 10000,
    mail: "prueba",
    admin: false,
  })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

export { userCreate, getUserList, getUser, findOrCreateUser };
