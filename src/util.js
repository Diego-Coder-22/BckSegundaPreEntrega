import { fileURLToPath } from "url";
import path, { dirname } from "path";
import multer from "multer";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

export const MONGO_URL = "mongodb+srv://diegocodeidea:uu5qyW7bS4FGpx1I@cluster0.70gqwqq.mongodb.net/";
export const JWT_SECRET = "tu_secreto_jwt_aqui"; 
export const CLIENT_ID = "Iv1.87747fbca0bf13f1";
export const CLIENT_SECRET = "e178cebcfae3b791a651882b3b471e53096e3f69";
export const CALLBACK_URL = "http://localhost:8080/users/githubcallback";

export function getProductsFilePath() {
    return path.join(__dirname, "../productos.json");
}

export function getCartFilePath() {
    return path.join(__dirname, "../carrito.json");
}

export function configureProductMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'public', 'img'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });    

    return multer({ storage: storage });
}

export default __dirname;