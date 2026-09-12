// Emails listed here automatically get the "admin" role on signup.
// Admins are the only accounts allowed to create ("sell") tickets;
// everyone else is a regular client who can only buy tickets and see
// their own orders. To make someone else an admin later, just add
// their email here and redeploy the auth service.
export const ADMIN_EMAILS: string[] = ["azizbenayed179@gmail.com"];

export const isAdminEmail = (email: string): boolean =>
  ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(
    String(email || "").toLowerCase()
  );
