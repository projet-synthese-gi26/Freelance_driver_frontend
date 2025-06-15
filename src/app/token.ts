import jwt from 'jsonwebtoken'

const secretKet='$2a$10$yJaUh3SPPgJ4WX2WfhQ3QucGzj4rlj/bCR5TqdkgOiF2kAcTdSyIa'

export interface UserPayload{
    id:string;
    email:string;
}

export function generateToken(user_id:UserPayload){
    return jwt.sign(user_id,secretKet)
}

export function verifyToken(token:string):UserPayload | null{
    try {
        return jwt.verify(token,secretKet) as UserPayload
    } catch (error) {
        return null
    }
}