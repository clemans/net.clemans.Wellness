import dotenv from "dotenv";
dotenv.config({ path: ".env_app" });

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.SES_REGION });

export async function sendEmail(to: string, subject: string, text: string) {
    const cmd = new SendEmailCommand({
        Source: process.env.EMAIL_FROM!,
        Destination: { ToAddresses: [to] },
        Message: {
            Subject: { Data: subject },
            Body: { Text: { Data: text } }
        }
    });
    await ses.send(cmd);
}