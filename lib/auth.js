import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getAuthUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return null;
        }

        return decoded.userId;
    } catch (error) {
        console.log("Auth error:", error.message);
        return null;
    }
}

export function verifyAuth(userId) {
    if (!userId) {
        return {
            error: true,
            response: Response.json(
                { message: "User not authenticated", success: false },
                { status: 401 }
            ),
        };
    }
    return { error: false };
}
