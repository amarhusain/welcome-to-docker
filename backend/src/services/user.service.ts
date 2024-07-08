import { config } from "../common/config";
import { ConflictError } from "../common/errors/conflict-error";
import { InternalServerError } from '../common/errors/internal-server-error';
import { NotAuthorizedError } from "../common/errors/not-authorized-error";
import { RecordNotFoundError } from "../common/errors/record-not-found-error";
import { AuthUserDto, CreateUserDto } from "../dto/user.dto";
import { UserRepository, userRepository } from "../repository/user.repository";
import { AuthService, authService } from "./auth.service";
import { EmailService, emailService } from './email.service';

// Business Logic
export class UserService {

    constructor(private userRepository: UserRepository,
        private authService: AuthService,
        private emailService: EmailService) {

    }

    async createUser(user: CreateUserDto) {
        const existingMail = await userRepository.findOneByEmail(user.email);
        // Email already exists, return 409 Conflict status code
        if (existingMail) return new ConflictError('Email id already used');
        console.log('existing email', existingMail)
        const existingMobile = await userRepository.findOneByMobile(user.mobile);
        // Mobile already exists, return 409 Conflict status code
        if (existingMobile) return new ConflictError('Mobile number already used');
        console.log('existing mobile', existingMobile)

        user.password = await this.authService.pwdToHash(user.password);
        console.log('pwd hashed')

        const newUser = await this.userRepository.saveUser(user);
        if (!newUser) return new InternalServerError(`Internal server error, userService-line36: ${newUser}`);

        console.log('user saved')

        const token = await this.authService.generateJwt({ email: newUser.email, userId: newUser._id }, config.jwtKey, config.jwtExpiresIn);
        if (!newUser) return new InternalServerError(`Internal server error, userService-line40: ${token}`);
        console.log('token genrated')

        return { token, id: newUser._id, name: newUser.name, email: newUser.email, mobile: newUser.mobile, role: newUser.role };

    }

    async authenticateUser(authUserDto: AuthUserDto) {
        let userFound = await this.userRepository.findOneByEmail(authUserDto.emailOrUsername);
        if (!userFound) return new NotAuthorizedError(`Invalid credentials`)
        // if (!userFound) {
        //     userFound = await this.userRepository.findOneByUsername(authUserDto.emailOrUsername);
        //     if (!userFound) return new RecordNotFoundError(`User ${authUserDto.emailOrUsername} not found`)
        // }

        const samePwd = await this.authService.pwdCompare(userFound.password, authUserDto.password);
        if (!samePwd) return new NotAuthorizedError(`Invalid credentials`);

        const token = await this.authService.generateJwt({ email: userFound.email, userId: userFound.id }, config.jwtKey, config.jwtExpiresIn);

        return { token, id: userFound._id, name: userFound.name, email: userFound.email, mobile: userFound.mobile, role: userFound.role };
    }


    async sendPasswordResetMailRequest(email: string) {
        const user = await this.userRepository.findOneByEmail(email);
        if (!user) return new RecordNotFoundError('User not found, userService-line58');

        // Generate a reset token
        // const token = this.generateResetToken();
        const expiresIn = Date.now() + 3600000; // Token expires in 1 hour (adjust as needed)
        const token = await this.authService.generateJwt({ email, userId: user._id }, config.jwtKey, expiresIn.toString());
        const recipientsAddress = [{ address: email }];
        const senderAddress = "DoNotReply@shivamhomeocare.com";
        const emailSent = await this.emailService.sendPasswordResetEmail(senderAddress, recipientsAddress, token);
        if (!emailSent) return new RecordNotFoundError('Internal server error, userService-line68');

        // Update the resetNonce status - used to check password reset link has been used or not
        const updatedUser = await this.userRepository.updateResetNonceStatus(user._id, true);
        if (!updatedUser) return new InternalServerError('Internal server error, userService-line67');


        return { msg: "email sent successfully" };
    }


    async resetPassword(newPassword: string, token: string) {

        try {
            // Verify the token
            const payload = await this.authService.verifyJwt(token, config.jwtKey);

            // Check if the token has expired
            if (Date.now() >= payload.exp * 1000) {
                return new InternalServerError('Password reset link has expired');
            }
            // Find user by email (replace this with your database query)
            const user = await this.userRepository.findOneByEmail(payload.email);
            if (!user) return new RecordNotFoundError('User not found, userService-line87');

            // Check if the token has used
            if (!user.resetNonce) {
                return new InternalServerError('Password reset link has expired');
            }

            // Hash the new password and update the user's password in the database
            const hashedPassword = await this.authService.pwdToHash(newPassword);

            // Update the user's new password
            const result = await this.userRepository.updateUserPassword(user._id, hashedPassword);
            if (!result) return new RecordNotFoundError('Internal server error, userService-line87');

            // Update the resetNonce status - used to check password reset link has been used or not
            const updatedUser = await this.userRepository.updateResetNonceStatus(user._id, false);
            if (!updatedUser) return new InternalServerError('Internal server error, userService-line67');

            return { message: 'Password reset successfully' };
        } catch (error) {
            return new InternalServerError('Invalid or expired token');
        }
    }

    async findUserById(userId: string) {
        return await this.userRepository.findById(userId);
    }

    async findUserByEmail(email: string) {
        const result = await this.userRepository.findOneByEmail(email);
        if (!result) return new RecordNotFoundError('User not found!');
        return result;
    }


    async getDoctorList() {
        const doctorList = await this.userRepository.getAllDoctor();
        if (!doctorList) return new InternalServerError("Internal server error, userService-line130");
        return doctorList;
    }

}

export const userService = new UserService(userRepository, authService, emailService);