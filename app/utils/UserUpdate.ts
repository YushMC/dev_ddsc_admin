export const UserUpdate = ()=>{
    const api_url = useRuntimeConfig().public.api_url;
    interface data_to_change{
        alias: string;
        logo?: File;
        banner?: File;
        descripcion: string;
        password: string;
        new_password?: string;
    }

    const user_update=ref<data_to_change>({
        alias: '',
        descripcion: '',
        password: '',
    })


    const updateLogo = async (token: string)=>{
        if(!user_update.value.logo) return {success: false, message: "No hay imagen cargada"}
        try{
            const formData = new FormData();
            formData.append("file", user_update.value.logo);
            const response = await $fetch<{message: string;}>(`${api_url}/update-photo-user`,{
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: token
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

    const updateBanner = async (token: string)=>{
       if(!user_update.value.banner) return {success: false, message: "No hay imagen cargada"}
        try{
            const formData = new FormData();
            formData.append("file", user_update.value.banner);
            const response = await $fetch<{message: string;}>(`${api_url}/update-banner-user`,{
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: token
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

    const updatePassword = async (token: string)=>{
        try{
            const response = await $fetch<{message: string}>(`${api_url}/change-password`,{
                method: 'PUT',
                body:{
                    "old_pass": user_update.value.password,
                    "new_pass": user_update.value.new_password
                },
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: token
                }
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

    const updateInfoUser = async (token: string)=>{
        try{
            const response = await $fetch<{message: string}>(`${api_url}/change-description-user`,{
                method: 'PUT',
                body:{
                    "descripcion": user_update.value.descripcion
                },
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: token
                }
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

    const userRegister= async (data: registerUserInterface)=>{
      try {
        const response = await $fetch<{message: string}>(`${api_url}/register-user`,{
              method: 'POST',
              body: data,
              headers: {'Content-Type': 'application/json'}
        })
        return{
          success: true,
          message: response.message,
        }
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
        return {sucess: false, message: msg}
    }
  }

  return{
    updateLogo,
    updateBanner,
    updatePassword,
    updateInfoUser,
    userRegister,
    user_update
  }
}