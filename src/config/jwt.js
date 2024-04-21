import passport from "passport";
import passportJWT from "passport-jwt";
import config from "./config.js";

const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const configurePassport = () => {
    const jwtOptions = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret,
    };

    const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
        try {
            if (jwt_payload) {
                return next(null, jwt_payload);
            } else {
                return next(null, false);
            }
        } catch (error) {
            console.error('Error en el middleware de Passport JWT:', error);
            return next(error, false);
        }
    });

    // Agregar la estrategia JWT a Passport
    passport.use(strategy);

    // Inicializar Passport
    passport.initialize();
};

export default configurePassport;