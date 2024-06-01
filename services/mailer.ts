import { SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import config from '../mail';

const nodemailer = require('nodemailer');

export class MailerService {
  async sendMail(mailOptions: Mail.Options): Promise<SentMessageInfo> {
    const transporter = nodemailer.createTransport(config);

    return await transporter.sendMail(mailOptions);
  }
}