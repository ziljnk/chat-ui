import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaAutoresizeDirective } from '../../directives/textarea-autoresize.directive';

interface Message {
	content: string;
	isUser: boolean;
	timestamp: Date;
}

@Component({
	selector: 'app-chat',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TextareaAutoresizeDirective
	],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.css'
})

export class ChatComponent {
	@ViewChild('scrollContainer') private scrollContainer!: ElementRef;
	@ViewChild('textarea') private textArea!: ElementRef;
	@Input() sendMessageCallback!: (message: string) => Promise<string>;
	@Output() onMessageSent = new EventEmitter<string>();
	@Output() onMessageReceived = new EventEmitter<string>();

	messages: Message[] = [
		{
			content: 'Hello! How can I help you today?',
			isUser: false,
			timestamp: new Date()
		}
	];
	messageInput = new FormControl('');
	isWaitingForResponse = false;

	ngAfterViewChecked() {
		this.scrollToBottom();
	}

	private scrollToBottom(): void {
		try {
			this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
		} catch (err) { }
	}

	async sendMessage() {
		if (this.isWaitingForResponse) {
			return;
		}

		this.isWaitingForResponse = true;
		const content = this.messageInput.value?.trim();
		if (content) {
			this.messages.push({
				content,
				isUser: true,
				timestamp: new Date()
			});
			this.onMessageSent.emit(content);
			this.messageInput.reset();
			this.textArea.nativeElement.style.height = '23px';

			if (this.sendMessageCallback) {
				try {
					const response = await this.sendMessageCallback(content);
					this.messages.push({
						content: response ?? 'This is a sample response from the bot.',
						isUser: false,
						timestamp: new Date()
					});

					this.onMessageReceived.emit(response);
					this.isWaitingForResponse = false
				} catch (error) {
					console.error("Error sending message:", error);
					this.messages.push({
						content: "Failed to get response from the server.",
						isUser: false,
						timestamp: new Date()
					});
				}
			}
		}
	}

	handleSendMessageByEnter(event: any) {
		if (event.key === 'Enter' && !event.shiftKey && !this.isWaitingForResponse) {
			event.preventDefault();
			this.sendMessage();
		}
	}
}
