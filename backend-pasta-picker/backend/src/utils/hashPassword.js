import { genSaltSync, hashSync } from "bcrypt";

const hashedPassword = (password) => {
    const salt = genSaltSync(10)

    return hashSync(password, salt)
}

export default hashedPassword