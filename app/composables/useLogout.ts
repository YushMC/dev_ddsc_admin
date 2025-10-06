export const useLogout = () => {
  const { token_data } = useAccounts();
  const close = async () => {
    await $fetch("/api/accounts/logout", {
      method: "POST",
      credentials: "include",
    });
    token_data.value = {
      id: 0,
      nombre: "",
      alias: "",
      slug: "",
      rol: 0,
      rol_nombre: "",
      url_logo: "",
      url_banner: "",
      url_fondo: "",
      descripcion: "",
      url_bandera: "",
    };
    navigateTo("/");
  };

  return {
    close,
  };
};
