import { Router } from "express";
import productsRouter from "../src/routes/products.route.mjs";
import OrdersHandler from "./routes/orders.route.mjs";
export const router = Router();

router.use('/products', productsRouter)
router.use('/orders',OrdersHandler)
//router.use('./itemsOrder')

export default router;