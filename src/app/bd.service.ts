import { PublicacoesComponent } from "./home/publicacoes/publicacoes.component";
import { Progresso } from "./progresso.service";
import { Injectable } from "@angular/core";
import * as firebase from "firebase";

@Injectable()
export class Bd {
  constructor(private progresso: Progresso) {}

  public publicar(publicacao: any): void {
    firebase
      .database()
      .ref(`publicacoes/${btoa(publicacao.email)}`)
      .push({ titulo: publicacao.titulo })
      .then((resposta: any) => {
        const nomeImagem = resposta.key;

        firebase
          .storage()
          .ref()
          .child(`imagens/${nomeImagem}`)
          .put(publicacao.imagem)
          .on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            // acompanhamento do progresso do upload
            (snapshot: any) => {
              this.progresso.status = "andamento";
              this.progresso.estado = snapshot;
              // console.log('Snapshot capturado no on()', snapshot);
            },
            error => {
              this.progresso.status = "erro";
              // console.log(error);
            },
            () => {
              // finalização do processo de upload
              this.progresso.status = "concluido";
              // console.log('upload completo');
            }
          );
      });
  }

  public consultaPublicacoes(emailUsuario: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // consultar as publicacoes (database)
      firebase
        .database()
        .ref(`publicacoes/${btoa(emailUsuario)}`)
        .orderByKey()
        .once("value")
        .then((snapshot: any) => {
          // console.log(snapshot.val());
          const publicacoes: Array<any> = [];

          snapshot.forEach((chieldSnapshot: any) => {
            const publicacao = chieldSnapshot.val();

            publicacao.key = chieldSnapshot.key;

            publicacoes.push(publicacao);
          });

          return publicacoes.reverse();
        })

        .then((publicacoes: any) => {
          publicacoes.forEach(publicacao => {
            // consultar a url da imagem (storage)
            firebase
              .storage()
              .ref()
              .child(`imagens/${publicacao.key}`)
              .getDownloadURL()
              .then((url: string) => {
                publicacao.url_imagem = url;

                // consultar o nome do usuário
                firebase
                  .database()
                  .ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                  .once("value")
                  .then((snapshot: any) => {
                    publicacao.nome_usuario = snapshot.val().nome_usuario;
                  });
              });
          });

          resolve(publicacoes);
        });
    });
  }
}
