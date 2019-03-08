import { Usuario } from './acesso/usuario.model';
import * as firebase from 'firebase';

export class Autenticacao {

  public token_id: string;

  public cadastrarUsuario(usuario: Usuario): Promise<any> {
   // console.log('usuario cadastro com sucesso ! : ', usuario);
    return firebase
      .auth()
      .createUserWithEmailAndPassword(usuario.email, usuario.senha)
      .then((resposta: any) => {

        // remover a senha do atributo senha do objeto usuario;
        delete usuario.senha;

        // registrando dados complementares do usuário no path email na base64
        // btoa criptografar em base 64
        // atob descriptografar em base 64
        firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`)
        .set( usuario );

      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  public autenticar(email: string, senha: string): void {
    firebase
    .auth()
    .signInWithEmailAndPassword(email, senha)
    .then((resposta: any) => {
      firebase.auth().currentUser.getIdToken()
      .then((idToken: string) => {
        this.token_id = idToken;
        console.log(this.token_id);
      });
    })
    .catch((error: Error) => {
      console.log(error);
    });
  }

}
