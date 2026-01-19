import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-genericmessage',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal implements OnInit{

  @Input() style = ''
  @Input() title = '';
  styleScss!:string;

  @ViewChild('genericModal',  { static: false }) genericModal : ElementRef | undefined;
  show:boolean=false;
  constructor(private renderer:Renderer2){
    
    this.renderer.listen('window', 'click', (e:Event) =>{
      if(this.genericModal && e.target === this.genericModal.nativeElement)
        this.show = false;
    })

    // Escuchar tecla ESC
    this.renderer.listen('window', 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.show) {
        this.show = false;
      }
    });
  }

  ngOnInit(): void {
    this.styleScss = this.style
  }

}