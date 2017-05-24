import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProdutoService } from "../../providers/produto-service";

@Component({
  selector: 'page-coletar',
  templateUrl: 'coletar.html',
})
export class ColetarPage {
  produto: any = null;
  filial;
  documento;
  armazem;
  endereco;
  qtd;
  qtd2;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ProdService: ProdutoService) {
    this.produto = this.navParams.get('produto');
  }

  save() {
    let data = {
      filial: this.filial,
      produto: this.produto.codigo,
      doc: this.documento,
      qtd: this.qtd,
      qtd2: this.qtd2,
      local: this.armazem,
      endereco: this.endereco
    };
    this.ProdService.salvarInv(data)
    .then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    })
  }

}
