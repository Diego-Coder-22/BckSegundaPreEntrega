import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "jsonwebtoken";
import User from "../dao/Models/user.model.js";
import bcrypt from "bcrypt";
import config from "./config.js";
import { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } from "../util.js"; 

const initializePassport = () => {
    // Configurar estrategia de autenticación local
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                callbackURL: CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);//obtenemos el objeto del perfil
                    //buscamos en la db el email
                    const user = await User.findOne({
                        email: profile._json.email,
                    });
                    //si no existe lo creamos
                    if (!user) {
                        //contruimos el objeto según el modelo (los datos no pertenecientes al modelo lo seteamos por default)
                        const newUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            age: 37,
                            email: profile._json.email,
                            password: "",
                        };
                        //guardamos el usuario en la database
                        let createdUser = await User.create(newUser);
                        done(null, createdUser);
                    } else {
                        done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Serializar y deserializar usuario para guardar en sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

// Función para extraer cookies
export const cookieExtractor = (req) => {
    let token = null;
    
    if (req && req.cookies) {
        token = req.cookies["jwtToken"];
    }
    
    return token;
};

// Funcion para generar tokens
export const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    return token;
};

// Funcion para validar tokens
export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.jwtToken;

    // Verificar si el token está presente en el encabezado de autorización o en la cookie jwtToken
    const token = authHeader ? authHeader.split(" ")[1] : cookieToken;

    if (!token) {
        return res.status(401).send({ status: "error", message: "No autorizado" });
    }

    jwt.verify(token, config.jwtSecret, (error, credentials) => {
        if (error) {
            console.error('JWT Verification Error:', error);
            return res.status(401).send({ status: "error", message: "Unauthorized" });
        }

        req.user = credentials.user;
        next();
    });
};


const auth = {
    initializePassport,
};

export default auth;