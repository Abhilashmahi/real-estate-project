"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    const users = await db_1.default.user.findMany();
    if (users.length === 0) {
        const hashedPassword = await bcryptjs_1.default.hash('password', 10);
        await db_1.default.user.create({
            data: {
                email: 'admin@example.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'admin'
            }
        });
        console.log('Seeded default admin user: admin@example.com / password');
    }
    else {
        console.log('Database already has users:', users.map(u => u.email));
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await db_1.default.$disconnect();
});
