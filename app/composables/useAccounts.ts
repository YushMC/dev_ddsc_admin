interface RolePermissionsInterface{
    read_mod:boolean;
    edit_mod:boolean;
    add_mod:boolean;
    delete_mod:boolean;
    user_actions:boolean;
    info_actions:boolean;
    rol_actions:boolean;
    community_actions:boolean;
}

interface RoleInterface{
    id: number;
    rol: string;
    permissions: RolePermissionsInterface;
}

interface api_response_all{
    response: string;
    total_rows: number;
    results: userInterface[];
}

interface api_response_countries{
    response: string,
    total_rows: number,
    results: countriesInterface[],
}


const role_permissions = ref<RoleInterface>({
    id: 0,
    rol: "",
    permissions: {
        read_mod: false,
        edit_mod: false,
        add_mod: false,
        delete_mod: false,
        user_actions: false,
        info_actions: false,
        rol_actions: false,
        community_actions: false
    }
})

const token_data = ref<TokenDataInterface>({
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
    url_bandera: ""
})

const token_original = ref("");

export const useAccounts = ()=>{
    const api_url = useRuntimeConfig().public.api_url;

    const fetchPermissions = async (id_rol: number) =>{
        interface api_response{
            response: string;
            total_rowws: number;
            results: RoleInterface;
        }
        try{
            const response = await $fetch<api_response>(`${api_url}/rol/id/${id_rol}`);
            if(response){
                role_permissions.value = response.results;
            }
        }catch(error){

        }
    }

    const fetchAllUsers = async ()=>{
        try{
            const response = await $fetch<api_response_all>(`${api_url}/users`)
            
            return response.results
            
        }catch(error){

        }
    }

    const fetchCOuntries = async ()=>{
        try {
          const response = await $fetch<api_response_countries>(`${api_url}/countries`)
          if (response) {
            return response.results
          }
        } catch (err: any) {
          
        }   
    }

    return{
        role_permissions,
        fetchPermissions,
        fetchAllUsers,
        fetchCOuntries,
        token_original,
        token_data
    }
}