import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import cartRouter from './routes/cart.router.js';
import productRouter from './routes/product.router.js';
import viewsRouter from "./routes/views.routes.js";
import ProductManager from "./controllers/ProductManager.js";
import chatRouter from "./routes/chat.router.js";

const PORT = process.env.PORT || 8080;
const app = express();
const server = app.listen(PORT, ()=>{
    console.log('Servidor funcionando en el puerto: '+PORT);
})
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use('/',viewsRouter)
app.use('/realTimeProducts',viewsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/products/', productRouter);
app.use('/api/carts/', cartRouter);

const io = new Server(server);
const productManager = new ProductManager();
const messages = [];
io.on('connection', async Socket => {
    console.log('socket connected');
    const products = await productManager.getProducts();
    io.emit('productList', products);
    Socket.on('message', data => {
        io.emit('log', data);
    });
    Socket.on('productAdd', async newProd=> {
        let newProduct = await productManager.addProduct(newProd);
        const products = await productManager.getProducts();
        io.emit('productList', products);
    });
    Socket.on('productDeleted', async delProd =>{
        let pid = await productManager.deleteProduct(delProd);
        const products = await productManager.getProducts();
        io.emit('productList', products);
    });
    Socket.on('message', data=>{
        messages.push(data);
        io.emit('messageLogs', messages)
    })
    Socket.on('authenticated', (data) =>{      
        Socket.broadcast.emit('newUserConnected', data)
    })
});