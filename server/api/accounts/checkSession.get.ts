export default defineEventHandler(async (event)=>{
    const config = useRuntimeConfig()
    const token = getCookie(event, "auth_token");

    if (!token) {
        return {success: false}
    }
    try {
      const response = await fetch(`${config.API_URL}/session`,{
        method: 'GET',
        headers:{
          Authorization: token,
          "Content-Type": "application/json",
        }
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json()

      if(data.token_decodificado){
          return {token_decodificado: data.token_decodificado,token: token, success: true}
      }else{
          return {success: false}
      }
    } catch (err: any) {
      return {success: false}
    }
})