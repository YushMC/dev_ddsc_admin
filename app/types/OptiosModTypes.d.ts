interface durationInterface {
  id: number;
  duracion: string;
}

interface typeModInterface {
  id: number;
  tipo: string;
}

interface statusInterface {
  id: number;
  estado: string;
}

interface focusInterface {
  id: number;
  enfoque: string;
}

interface genereInterface {
  id: number;
  genero: string;
}

interface sagasOptionsInterface {
  id: number;
  titulo: string;
}

interface stringsOptionsAll{
  generes: genereInterface[];
  focus: focusInterface[];
  status: statusInterface[];
  types: typeModInterface[];
  durations: durationInterface[];
  sagas: sagasOptionsInterface[];
  tiposagas:typeModInterface[];
}
interface allOptionsInterface{
    generes: genereInterface[];
    focus: focusInterface[];
    status: statusInterface[];
    types: typeModInterface[];
    durations: durationInterface[];
}