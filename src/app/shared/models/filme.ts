export interface Filme {
  id?: number; // o ponto de interrogação significa que o item é opcional, nesse caso o próprio BACKEND gera o ID
  titulo: string;
  urlFoto?: string;
  dtLancamento: Date;
  descricao?: string;
  nota: number;
  urlIMDb?: string;
  genero: string;
}
