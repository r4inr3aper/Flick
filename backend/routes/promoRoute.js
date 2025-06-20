import express from "express";
import { addPromo, listPromos, validatePromo, applyPromo, deletePromo, togglePromoStatus } from "../controllers/promoController.js";

const promoRouter = express.Router();

promoRouter.post("/add", addPromo);
promoRouter.get("/list", listPromos);
promoRouter.post("/validate", validatePromo);
promoRouter.post("/apply", applyPromo);
promoRouter.post("/delete", deletePromo);
promoRouter.post("/toggle", togglePromoStatus);

export default promoRouter;
