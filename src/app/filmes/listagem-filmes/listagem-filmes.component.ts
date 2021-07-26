import { ConfigParams } from './../../shared/models/config-params';
import { Filme } from 'src/app/shared/models/filme';
import { FilmesService } from 'src/app/core/filmes.service';
import {Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {
    readonly semFoto = 'https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-permanentes/cindra/imagens/sem.jpg.gif/image';
    config: ConfigParams = {
      pagina: 0,
      limite: 4
    };
    filmes: Filme[] = [];
    filtrosListagem: FormGroup;
    generos: Array<String>;

  constructor(private filmesService: FilmesService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
      texto: [''],
      genero: [''],
    });

    // debounce dá um tempo para o usuário digitar
    this.filtrosListagem.get('texto').valueChanges.pipe(debounceTime(400)).subscribe((val: string) => {
      this.config.pesquisa = val;
      this.resetarConsulta();
    });
    this.filtrosListagem.get('genero').valueChanges.subscribe((val: string) => {
      this.config.campo = {tipo: 'genero', valor: val};
      this.resetarConsulta();
    });

    this.generos = ['Ação', 'Romance', 'Aventura', 'Ficção Cientifica', 'Terror', 'Comédia', 'Drama'];

    this.listarFilmes();

  }

  onScroll(): void {
    this.listarFilmes();
  }

  abrir(id: number): void {
    this.router.navigateByUrl('/filmes/' + id);
  }

  private listarFilmes(): void {
      this.config.pagina++;
      this.filmesService.listar(this.config).subscribe((filmes: Filme[]) =>
      this.filmes.push(...filmes));
  }

  private resetarConsulta(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
}
}

