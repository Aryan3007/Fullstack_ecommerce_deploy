import bcrypt from "bcrypt"

export const hashPassword=async(password)=>{
        try {
            const saltRounds=10
            const hashedPass=await bcrypt.hash(password, 10)
            return hashedPass
        } catch (error) {
            console.log(error)
        }
}


export const comparePassword= async(password, hashedPass)=>{
    return bcrypt.compare(password, hashedPass)
}