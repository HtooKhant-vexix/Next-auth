import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const userSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().min(1, "Email cannot be empty.").email("Invalid Email"),
  password: z
    .string()
    .min(1, "Password cannot be empty.")
    .min(8, "Password should have minimum 8 characters."),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  const data = await db.user.findMany();
  return NextResponse.json({
    success: true,
    data: data,
    authenticated: !!session,
  });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { username, email, password } = userSchema.parse(data);

    const exitingEmail = await db.user.findUnique({ where: { email: email } });
    if (exitingEmail) {
      return NextResponse.json(
        { user: null, message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPswd = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPswd,
      },
    });

    const { password: newUserPswd, ...rest } = newUser;

    return NextResponse.json(
      {
        user: rest,
        message: "New User Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in post request");
  }
}
