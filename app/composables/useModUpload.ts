export const useModUpload = ()=>{
   
    const api_url = useRuntimeConfig().public.api_url;
    const {token_original, fetchAllUsers} = useAccounts();
    const {fetchOptions} = OptionsMods();

    const sendMod= async(mod_info: ModInterfaceToUpload)=>{
      try{
        const formData = new FormData();

        if(mod_info.id_saga!==0 && mod_info.id_tipo_saga !== 0 ){
          formData.append("id_saga", String(mod_info.id_saga));
          formData.append("tipo_en_saga", String(mod_info.id_tipo_saga));
        }

        formData.append("name", mod_info.nombre);
        formData.append("descripcion", mod_info.descripcion?.slice(0, 1000) ?? "Sin Descripción");
        formData.append("duracion", String(mod_info.duracion));
        formData.append("estado", String(mod_info.estado));
        formData.append("personaje", String(mod_info.personaje));
        formData.append("nsfw", String(mod_info.isNSFW));
        formData.append("tipo",String(mod_info.tipo));  

        // Generos (array de objetos) → lo pasamos como JSON

        formData.append("generos", JSON.stringify(mod_info.generos));    

        formData.append("slug", mod_info.slug ?? '');
        formData.append("creador",  JSON.stringify(mod_info.creadores));
        formData.append("pc", mod_info.pc ?? "");
        formData.append("android", mod_info.android ?? ""); 

        // Si hay traductor(es)
        if (mod_info.tipo===1) {
          formData.append("traductor", JSON.stringify(mod_info.traductores));
        }   

        // Archivos: logo, portada, capturas
        if (mod_info.logo) {
          formData.append("logo", mod_info.logo); // debe ser File o Blob
        }   

        if (mod_info.portada) {
          formData.append("portada", mod_info.portada); // debe ser File o Blob
        }   

        if (mod_info.capturas && mod_info.capturas.length) {
          mod_info.capturas.forEach((file: File) => {
            formData.append("capturas[]", file); // ← con corchetes, PHP ya lo entiende como array
          });
        }

        const response = await $fetch<{message: string;}>(`${api_url}/add-mod`,{
          method: 'POST',
          body: formData,
          headers: {
            Authorization: token_original.value
          },
        })
        return {sucess: true, message: response.message}
      }catch(error: any){
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
        return {sucess: false, message: msg}
      }
    }

    const setOptionsToUploadMods = async ()=>{
        const optionsForSelects= ref<any>({
            generes: [],
            focus: [],
            people:[],
            status: [],
            types: [],
            durations: [],
            sagas:[],
            tiposagas:[]
        })
        try{
          const response2 = await fetchAllUsers();
          if(response2){
              response2.forEach((item)=>{
                  optionsForSelects.value.people.push({
                      label: item.nombre,
                      id: item.id
                  })
              })
          }
          const response = await fetchOptions();
          if(response){
              response.durations.forEach((item: any)=>{
                optionsForSelects.value.durations.push({
                    label: item.duracion,
                    id: item.id
                })
              })
              response.focus.forEach((item: any)=>{
                optionsForSelects.value.focus.push({
                    label: item.enfoque,
                    id: item.id
                })
              })
              response.status.forEach((item: any)=>{
                optionsForSelects.value.status.push({
                    label: item.estado,
                    id: item.id
                })
              })
              response.generes.forEach((item: any)=>{
                optionsForSelects.value.generes.push({
                    label: item.genero,
                    id: item.id
                })
              })
              response.sagas.forEach((item: any)=>{
                optionsForSelects.value.sagas.push({
                  label: item.titulo,
                  id: item.id
                })
              })
              response.tiposagas.forEach((item: any)=>{
                optionsForSelects.value.tiposagas.push({
                  label: item.tipo,
                  id: item.id
                })
              })
          }
          return{
            success: true, message: "Coerrecto", options : optionsForSelects
          }
        }catch(error){
            return{
                success: false, message: error
            }
        }
    }

    return{
        sendMod,
        setOptionsToUploadMods
    }
}