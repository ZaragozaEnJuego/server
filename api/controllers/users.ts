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

const updateAccess = (req: Request, res: Response) => {
  const { access } = req.body

  Users.findByIdAndUpdate(
    req.params.id,
    { access },
    { new: true } // devuelve el usuario actualizado
  ).then((user) => !user ? res.status(404).json({ message: 'User not found' }) : res.status(200).json(user))
   .catch((err) => res.status(500).json(err))
}

const findOrCreateUser = (id: string, name: any, mail: string, admin: boolean) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ mail: mail })
      .then((user) => {
        if (user) {
          resolve(user);
          console.log(`El usuario encontrado es: ${user}`);
        } else {
          console.log(`No se encontró ningún usuario con el correo ${mail}`)
          Users.create({
            name: name,
            liquidez: 10000,
            mail: mail,
            admin: admin,
          }).then((newUser) => {
            console.log("Creado correctamente.")
            resolve(newUser);
          }).catch((err) => {
            reject(err);
          });
        }
      })
      .catch((err) => reject(err));
  });
};

export { getUserList, getUser, findOrCreateUser, updateAccess };
