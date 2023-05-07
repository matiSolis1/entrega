import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
import ManagerAccess from "../controllers/managerAcces.js";

const router = Router();
const productManager = new ProductManager();
const managerAccess = new ManagerAccess();

router.get('/', async (req, res)=>{
    try{
        const products = await productManager.getProducts();
        await managerAccess.createRecord('GET PRODUCTS');
        const limit = parseInt(req.query.limit);
        if (limit){
            const productNumber = products.slice(0, limit);
            return res.status(200).send(productNumber);
        }else{
            return res.status(200).send(products);
        }
    }catch (error) {
        res.status(400).send({
            status: "Error",
            msg: `Los productos solicitados no se pueden visualizar.`
        });
    }
});
router.get('/:pid', async (req, res)=>{
    try{
        await managerAccess.createRecord('GET PRODUCT BY ID');
        const pid = req.params.pid;
        res.status(200).send(await productManager.getProductById(pid));
    }catch (error) {
        res.status(400).send({
            status: "Error",
            msg: `El producto con ID: ${pid} no existe o no se pudo encontrar.`
        });
    }
});
router.post('/' , async (req, res)=>{
    try{
        await managerAccess.createRecord('POST PRODUCTS');
        const { title, description, price, thumbnail, code, stock } = req.body;
        return res.status(200).send(await productManager.addProduct({ title, description, price, thumbnail, code, stock }));
    }catch (error){
        res.status(400).send({
            status: "Error",
            msg: error.message
        });
    }
});
router.delete('/:pid', async (req, res) => {
    try {
        await managerAccess.createRecord('DELETE PRODUCT');
        const pid = req.params.pid;
        const product = await productManager.getProductById(pid);
        if (product.length === 0) {
            return res.status(400).send({
            status: "Error",
            msg: `El producto con ID: ${pid} no existe o no se pudo encontrar.`
        });
    }
    return res.status(200).send(await productManager.deleteProduct(pid));
    } catch (error) {
    res.status(400).send({
        status: "Error",
        msg: `El producto con ID: ${pid} no se ha podido eliminar.`
    });
    }
});
router.put('/:pid', async (req, res)=>{
    try{
        await managerAccess.createRecord('PUT');
        const pid = req.params.pid;
        const updates = req.body;
        res.status(200).send(await productManager.updateProduct(pid, updates));
    }catch (error){
        res.status(400).send({
            status: "Error",
            msg: `El producto con ID: ${pid} no se ha podido actualizar.`
        });
    }
});
export default router;