import { Alerta } from './../../shared/models/alerta';
import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos: Array<string>;
  id: number;

  constructor(public dialog: MatDialog,
    public validacao: ValidarCamposService,
    private fb: FormBuilder,
    private filmeService: FilmesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  get f() {
    return this.cadastro.controls;
    // retornando todos os inputs
  }

  ngOnInit(): void {
      this.id = this.activatedRoute.snapshot.params['id'];
      if (this.id) {
        this.filmeService.visualizar(this.id).subscribe((filme: Filme) => {
            this.criarFormulario(filme);
        });
      } else {
        this.criarFormulario(this.criarFilmeEmBranco());
      }



      this.generos = ['Ação', 'Romance', 'Aventura', 'Ficção Cientifica', 'Terror', 'Comédia', 'Drama'];
  }

  // É INDIFERENTE COLOCAR PUBLIC SE FOR PUBLICO
  submit(): void {
    this.cadastro.markAllAsTouched();
    if (this.cadastro.invalid) {
      return ;

    }
    const filme = this.cadastro.getRawValue() as Filme;
    // getRawValue retorna os campos que estão no FormGroup do cadastro
    // as Filme mostra que o parametro para ser entregue no salvar é uma interface do tipo Filme
    if (this.id) {
      filme.id = this.id;
      this.editar(filme);
    } else {
      this.salvar(filme);
    }
  }

  reiniciarForm(): void {
    this.cadastro.reset();
}

  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      // valor inicial + validação
      titulo: [filme.titulo, [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]], // É OBRIGATÓRIO
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(5)]],
      linkIMDB: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]

    });
  }

  private criarFilmeEmBranco(): Filme {
    return {
      id: null,
      titulo: null,
      urlFoto: null,
      dtLancamento: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null
    } as Filme;
  }

  private salvar(filme: Filme): void {
    this.filmeService.salvar(filme).subscribe(() => {
      const config = {
        data: {
          btnSucesso: 'Ir para a listagem',
          btnCancelar: ' Cadastrar novo filme',
          corBtnCancelar: 'primary',
          possuirBtnFechar: true
        } as Alerta
      };
      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe((opcao: boolean) => {
        if (opcao) {
          // Levando o usuário para outra url
          this.router.navigateByUrl('filmes');
        } else {
          this.reiniciarForm();
        }
      });
    },
    () => {
      const config = {
        data: {
          titulo: 'Erro ao salvar o registro!',
          descricao: 'Não conseguimos salvar seu registro, tente novamente mais tarde :(',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar',
        } as Alerta
    };
    this.dialog.open(AlertaComponent, config);
  });
}

private editar(filme: Filme): void {
  this.filmeService.editar(filme).subscribe(() => {
    const config = {
      data: {
        titulo: 'Registro atualizado com sucesso!',
        descricao: 'seu registro foi atualizado',
        btnSucesso: 'Ir para a listagem',
      } as Alerta
    };
    const dialogRef = this.dialog.open(AlertaComponent, config);
    dialogRef.afterClosed().subscribe(() => {
        // Levando o usuário para outra url
        this.router.navigateByUrl('filmes');
      }
    );
  },
  () => {
    const config = {
      data: {
        titulo: 'Erro ao editar o registro!',
        descricao: 'Não conseguimos editar seu registro, tente novamente mais tarde :(',
        corBtnSucesso: 'warn',
        btnSucesso: 'Fechar',
      } as Alerta
  };
  this.dialog.open(AlertaComponent, config);
});
}
}
