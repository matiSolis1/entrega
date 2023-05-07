import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/realTimeProducts', async (req, res) => {
try {
    let allProducts = await productManager.getProducts()
    res.render('realTimeProducts', {allProducts});
} catch (error) {
    res.status(400).send({
    status: "Error",
    msg: `Los productos solicitados no se pueden visualizar.`
    });
}
});

router.get("/", async (req, res) => {
    let allProducts = await productManager.getProducts()
    res.render('home', {products: allProducts})
})

export default router;