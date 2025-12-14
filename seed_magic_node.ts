import { db } from "./src/lib/db";

async function main() {
    const userId = "cmj664c460000giquv22tnbu7";

    // Create a Note with I2A content
    const node = await db.fluxNode.create({
        data: {
            title: "Magic Note",
            content: "- [ ] Buy Groceries\n- [ ] Schedule Dentist",
            type: "note",
            position: JSON.stringify({ x: 300, y: 200 }),
            userId: userId
        }
    });

    console.log("Created Magic Node:", node.id);
}

main();
