import transporter from "@/lib/nodemailer";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  transporter.sendMail({
    from: process.env.SENDER_EMAIL,
  });
}
