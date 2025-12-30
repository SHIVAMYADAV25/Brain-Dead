import bcrypt from "bcrypt"

const SALT_ROUNDS:number = 10;

const bcryptConfig = {
    async hash(password : string): Promise<string>{
        return bcrypt.hash(password,SALT_ROUNDS)
    },
    async compare(plainPassword : string,hashedPassword  : string):Promise<Boolean>{
        return bcrypt.compare(plainPassword,hashedPassword)
    }
}

export {bcryptConfig}