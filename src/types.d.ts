export interface Question {
  id: number;
  pregunta: string;
  codigo: string;
  opciones: Opcion[];
  respuestaCorrecta: number;
  seleccionRespuestaUsuario?: number;
  esRespuestaCorrecta?: boolean;
}
