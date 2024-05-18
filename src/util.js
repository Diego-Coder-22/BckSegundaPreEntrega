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
export const CLIENT_SECRET = "d0dea607ef2be3eaf72d246f3b9b45a3316fe0de";
export const CALLBACK_URL = "http://localhost:8080/users/githubcallback";
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const TWILIO_SSID = process.env.TWILIO_SSID;
export const AUTH_TOKEN = process.env.AUTH_TOKEN;
export const PHONE_NUMBER = process.env.PHONE_NUMBER;
export const PHONE_NUMBER_TO = process.env.PHONE_NUMBER_TO;

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

export function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default __dirname;