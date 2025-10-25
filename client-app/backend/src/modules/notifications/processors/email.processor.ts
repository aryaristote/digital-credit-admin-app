import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailJob {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  @Process('send')
  async handleSendEmail(job: Job<EmailJob>) {
    this.logger.log(`Processing email job ${job.id} to ${job.data.to}`);

    try {
      const result = await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM', 'noreply@digitalcredit.com'),
        to: job.data.to,
        subject: job.data.subject,
        text: job.data.text,
        html: job.data.html,
      });

      this.logger.log(`Email sent successfully: ${result.messageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('welcome')
  async handleWelcomeEmail(job: Job<{ email: string; firstName: string }>) {
    this.logger.log(`Sending welcome email to ${job.data.email}`);

    const html = `
      <h1>Welcome to Digital Credit & Savings Platform!</h1>
      <p>Hello ${job.data.firstName},</p>
      <p>Thank you for registering with us. We're excited to have you on board!</p>
      <p>You can now:</p>
      <ul>
        <li>Create a savings account and start saving</li>
        <li>Apply for credit with competitive interest rates</li>
        <li>Manage your finances easily through our platform</li>
      </ul>
      <p>Best regards,<br>Digital Credit & Savings Team</p>
    `;

    const emailData: EmailJob = {
      to: job.data.email,
      subject: 'Welcome to Digital Credit & Savings Platform',
      html,
    };

    return this.sendEmailDirectly(emailData);
  }

  @Process('credit-approved')
  async handleCreditApprovalEmail(
    job: Job<{ email: string; firstName: string; amount: number }>,
  ) {
    this.logger.log(`Sending credit approval email to ${job.data.email}`);

    const html = `
      <h1>Your Credit Request Has Been Approved!</h1>
      <p>Hello ${job.data.firstName},</p>
      <p>Great news! Your credit request has been approved.</p>
      <p><strong>Approved Amount:</strong> $${job.data.amount.toFixed(2)}</p>
      <p>The funds have been made available to your account.</p>
      <p>Best regards,<br>Digital Credit & Savings Team</p>
    `;

    const emailData: EmailJob = {
      to: job.data.email,
      subject: 'Credit Request Approved',
      html,
    };

    return this.sendEmailDirectly(emailData);
  }

  @Process('credit-rejected')
  async handleCreditRejectionEmail(
    job: Job<{ email: string; firstName: string; reason: string }>,
  ) {
    this.logger.log(`Sending credit rejection email to ${job.data.email}`);

    const html = `
      <h1>Credit Request Update</h1>
      <p>Hello ${job.data.firstName},</p>
      <p>Unfortunately, we are unable to approve your credit request at this time.</p>
      <p><strong>Reason:</strong> ${job.data.reason}</p>
      <p>You can improve your credit score and reapply in the future.</p>
      <p>Best regards,<br>Digital Credit & Savings Team</p>
    `;

    const emailData: EmailJob = {
      to: job.data.email,
      subject: 'Credit Request Update',
      html,
    };

    return this.sendEmailDirectly(emailData);
  }

  private async sendEmailDirectly(emailData: EmailJob) {
    this.logger.log(`Sending email to ${emailData.to}`);

    try {
      const result = await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM', 'noreply@digitalcredit.com'),
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      });

      this.logger.log(`Email sent successfully: ${result.messageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }
}
