import fs from 'fs';

const path ='./src/models/products.json';

export default class ProductManager {
    getProducts = async ()=>{
        if(fs.existsSync(path)){
            const data = await fs.promises.readFile(path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        }else{
            return [];
        }
    }
    addProduct = async ({ title, description, price, thumbnail, code, stock }) => {
        const products = await this.getProducts();
        if (products.some((product) => product.code === code)) {
            //Aca me gustaria cambiar el console.error por un error de verdad
            return console.error(`El código "${code}" ya está en uso por otro producto.`);
        }
        const newProduct = {
            pid: "PROD" + (products.length + 1),
            title,
            description,
            price,
            thumbnail,
            status: true,
            code,
            stock,
        };
        const fieldNames = Object.keys(newProduct);
        for (const fieldName of fieldNames) {
            if (!newProduct[fieldName]) {
                //Aca me gustaria cambiar el console.error por un error de verdad
                return console.error(`El campo "${fieldName}" es requerido.`);
            }
        }
        products.push(newProduct);
        await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
        return products;
    }
    getProductById = async (pid) => {
        const products = await this.getProducts();
        const product = products.filter((product) => {
            return product.pid == pid;
        });
        if (product.length === 0) {
            return null;
        }
        return product;
    }
    deleteProduct = async (pid) => {
        const products = await this.getProducts();
        const productIndex = products.findIndex((product) => product.pid === pid);
        if (productIndex === -1) {
        //Aca me gustaria cambiar el console.error por un error de verdad
            return console.error(`El producto con ID "${pid}" no existe.`);
        }
        products.splice(productIndex, 1);
        await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
        return products;
    };
    updateProduct = async (pid, updates) => {
        const products = await this.getProducts();
        const productIndex = products.findIndex((product) => product.pid === pid);
        if (productIndex === -1) {
            //Aca me gustaria cambiar el console.error por un error de verdad
            return console.error(`El producto con ID "${pid}" no existe.`);
        }
        if (updates.code && updates.code !== products[productIndex].code) {
            if (products.some((product) => product.code === updates.code)) {
                //Aca me gustaria cambiar el console.error por un error de verdad
                return console.error(`El código "${updates.code}" ya está en uso por otro producto.`);
            }
        }
        const updatedProduct = {...products[productIndex],...updates, pid,};
        const fieldNames = Object.keys(updatedProduct);
        for (const fieldName of fieldNames) {
            if (!updatedProduct[fieldName]) {
                //Aca me gustaria cambiar el console.error por un error de verdad
                return console.error(`El campo "${fieldName}" es requerido.`);
            }
        }
        products[productIndex] = updatedProduct;
        await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
        return updatedProduct;
    };
}