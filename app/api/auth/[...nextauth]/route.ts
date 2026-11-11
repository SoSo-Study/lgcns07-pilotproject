import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

// NextAuth가 쓰는 주소들 (/api/auth/signin · /api/auth/session · /api/auth/signout …)
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
