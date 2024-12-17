import { DBInstance } from "../utils/startDB";
import { type newUserType } from "../types/userTypes";

export const CreateUser = async (user: newUserType) => {
    // Check if the password and passwordConfirm match
    if (user.password !== user.passwordConfirm) {
        return { message: "error", error: "Password and confirm password do not match." };
    }

    try {
        const existingEmail = await DBInstance.collection("User").getList(1, 1, {
            filter: `email = "${user.email}"`
        });
        if (existingEmail.items.length > 0) {
            return { message: "error", error: "Email already exists." };
        }

        const existingUsername = await DBInstance.collection("User").getList(1, 1, {
            filter: `username = "${user.username}"`
        });
        if (existingUsername.items.length > 0) {
            return { message: "error", error: "Username already exists." };
        }

        const existingPhoneNumber = await DBInstance.collection("User").getList(1, 1, {
            filter: `contact_number = ${user.contact_number}`
        });
        if (existingPhoneNumber.items.length > 0) {
            return { message: "error", error: "Phone number already exists." };
        }

        // If no conflicts, create the user
        const createdUser = await DBInstance.collection("User").create(user);
        return { message: "OK", createdUser };

    } catch (error) {
        return { message: "error", error: error || "An unexpected error occurred" };
    }
};
