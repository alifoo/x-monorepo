import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { prisma } from "../src/config/prisma.ts";

const email = process.env.TEST_USER_EMAIL ?? "test-local@example.com";
const password = process.env.TEST_USER_PASSWORD ?? "TestLocal123!";
const name = process.env.TEST_USER_NAME ?? "Test Local";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  },
);

let userId;
const list = await supabase.auth.admin.listUsers({ perPage: 200 });
const existing = list.data.users.find((user) => user.email === email);

if (existing) {
  userId = existing.id;
  await supabase.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
    user_metadata: { name },
  });
} else {
  const created = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (created.error) throw created.error;
  userId = created.data.user.id;
}

await prisma.user.upsert({
  where: { id: userId },
  update: { name, email, deletedAt: null },
  create: { id: userId, name, email },
});

const role = await prisma.role.findUnique({
  where: { name: "healthcare_professional" },
});
if (role) {
  const link = await prisma.userRole.findFirst({
    where: { userId, roleId: role.id },
  });
  if (!link) {
    await prisma.userRole.create({ data: { userId, roleId: role.id } });
  }
}

console.log("Usuário de teste pronto:");
console.log(`  email: ${email}`);
console.log(`  senha: ${password}`);
await prisma.$disconnect();
