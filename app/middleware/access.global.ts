export default defineNuxtRouteMiddleware(async (to) => {
  interface api_response {
    success: boolean;
    token_decodificado: TokenDataInterface;
    token: string;
  }
  const { token_data, token_original } = useAccounts();
  if (token_data.value.id !== 0) return;

  const { data } = await useFetch<api_response>("/api/accounts/checkSession", {
    credentials: "include",
  });
  if (!data.value?.success) {
    // Evitar loop si ya estoy en /login
    if (to.path !== "/login") {
      return navigateTo("/login");
    }
    return;
  }

  if (
    data.value.token_decodificado &&
    data.value.token_decodificado.rol !== 4
  ) {
    window.open("http://191.101.251.98");
  }
  token_data.value = data.value.token_decodificado;
  token_original.value = data.value.token;
});
