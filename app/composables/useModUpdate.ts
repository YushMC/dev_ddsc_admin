interface creators {
  id: number;
  id_user?: number;
  nombre?: string;
}
interface categoria {
  id: number;
  slug: string;
  categoria: string;
  active: boolean;
}

interface response {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: string;
  estado: string;
  personaje: string;
  isNSFW: boolean;
  tipo: string;
  slug: string;
  created: string;
  visitas: number;
  isPublic: boolean;
  generos: string[];
  logo: string;
  portada: string;
  capturas: string[];
  pc?: string;
  android?: string;
  creadores: creators[];
  traductores?: creators[];
  categorias: categoria[];
}

interface reponse {
  id: number;
  categoria: string;
  slug: string;
  active: number;
  created: string;
}

export const useModUpdate = () => {
  const api_url = useRuntimeConfig().public.api_url;
  const { fetchAllUsers, token_original } = useAccounts();
  const { fetchOptions } = OptionsMods();
  const data_mod = ref<response>({
    id: 0,
    nombre: "",
    descripcion: "",
    duracion: "",
    estado: "",
    personaje: "",
    isNSFW: false,
    tipo: "",
    slug: "",
    created: "",
    visitas: 0,
    isPublic: false,
    generos: [],
    logo: "",
    portada: "",
    capturas: [],
    pc: "",
    android: "",
    creadores: [],
    categorias: [],
  });

  const optionsForSelects = ref<any>({
    people: [],
    durations: [],
    focus: [],
    status: [],
    generes: [],
    sagas: [],
    tiposagas: [],
    categorias: [],
  });

  const all_data_options = ref<stringsOptionsAll>({
    generes: [],
    focus: [],
    status: [],
    types: [],
    durations: [],
    sagas: [],
    tiposagas: [],
  });

  const fetchMod = async (slug: string) => {
    try {
      const reponse = await $fetch<{ results: response }>(
        `${api_url}/mod/admin/${slug}`
      );
      data_mod.value = reponse.results;
    } catch (error) {}
  };

  const setConfigs = async () => {
    try {
      const response2 = await fetchAllUsers();
      if (response2) {
        response2.forEach((item) => {
          optionsForSelects.value.people.push({
            label: item.nombre,
            id: item.id,
          });
        });
      }
      const response = await fetchOptions();
      if (response) {
        all_data_options.value = response;
        response.durations.forEach((item) => {
          optionsForSelects.value.durations.push({
            label: item.duracion,
            id: item.id,
          });
        });
        response.focus.forEach((item) => {
          optionsForSelects.value.focus.push({
            label: item.enfoque,
            id: item.id,
          });
        });
        response.status.forEach((item) => {
          optionsForSelects.value.status.push({
            label: item.estado,
            id: item.id,
          });
        });
        response.generes.forEach((item) => {
          optionsForSelects.value.generes.push({
            label: item.genero,
            id: item.id,
          });
        });
        response.sagas.forEach((item) => {
          optionsForSelects.value.sagas.push({
            label: item.titulo,
            id: item.id,
          });
        });
        response.tiposagas.forEach((item) => {
          optionsForSelects.value.tiposagas.push({
            label: item.tipo,
            id: item.id,
          });
        });
      }

      const response3 = await $fetch<{
        response: string;
        totoal_rows: number;
        results: reponse[];
      }>(`${api_url}/categories-mod`);
      if (response3) {
        response3.results.forEach((item) => {
          optionsForSelects.value.categorias.push({
            label: item.categoria,
            id: item.id,
          });
        });
      }
    } catch (error) {}
  };

  const updatePutAlls = async (type: number, data: any, id: number) => {
    let key = "";
    let end_point = "";
    switch (type) {
      case 1:
        key = "descripcion";
        end_point = "description";
        break;
      case 2:
        key = "estado";
        end_point = "state";
        break;
      case 3:
        key = "link_pc";
        end_point = "link-pc";
        break;
      case 4:
        key = "link_android";
        end_point = "link-android";
        break;
      case 5:
        key = "NSFW";
        end_point = "nsfw";
        break;
      case 6:
        key = "enfoque";
        end_point = "focus";
        break;
      case 7:
        key = "duracion";
        end_point = "duration";
        break;
      case 8:
        key = "active";
        end_point = "active";
        break;
    }
    try {
      const reponse = await $fetch<{ message: string }>(
        `${api_url}/mod/${id}/change-${end_point}`,
        {
          method: "PUT",
          headers: {
            Authorization: token_original.value,
            "Content-Type": "application/json",
          },
          body: {
            [key]: data,
          },
        }
      );
      end_point = "";
      key = "";
      return { sucess: true, message: reponse.message };
    } catch (error: any) {
      end_point = "";
      key = "";
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

  const updateCategories = async (categorias: number[]) => {
    try {
      const reponse = await $fetch<{ message: string }>(
        `${api_url}/add-mod-category`,
        {
          method: "POST",
          headers: {
            Authorization: token_original.value,
            "Content-Type": "application/json",
          },
          body: {
            id: data_mod.value.id,
            categorias: categorias,
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

  const updateImages = async (type: number, data: File, id: number) => {
    let end_point = "";
    switch (type) {
      case 1:
        end_point = "logo";
        break;
      case 2:
        end_point = "front-page";
        break;
    }
    try {
      const formData = new FormData();
      formData.append("file", data);
      const reponse = await $fetch<{ message: string }>(
        `${api_url}/mod/${id}/update-${end_point}`,
        {
          method: "POST",
          headers: {
            Authorization: token_original.value,
          },
          body: formData,
        }
      );
      end_point = "";
      return { sucess: true, message: reponse.message };
    } catch (error: any) {
      end_point = "";
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

  const updateCapturas = async (data: File[], id: number) => {
    try {
      const formData = new FormData();
      data.forEach((file: File) => {
        formData.append("capturas[]", file); // ← con corchetes, PHP ya lo entiende como array
      });
      const reponse = await $fetch<{ message: string }>(
        `${api_url}/mod/${id}/update-screens-page`,
        {
          method: "POST",
          headers: {
            Authorization: token_original.value,
          },
          body: formData,
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

  const addSaga = async (id: number, data: any) => {
    try {
      const reponse = await $fetch<{ message: string }>(
        `${api_url}/add-mod-saga`,
        {
          method: "POST",
          headers: {
            Authorization: token_original.value,
          },
          body: {
            id_mod: id,
            id_saga: data.saga,
            id_tipo: data.tipo_saga,
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
    data_mod,
    fetchMod,
    setConfigs,
    optionsForSelects,
    all_data_options,
    updatePutAlls,
    updateCategories,
    updateImages,
    updateCapturas,
    addSaga,
  };
};
