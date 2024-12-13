import { DBInstance } from "../utils/startDB";

export interface newUserType {
    password: string;
    passwordConfirm: string;
    email: string;
    emailVisibility: boolean;
    verified: boolean;
    username: string;
    full_name: string;
    specialization: string;
    contact_number: number;
    role: string;
}


export const CreateUser = async(user: newUserType) => {
    try{
        const createdUser = await DBInstance.collection("User").create(user)
        return {message:"OK", createdUser}
    }catch (error){
        return {message:"error", error}
    }
}