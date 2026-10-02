import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false, // true for 465, false for other ports

//   auth: {
//     user: process.env.EMAIL_USER, // generated ethereal user
//     pass: process.env.EMAIL_PASS, // generated ethereal password
//   },
//   pool: true,
//   maxConnections: 3,
//   maxMessages: 100,
// });

// export const sendReportEmail = async ({ to, subject, text, attatchment }) => {
//   const info = await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//     attatchments: [
//       {
//         filename: attatchment.filename,
//         path: attatchment,
//       },
//     ],
//   });
//   console.log(`Email sent to ${to}: ${info.messageId}`);
// };
console.log("EMAIL CONFIG:", {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  user: process.env.EMAIL_USER,
});
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 60000,

  pool: true,
  maxConnections: 3,
  maxMessages: 100,
});

export const sendReportEmail = async ({ to, subject, text, attachment }) => {
  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    cc: "vaibhav.randale@taypro.in",
    subject,
    text,

    attachments: [
      {
        filename: "report.pdf",
        path: attachment,
      },
    ],
  });

  console.log("Email sent:", info.messageId);

  return info;
};
