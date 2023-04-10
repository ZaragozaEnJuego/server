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
const findOrCreateUser = (id: string, name: string, mail: string, admin: boolean, res: Response) => {
  Users.findById(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        Users.create({
          name: name,
          liquidez: 10000,
          mail: mail,
          admin: admin,
        })
      }
    })
    .catch((err) => res.status(500).json(err));
};
const userCreate = (req: Request, res: Response) => {
  const user = Users.create({
    name: req.params.name,
    liquidez: 10000,
    mail: req.params.mail,
    admin: req.params.admin,
  })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

export { userCreate, getUserList, getUser, findOrCreateUser };
