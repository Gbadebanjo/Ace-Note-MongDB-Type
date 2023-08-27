"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../model/user");
/**
 * Middleware function to authenticate user by verifying token.
 * If token is valid, sets the `req.user` property to the decoded user object.
 * If token is invalid or not found, redirects to the homepage or renders an error page.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call in the middleware chain.
 */
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("calling auth middleware");
        const jwtsecret = process.env.JWT_SECRET;
        const token = req.cookies.token;
        if (!token) {
            console.log("No token found. Please sign up or login");
            return res.redirect("/");
        }
        else {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, jwtsecret);
                req.userKey = decodedToken;
                const { id } = req.userKey;
                const userModel = yield getUserById(id);
                // console.log(userModel)
                req.userKey.user = userModel;
                next();
            }
            catch (err) {
                res.status(401).json({ error: err.message });
            }
        }
    });
}
exports.auth = auth;
/**
 * Middleware function to verify the authorization of a user.
 * It checks if the user exists in the database based on the user ID provided in the request token.
 * If the user is found, it sets the `req.user` property to the user object and proceeds to the next middleware.
 * If the user is not found, it returns a 401 Unauthorized response.
 * @param req The request object.
 * @param res The response object.
 * @param next The next middleware function.
 */
// export async function authorization(req: Request, res: Response, next: NextFunction) {
// console.log('Calling authorization middleware');
// try {
//   const { id } = req.userKey;
//   const user = await User.findOne({
//     where: { id },
//     // include: [{ all: true }]
//   });
//   if (!user) {
//     return res.status(401).send('Unauthorized');
//   }
//   const userModel = await getUserById(id);
//   req.userKey.user = userModel?.dataValues;
//   next();
// } catch (error: any) {
//   res.render('error', { error, message: error.message });
// }
//   }
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield user_1.User.findById(id);
        return data;
    });
}
exports.getUserById = getUserById;
