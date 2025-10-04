interface api_response{
    message: string;
    token: string;
}

export default defineEventHandler(async (event)=>{
    const config = useRuntimeConfig()
    const body = await readBody(event);

    try {
      const response_login = await fetch(`${config.API_URL}/login`,{
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
      })

      if (!response_login.ok) {
        const errorData = await response_login.json();
        throw new Error(errorData.error);
      }
      const data = await response_login.json() as api_response

      setCookie(event, 'auth_token', data.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 5 * 24 * 60 * 60,
       })
      return {
        message: data.message
      }
    } catch (err: any) {
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
})