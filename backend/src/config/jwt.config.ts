import jwt, { verify } from "jsonwebtoken"
import "dotenv/config"

const jwtSceret = process.env.JWT_VERIFY_TOKEN as string
const Expiry = '1d'

if(!jwtSceret){
    throw new Error("JWT_SECRET is not defined");
}

export type jwtPayload = {
    userId : string
}

const jwtConfig = {
    sigin(payload : jwtPayload) : string{
        return  jwt.sign(payload,jwtSceret,{expiresIn : Expiry})
    },
    verify(token:string) : jwtPayload{
        return jwt.verify(token,jwtSceret) as jwtPayload
    }
}


export {jwtConfig}
