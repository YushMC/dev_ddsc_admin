export const OptionsMods = ()=>{
    const api_url = useRuntimeConfig().public.api_url

    
    const fetchOptions = async()=>{
      const result: stringsOptionsAll = {
        generes: [],
        sagas: [],
        tiposagas: [],
        types: [],
        focus: [],
        durations: [],
        status: [],
    }
        try {
          const response = await fetch(`${api_url}/mods/options/duration`)
          if (!response.ok) {
            throw createError({
              statusCode: response.status,
              statusMessage: 'Error al obtener mods'
            })
          }
          const data = await response.json();
          result.durations = data.results;

          const response_2 = await fetch(`${api_url}/mods/options/status`)
          if (!response_2.ok) {
            throw createError({
              statusCode: response_2.status,
              statusMessage: 'Error al obtener mods'
            })
          } 
          const data2 = await response_2.json();
          result.status = data2.results;

          const response_3 = await fetch(`${api_url}/mods/options/type`)
          if (!response_3.ok) {
            throw createError({
              statusCode: response_3.status,
              statusMessage: 'Error al obtener mods'
            })
          } 
          const data3 = await response_3.json();
          result.types = data3.results;

          const response_4 = await fetch(`${api_url}/mods/options/focus-on`)
          if (!response_4.ok) {
            throw createError({
              statusCode: response_4.status,
              statusMessage: 'Error al obtener mods'
            })
          } 
          const data4 = await response_4.json();
          result.focus = data4.results;

          const response_5 = await fetch(`${api_url}/mods/options/genere`)
          if (!response_5.ok) {
            throw createError({
              statusCode: response_5.status,
              statusMessage: 'Error al obtener mods'
            })
          } 
          const data_5 = await response_5.json();
          result.generes = data_5.results;

          const response_6 = await fetch(`${api_url}/mods/options/all-sagas`)
          if (!response_6.ok) {
            throw createError({
              statusCode: response_6.status,
              statusMessage: 'Error al obtener mods'
            })
          } 
          const data_6 = await response_6.json();
          result.sagas = data_6.results;

          const response_7 = await fetch(`${api_url}/mods/options/tipo-mod-sagas`)
          if (!response_7.ok) {
            throw createError({
              statusCode: response_7.status,
              statusMessage: 'Error al obtener mods'
            })
          } 
          const data_7 = await response_7.json();
          result.tiposagas = data_7.results;

        } catch (err: any) {
          throw createError({ statusCode: 500, statusMessage: err.message })
        }   
        return result;
    }

    return{
        fetchOptions
    }
}