import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDirectiveNumber]'
})
export class DirectiveNumber {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  // Controla la entrada en tiempo real
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;
    let value = input.value;

    // Elimina cualquier caracter que no sea número o punto
    value = value.replace(/[^0-9.]/g, '');

    // Permite solo un punto
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }

    // Limita decimales a máximo 2
    if (parts[1]?.length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }

    // Limita la parte entera a solo 1 dígito
    if (parts[0].length > 1) {
      value = parts[0].substring(0, 1) + (parts[1] ? '.' + parts[1] : '');
    }

    input.value = value;
  }

  // Controla la acción de pegar
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData?.getData('text/plain') ?? '';
    let value = clipboardData.replace(/[^0-9.]/g, '');

    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }

    if (parts[1]?.length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }

    if (parts[0].length > 1) {
      value = parts[0].substring(0, 1) + (parts[1] ? '.' + parts[1] : '');
    }

    event.preventDefault();
    this.el.nativeElement.value = value;
  }
}