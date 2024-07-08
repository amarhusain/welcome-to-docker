
import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";
import moment from "moment";
import { config } from "../common/config";
import { InternalServerError } from "../common/errors/internal-server-error";
import { MailDto, RecipientAddress } from "../common/global";
import { CONTACT, months } from "../utils/constants";

export class EmailService {

    connectionString = config.emailConnStr;

    constructor() {

    }

    // Send a password reset email
    sendPasswordResetEmail = async (senderAddress: string, recipientsAddress: RecipientAddress[], token: string) => {
        // const senderAddress = "contact@shivamhomeocare.com"
        // const recipientAddress = email;

        const url = config.appDomain + "/reset-password/" + token;

        const POLLER_WAIT_TIME = 10

        const message = {
            senderAddress: senderAddress,
            recipients: {
                to: recipientsAddress,
            },
            content: {
                subject: "Password Reset Email",
                plainText: "Password Reset Email",
                html: `<html>
                    <p> Dear Recipient,</p>
                    <p>We have received your request for reset password of Shivam Homeo Care account associated with this email address.</p>
                    <p>Click the link below to reset your password using our secure server:</p>
                    <br>
                    <p>
                        <a style="text-decoration: none;background-color: #E12454;color: white;padding: 12px 80px;border-radius: 20px;font-size: 16px;cursor: pointer;" href="${url}">Change my password</a>
                    </p>
                    <br>
                    <p>If clicking the link doesn't work, you can copy and paste the link into your web browser's address bar.
                     You will be able to create a new password for your Shivam Homeo Care account after clicking the link above. </p>
                    <p>If you did not request to have your password reset, you can safely ignore this email.
                        Rest assured your Shivam Homeo Care account is safe.</p> 

                    <p>Shivam Homeo Care will never email you and ask you to disclose or verify your password, credit card, or banking account number.
                    If you receive a suspicious email with a link to update your account information, do not click on the link.
                    Instead, report the e-mail to Shivam Homeo Care for investigation.</p>

                    <p>For help and support, visit the Shivam Homeo Care Support Center at  <a href= "https://shivamhomeocare.com/contact"> https://shivamhomeocare.com/contact </a></p>

                    <p>Thank you for visiting Shivam Homeo Care.</p>

                    <p>Sincerely, <br> The Shivam Homeo Care Team</p>
                    <html>`
            },
        }
        // const resetLink = `http://your-frontend-app/reset-password/${token}`;

        // const mailOptions = {
        //     from: 'your-email@example.com',
        //     to: email,
        //     subject: 'Password Reset',
        //     text: `Click on the following link to reset your password: ${resetLink}`,
        // };

        try {
            const client = new EmailClient(this.connectionString);

            const poller = await client.beginSend(message);

            if (!poller.getOperationState().isStarted) {
                return new InternalServerError("Poller was not started.");
            }

            let timeElapsed = 0;
            while (!poller.isDone()) {
                poller.poll();
                console.log("Email send polling in progress");

                await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
                timeElapsed += 10;

                if (timeElapsed > 18 * POLLER_WAIT_TIME) {
                    return new InternalServerError("Polling timed out.");
                }
            }

            if (poller.getResult()?.status === KnownEmailSendStatus.Succeeded) {
                console.log(`Successfully sent the email (operation id: ${poller.getResult()?.id})`);
                return true;
            }
            else {
                console.log(poller.getResult()?.error)
                return new InternalServerError('poller.getResult()?.error');

            }
        }
        catch (ex) {
            console.error(ex);
            return new InternalServerError('internal error');
        }


    };

    // Send a password reset email
    sendAppointmentConfirmationEmail = async (mailDto: MailDto, appointmentDate: Date) => {

        // <a style="text-decoration: none;background-color: #E12454;color: white;padding: 12px 80px;border-radius: 20px;font-size: 16px;cursor: pointer;" href = "${url}" > Change my password < /a>
        // <p>- <b>Date: ${ appointmentDate.getDate() + " " + months[appointmentDate.getMonth()] + " " + appointmentDate.getFullYear() } </b></p >
        //     <p>- <b>Time: ${ moment(appointmentDate).format('LT') } </b></p >
        //         <p>- <b>Time: ${ moment(new Date(appointmentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))).format('LT') } </b> </p >
        //             <p>- <b>Location: ${ CONTACT.ADDRESS } </b></p >

        const POLLER_WAIT_TIME = 10

        const message = {
            senderAddress: mailDto.senderAddress,
            recipients: {
                to: mailDto.recipientsAddress,
            },
            content: {
                subject: "Appointment Confirmation - Shivam Homeo Care",
                plainText: "Appointment Confirmation",
                html: `<html>
                    <p> <b>Dear ${mailDto.receipientName}</b>,</p>
                    <p>We hope this email finds you well. We would like to confirm your upcoming appointment with <b> Shivam Homeocare & Reasearch Center</b>.</p>
        
                    <p>Appointment Details:</p>
                    <p> - <b> Date: ${appointmentDate.getDate() + " " + months[appointmentDate.getMonth()] + " " + appointmentDate.getFullYear()}</b></p>
                    <p> - <b>Time: ${moment(new Date(appointmentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))).format('LT')}</b> </p>
                    <p> - <b>Location: ${CONTACT.ADDRESS} </b></p>
                    
                    <p>
                        If you have any specific requirements or need to reschedule, please let us know at least 24 hours in advance. We value your time and want to ensure that the appointment is convenient for you.
                    </p>
                    
                    <p>Should you have any questions or require further assistance, feel free to contact us at ${CONTACT.HOSPITAL_NUMBER}. </p>

                    <p>Thank you for choosing Shivam Homeocare & Research Center. We look forward to meeting with you.</p> 

                    <p>For help and support, visit the Shivam Homeocare Support Center at  <a href= "https://shivamhomeocare.com/contact"> https://shivamhomeocare.com </a></p>

                    <p>Thank you for visiting Shivam Homeocare.</p>

                    <p><b>Best regards</b>, </p>

                    <p>Dr. Arvind Srivastava</p>
                    <p>Shivam Homeocare Team</p>
                    <p>Contact Number : ${CONTACT.PHONE_HOSPITAL_1}</p>
                    <html>`
            },
        }

        try {
            const client = new EmailClient(this.connectionString);

            const poller = await client.beginSend(message);

            if (!poller.getOperationState().isStarted) {
                return new InternalServerError("Poller was not started.");
            }

            let timeElapsed = 0;
            while (!poller.isDone()) {
                poller.poll();
                console.log("Email send polling in progress");

                await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
                timeElapsed += 10;

                if (timeElapsed > 18 * POLLER_WAIT_TIME) {
                    return new InternalServerError("Polling timed out.");
                }
            }

            if (poller.getResult()?.status === KnownEmailSendStatus.Succeeded) {
                console.log(`Successfully sent the email (operation id: ${poller.getResult()?.id})`);
                return true;
            }
            else {
                console.log(poller.getResult()?.error)
                return new InternalServerError('poller.getResult()?.error');

            }
        }
        catch (ex) {
            console.error(ex);
            return new InternalServerError('internal error');
        }


    };

}

export const emailService = new EmailService();
