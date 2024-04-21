import express from "express";
import mongoose from "mongoose";
import http from "http";
import expressHandlebars from "express-handlebars";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/jwt.js"; // Asegúrate de definir la estrategia JWT correctamente aquí
import router from "./routes.js";
import auth from "./config/auth.js";
import { MONGO_URL } from "./util.js";

const app = express();
const httpServer = http.createServer(app);

// Inicializar Passport
auth.initializePassport();

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("Error de conexión a MongoDB:", err);
});

db.once("open", () => {
    console.log("Conexión a MongoDB exitosa");
});

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para utilizar cookies
app.use(cookieParser());

// Middleware para utilizar session para autenticaciones de usuarios
const sessionStore = MongoStore.create({ 
    mongoUrl: MONGO_URL,
    ttl: 15
});
app.use(session({
    store: sessionStore,
    secret: "secret_key",
    resave: false,
    saveUninitialized: false
}));

// Middleware de Passport para la autenticación de sesión
app.use(passport.initialize());
app.use(passport.session());

// Middleware para utilizar plantillas html
app.engine("handlebars", expressHandlebars());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", router);

const PORT = 8080;

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log("Servidor conectado");
});

// Servidor WebSocket
const io = require('socket.io')(httpServer);

io.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    socket.on("deleteProduct", (deleteProductId) => {
        console.log("Producto borrado:", deleteProductId);
        io.emit("deleteProduct", deleteProductId);
    });

    socket.on("addProduct", (addProduct) => {
        console.log("Producto agregado:", addProduct);
        io.emit("addProduct", addProduct);
    });

    socket.on("addMessage", (addMessage) => {
        console.log("Mensaje agregado", addMessage);
        io.emit("addMessage", addMessage);
    })

    socket.on("deleteProductCart", (deleteProductCartId) => {
        console.log("Producto eliminado del carrito", deleteProductCartId);
        io.emit("deleteProductCart", deleteProductCartId);
    });

    socket.on("clearCart", (clearCart) => {
        console.log("Carrito vaciado:", clearCart);
        io.emit("clearCart", clearCart);
    });
});