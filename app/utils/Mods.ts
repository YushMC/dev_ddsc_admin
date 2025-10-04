const all_mods = ref<ModInterface[]>([]);

export const Mods = ()=>{
  const api_url = useRuntimeConfig().public.api_url;
    const recents = ref<ModInterface[]>([]);
    const mod_info = ref<ModInterfaceDetails>({
        id: 0,
        nombre: "",
        descripcion: "",
        duracion: "",
        estado: "",
        personaje: "",
        isNSFW: 0,
        tipo: "",
        slug: "",
        created: "",
        visitas: 0,
        generos: [],
        creadores: [],
        traductores: [],
        capturas: [],
        logo: "",
        portada: "",
        pc: "",
        android: ""
    });

    const fetchAllModsRecents =  async()=>{
      interface api_response{
        results: ModInterface[];
      }
        try{
            const {data, error, execute} =  useFetch<api_response>(`${api_url}/mods/mods-recents`,{
                server: true,
                lazy: false,
                immediate: false,
                key: `info-all-mods-recents-cache`,
                getCachedData: (key) => {
                  const cache = useNuxtApp().payload.data[key];
                  if (!cache) return;
                  const maxAge = 1000 * 60 * 5; // 5 minutos
                  const now = Date.now();
                  if (now - (cache._timestamp || 0) < maxAge) {
                    return cache;
                  }
                }
            })
            await execute();
            if (error.value) throw new Error('Error al obtener mods');
            if(data.value) recents.value= data.value.results;
            return {success: true, message: "Correcto"}
        }catch (eror){
            return {success: false, message: eror}
        }
        
    }

    const fetchModInfo =  async(slug: string)=>{
      interface api_response{
        results: ModInterfaceDetails;
      }
        try{
            const {data, error, execute} = useFetch<api_response>(`${api_url}/mod/${slug}`,{
                server: true,
                lazy: false,
                immediate: false,
            })
            await execute();
            if (error.value) throw new Error('Error al obtener mods');
            if(data.value) mod_info.value= data.value.results;
            return {success: true, message: "Correcto"}
        }catch (eror){
            return {success: false, message: eror}
        }
        
    }

    const fetchModInfoYetMounted =  async(slug: string)=>{
      interface api_response{
        results: ModInterfaceDetails;
      }
        try{
            const response= await  $fetch<api_response>(`${api_url}/mod/${slug}`)
            if(response) mod_info.value= response.results;
            return {success: true, message: "Correcto"}
        }catch (eror){
            return {success: false, message: eror}
        }
        
    }

    const fetchAllMods =  async()=>{
      interface api_response{
        results: ModInterface[];
      }
        try{
            const response = await $fetch<api_response>(`${api_url}/mods`);
            all_mods.value= response.results;
            return {success: true, message: "Correcto"}
        }catch (eror){
            return {success: false, message: eror}
        }
    }

    const fetchCreatorsInfo =  async(creators: creditsInfoInterface[])=>{
        interface api_response{
          response: string;
          total_rows: number;
          results: userInterface;
        }
        const info_users:userInterface[] = [];
        for (const item of creators) {
          if (item.id_user) {
            try {
              const response= await $fetch<api_response>(
                `${api_url}/user/id/${item.id_user}`
              );
              if (response) {
                info_users.push(response.results);
              }
            } catch (error) {
              console.error(error);
            }
          } else {
            info_users.push({
              id: 0,
              nombre: item.nombre,
              nacionalidad: "",
              rol: "",
              slug: "",
              url_logo: "",
            });
          }
        }
        return info_users
    }
    
    return{
        recents,
        all_mods,
        fetchAllModsRecents,
        fetchAllMods,
        mod_info,
        fetchModInfo,
        fetchModInfoYetMounted,
        fetchCreatorsInfo
    }
}