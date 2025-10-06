export const useUserUpdate = () => {
  const api_url = useRuntimeConfig().public.api_url;
  const { token_original } = useAccounts();

  const verifyUser = async (id: number) => {
    try {
      const reponse = await $fetch<{ message: string }>(
        `${api_url}/verify-user/id/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token_original.value,
          },
        }
      );
      return { sucess: true, message: reponse.message };
    } catch (error: any) {
      let msg = "Error desconocido";

      // Si viene como string JSON
      if (typeof error?.data === "string") {
        try {
          const parsed = JSON.parse(error.data);
          msg = parsed.error ?? msg;
        } catch {
          msg = error.data;
        }
      }

      // Si viene ya como objeto
      else if (typeof error?.data === "object" && error?.data?.error) {
        msg = error.data.error;
      }
      return { sucess: false, message: msg };
    }
  };

  const changeEmail = async (id: number, email_user: string) => {
    try {
      const reponse = await $fetch<{ message: string }>(
        `${api_url}/change-user-email/id/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token_original.value,
          },
          body: {
            email: email_user,
          },
        }
      );
      return { sucess: true, message: reponse.message };
    } catch (error: any) {
      let msg = "Error desconocido";

      // Si viene como string JSON
      if (typeof error?.data === "string") {
        try {
          const parsed = JSON.parse(error.data);
          msg = parsed.error ?? msg;
        } catch {
          msg = error.data;
        }
      }

      // Si viene ya como objeto
      else if (typeof error?.data === "object" && error?.data?.error) {
        msg = error.data.error;
      }
      return { sucess: false, message: msg };
    }
  };

  const changeRol = async (id: number, id_rol: number) => {
    try {
      const reponse = await $fetch<{ message: string }>(
        `${api_url}/change-user-rol/id/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token_original.value,
          },
          body: {
            rol: id_rol.toString(),
          },
        }
      );
      return { sucess: true, message: reponse.message };
    } catch (error: any) {
      let msg = "Error desconocido";

      // Si viene como string JSON
      if (typeof error?.data === "string") {
        try {
          const parsed = JSON.parse(error.data);
          msg = parsed.error ?? msg;
        } catch {
          msg = error.data;
        }
      }

      // Si viene ya como objeto
      else if (typeof error?.data === "object" && error?.data?.error) {
        msg = error.data.error;
      }
      return { sucess: false, message: msg };
    }
  };

  const changeVisibility = async (id: number, active: boolean) => {
    try {
      const reponse = await $fetch<{ message: string }>(
        `${api_url}/change-user-visibility/id/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token_original.value,
          },
          body: {
            active: String(Number(active)),
          },
        }
      );
      return { sucess: true, message: reponse.message };
    } catch (error: any) {
      let msg = "Error desconocido";

      // Si viene como string JSON
      if (typeof error?.data === "string") {
        try {
          const parsed = JSON.parse(error.data);
          msg = parsed.error ?? msg;
        } catch {
          msg = error.data;
        }
      }

      // Si viene ya como objeto
      else if (typeof error?.data === "object" && error?.data?.error) {
        msg = error.data.error;
      }
      return { sucess: false, message: msg };
    }
  };

  return {
    changeEmail,
    changeRol,
    verifyUser,
    changeVisibility,
  };
};
