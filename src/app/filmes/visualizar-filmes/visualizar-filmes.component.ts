import { FilmesService } from './../../core/filmes.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filme } from 'src/app/shared/models/filme';
import { Alerta } from 'src/app/shared/models/alerta';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dio-visualizar-filmes',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.scss']
})
export class VisualizarFilmesComponent implements OnInit {
  readonly semFoto = 'https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-permanentes/cindra/imagens/sem.jpg.gif/image';
  filme: Filme;
  id: number;

  constructor(public dialog: MatDialog,
     private router: Router,
     private activatedRoute: ActivatedRoute,
     private filmesService: FilmesService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.visualizar();
  }

  excluir(): void {
    const config = {
      data: {
        titulo: 'Você tem certeza que deseja excluir filme?',
        descricao: 'Caso tenha certeza, clique no botão Excluir',
        btnCancelar: 'Cancelar',
        btnSucesso: 'Excluir',
        corBtnCancelar: 'primary',
        corBtnSucesso: 'warn',
        possuirBtnFechar: true
      } as Alerta
    };
    const dialogRef = this.dialog.open(AlertaComponent, config);
    dialogRef.afterClosed().subscribe((opcao: boolean) => {
      if (opcao) {
        // Levando o usuário para outra url
        this.filmesService.excluir(this.id)
        .subscribe(() =>
            this.router.navigateByUrl('/filmes'));
      }
    });
  }

  editar(): void{
    this.router.navigateByUrl('filmes/cadastro/' + this.id);
  }

  private visualizar(): void {
    this.filmesService.visualizar(this.id).subscribe((filme: Filme) => {
      this.filme = filme;
    });
  }



}
