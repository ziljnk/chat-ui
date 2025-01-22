import { AfterViewInit, Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
	selector: '[autoresize]',
	standalone: true
})


export class TextareaAutoresizeDirective implements AfterViewInit {
	@HostListener(':input')
	onInput() {
		this.resize();
	}

	constructor(private elementRef: ElementRef) { }

	resize() {
		this.elementRef.nativeElement.style.height = '0';
		this.elementRef.nativeElement.style.height = this.elementRef.nativeElement.scrollHeight + 'px';
	}

	ngAfterViewInit() {
		if (this.elementRef.nativeElement.scrollHeight) {
			this.resize();
		}
	}
}
