// import { AppDataSource } from "../data-source";
// import { User } from "../entity/User.entity";
// import { encrypt } from "../helpers/helper";
// import * as cache from "memory-cache";

// export class UserService {
//   private static userRepository = AppDataSource.getRepository(User);

//   static async createUser(
//     name: string,
//     email: string,
//     password: string,
//     role: string,
//   ) {
//     const encryptedPassword = await encrypt.encryptpass(password);

//     const user = new User();
//     user.name = name;
//     user.email = email;
//     user.password = encryptedPassword;
//     user.role = role;

//     const savedUser = await this.userRepository.save(user);
//     const token = encrypt.generateToken({ id: savedUser.id });

//     return { user: savedUser, token };
//   }

//   static async getAllUsers() {
//     const cachedData = cache.get("data");
//     if (cachedData) {
//       return { data: cachedData, source: "cache" };
//     }

//     const users = await this.userRepository.find();
//     cache.put("data", users, 6000);
//     return { data: users, source: "database" };
//   }

//   static async updateUser(id: string, name: string, email: string) {
//     const user = await this.userRepository.findOne({ where: { id } });
//     if (!user) throw new Error("User not found");

//     user.name = name;
//     user.email = email;

//     return this.userRepository.save(user);
//   }

//   static async deleteUser(id: string) {
//     const user = await this.userRepository.findOne({ where: { id } });
//     if (!user) throw new Error("User not found");

//     await this.userRepository.remove(user);
//     return { message: "User deleted successfully" };
//   }
// }
