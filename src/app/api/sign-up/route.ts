import dbConnect from "@/lib/dbConnect";
import transporter from "@/lib/nodemailer";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();
    const existingdUserVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingdUserVerifiedUsername) {
      return Response.json(
        { success: false, message: "username taken aleady" },
        { status: 400 }
      );
    }

    const existingUserByMail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByMail) {
      if (existingUserByMail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already registered with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByMail.password = hashedPassword;
        existingUserByMail.verifyCode = verifyCode;
        existingUserByMail.verifyCodeExrire = new Date(Date.now() + 3600000);
        await existingUserByMail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expireDate = new Date();
      expireDate.setHours(expireDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExrire: expireDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "email verification code",
        text: `here is the otp ${verifyCode} for email verification`,
      };
      const emailResponse = await transporter.sendMail(mailOptions);
      if (!emailResponse.accepted) {
        return Response.json(
          {
            success: false,
            message: emailResponse.messageId,
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "user registered succesfully please verify you email",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("error registering user ", error);
    return Response.json(
      { success: false, message: "error registering user" },
      { status: 500 }
    );
  }
}
