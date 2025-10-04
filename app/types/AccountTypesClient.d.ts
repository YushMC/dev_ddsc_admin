interface countriesInterface{
    id: number;
    name: string;
    url_flag: string;
}

interface userInterface{
    id: number;
    nombre: string;
    descripcion?: string;
    nacionalidad: string;
    slug: string;
    rol: string;
    url_logo?: string;
    url_banner?: string;
    url_fondo_pantalla?: string;
}

interface registerUserInterface{
    user: string;
    password: string;
    email: string;
    country: number;
}

interface loginInterface{
    email: string;
    password: string;
}