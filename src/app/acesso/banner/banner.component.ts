import { Component, OnInit } from '@angular/core';
import { trigger, state, style } from '@angular/animations';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: [
    trigger('banner', [
      state('escondido', style({
        opacity: 0
      })),
      state('visivel', style({
        opacity: 1
      }))
    ])
  ]
})
export class BannerComponent implements OnInit {

  public estado  = 'visivel';

  constructor() { }

  ngOnInit() {
  }

  public toggleEstado(): void {
    this.estado = this.estado === 'visivel' ? 'escondido' : 'visivel';
  }
}
