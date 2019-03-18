import { Progresso } from './progresso.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class Bd {

  constructor(private progresso: Progresso) { }

  public publicar(publicacao: any): void {

     const nomeImagem = Date.now();

    firebase.storage().ref()
    .child(`imagens/${nomeImagem}`)
    .put(publicacao.imagem)
    .on(firebase.storage.TaskEvent.STATE_CHANGED,
       // acompanhamento do progresso do upload
      (snapshot: any) => {
        this.progresso.status = 'andamento';
        this.progresso.estado = snapshot;
        // console.log('Snapshot capturado no on()', snapshot);
      },
      (error) => {
        this.progresso.status = 'erro';
        // console.log(error);
      },
      () => {
        // finalização do processo de upload
        this.progresso.status = 'concluido';
        // console.log('upload completo');
      }

     );


   /* firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
      .push({ titulo: publicacao.titulo });
    // console.log('Chegamos no serviço responsavel pelo controle de dados');
     */
  }
}
