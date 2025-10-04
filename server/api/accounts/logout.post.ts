export default defineEventHandler((event) => {
  deleteCookie(event, "auth_token", {
    path: "/", // asegúrate de usar el mismo path que al setearla
  });

  return { success: true };
});