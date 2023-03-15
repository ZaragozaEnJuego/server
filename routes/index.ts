import { Request, Response, Router } from "express";
var router = Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response) {
  res.send({ title: "Express" });
});

export default router;
