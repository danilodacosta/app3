import { Progresso } from './../../progresso.service';
import { Bd } from './../../bd.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Observable, Subject, interval } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';
import 'rxjs';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css'],
})
export class IncluirPublicacaoComponent implements OnInit {
  public email: string;
  private imagem: any;

  public progressoPublicacao = 'pendente';
  public porcentagemUpload: number;

  public formulario: FormGroup = new FormGroup({
    titulo: new FormControl(null)
  });

  constructor(private bd: Bd, private progresso: Progresso) {}

  ngOnInit() {
    // recuperar os dados do usuario logado.
    firebase.auth().onAuthStateChanged(user => {
      this.email = user.email;
    });
  }

  public publicar(): void {
    this.bd.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem[0]
    });

    // para o observable
    const continua = new Subject();

    continua.next(true);

    const acompanhamentoUpload = interval(1500);

    acompanhamentoUpload.pipe(takeUntil(continua)).subscribe(() => {

      this.progressoPublicacao = 'andamento';
      this.porcentagemUpload = Math.round(( this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes) * 100 );

      if (this.progresso.status === 'concluido') {
          this.progressoPublicacao = 'concluido';
          continua.next(false);
        }
      });
    }

  public preparaImagemUpload(event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files;
  }
}
