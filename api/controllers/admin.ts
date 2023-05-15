import Users from "../models/users";
import { Request, Response, response } from "express";

const getUserList = (req: Request, res: Response) => {
  Users.find()
    .then((list) => res.status(200).json(list))
    .catch((err) => res.status(500).json(err));
};

const updateAccess = (req: Request, res: Response) => {
  console.log("Comienzo a registrar la compra")
  if (req.params.id === undefined) {
    res.status(400).json({
      message: "user id is required",
    });
    return;
  }

  const { access } = req.body;

  if (access === undefined) {
    res.status(400).json({
      message: "attribute access is required",
    });
    return;
  }

  Users.findByIdAndUpdate(
    req.params.id,
    { access: access },
    { new: true } // devuelve el usuario actualizado
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: "User not found" })
        : res.status(200).json(user)
    )
    .catch((err) => res.status(500).json(err));
};

export { getUserList, updateAccess };
