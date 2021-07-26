import { ConfigParamsService } from './config-params.service';
import { ConfigParams } from './../shared/models/config-params';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Filme } from '../shared/models/filme';

const url = 'http://localhost:3000/filmes/';


@Injectable({
  providedIn: 'root'
})
export class FilmesService {

  constructor(private http: HttpClient, private configService: ConfigParamsService) { }

  salvar(filme: Filme): Observable<Filme> {
    return this.http.post<Filme>(url, filme);
    // post de publicação do filme
    // Já converte para JSON
  }

  editar(filme: Filme): Observable<Filme> {
    return this.http.put<Filme>(url + filme.id, filme);
    // post de publicação do filme
    // Já converte para JSON
  }

  listar(config: ConfigParams): Observable<Filme[]> {
    const configParams = this.configService.configurarParametros(config);
    return this.http.get<Filme[]>(url, {params: configParams});
  }

  visualizar(id: number): Observable<Filme> {
    return this.http.get<Filme>(url + id);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(url + id);
  }


}
