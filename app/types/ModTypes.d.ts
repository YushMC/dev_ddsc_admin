interface ModInterface{
    id: number;
    nombre: string;
    descripcion: string;
    duracion: string;
    estado: string;
    personaje: string;
    isNSFW: number;
    tipo: string;
    slug: string;
    created: string;
    visitas: number;
    generos: string[];
    creadores: string[];
    traductores: string[];
    capturas: string[];
    logo: string;
    portada: string;
    pc: string;
    android: string;
}

interface creditsInfoInterface{
    id: number;
    id_user?: number;
    nombre: string;
}

interface ModInterfaceDetails{
    id: number;
    nombre: string;
    descripcion: string;
    duracion: string;
    estado: string;
    personaje: string;
    isNSFW: number;
    tipo: string;
    slug: string;
    created: string;
    visitas: number;
    generos: string[];
    creadores: creditsInfoInterface[];
    traductores: creditsInfoInterface[];
    capturas: string[];
    logo: string;
    portada: string;
    pc: string;
    android: string;
}

interface ModSagaInterface{
    id: number;
    nombre: string;
    descripcion: string;
    duracion: string;
    estado: string;
    isNSFW: number;
    tipo_en_la_saga: string;
    slug: string;
    created: string;
    visitas: number;
    generos: string[];
    logo: string;
    portada: string;
    capturas: string[];
}

interface AllModsSagaInterface{
    id: number;
    titulo_saga: string;
    slug_saga: string;
    mods: ModSagaInterface[];
}


interface CreadorAndTraductorInterfaceToUpload{
    id?: number,
    nombre: string,
}

interface ModInterfaceToUpload{
    nombre: string;
    descripcion?: string;
    duracion: number;
    estado: number;
    personaje: number;
    isNSFW: number;
    tipo: number;
    generos: number[];
    creadores: CreadorAndTraductorInterfaceToUpload[];
    slug?:string;
    traductores?: CreadorAndTraductorInterfaceToUpload[];
    capturas?: File[];
    logo?: File;
    portada?: File;
    pc: string;
    android: string;
    id_saga:number;
    id_tipo_saga:number;
}

