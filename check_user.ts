import { db } from "./src/lib/db";

async function main() {
    const user = await db.user.findFirst();
    if (user) {
        console.log("USER_ID:", user.id);
    } else {
        // Create one
        const newUser = await db.user.create({
            data: {
                name: "Test User",
                email: "test@example.com",
                image: "https://github.com/shadcn.png"
            }
        });
        console.log("CREATED_USER_ID:", newUser.id);
    }
}

main();
