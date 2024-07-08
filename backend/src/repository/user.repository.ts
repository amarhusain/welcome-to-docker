import { CreateUserDto } from "../dto/user.dto";
import UserModel, { IUserDocument, IUserModel } from "../models/user.model";

// save to db
export class UserRepository {

    constructor(private userModel: IUserModel) {

    }

    async saveUser(user: CreateUserDto) {
        const userModel = new this.userModel(user);
        // const userModel = await new this.userModel(user);
        return await userModel.save();
    }

    async findById(userId: string) {
        return await this.userModel.findById({ _id: userId });
    }

    async findOneByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }

    async findOneByMobile(mobile: string) {
        return await this.userModel.findOne({ mobile });
    }

    async savePwdResetTokenInDb(updatedUser: IUserDocument) {
        return await this.userModel.findByIdAndUpdate(updatedUser._id, updatedUser, { new: true });
    }

    async updateUserPassword(userId: string, newPassword: string) {
        return await this.userModel.findByIdAndUpdate(
            userId,
            { $set: { password: newPassword } },
            { new: true }
        );
    }

    async updateResetNonceStatus(userId: string, status: boolean) {
        return await this.userModel.findByIdAndUpdate(
            userId,
            { $set: { resetNonce: status } },
            { new: true }
        );
    }

    async getAllDoctor() {
        return await this.userModel.find({ role: 'DOCTOR' });
    }

}

export const userRepository = new UserRepository(UserModel);