import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaAutoresizeDirective } from './textarea-autoresize.directive';

interface Message {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

@Component({
    selector: 'ng-chatbot-ui',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextareaAutoresizeDirective
    ],
    template: `
    <div class="chat-container">
	<div class="chat-messages" #scrollContainer>
		<div *ngFor="let message of messages"
			[ngClass]="{'message': true, 'user-message': message.isUser, 'bot-message': !message.isUser}">
			<div class="message-content">{{ message.content }}</div>
			<div class="message-timestamp">{{ message.timestamp | date:'shortTime' }}</div>
		</div>

		<div class="is-typing-indicator" *ngIf="isWaitingForResponse">
			<p>Bot is responding</p>
			<div class="dots"></div>
		</div>
	</div>

	<div class="chat-input">
		<form (ngSubmit)="sendMessage()">
			<div class="input-container">
				<textarea #textarea autoresize autocomplete="off" [formControl]="messageInput" placeholder="Message ChatBot"
				(keydown.enter)="handleSendMessageByEnter($event)"></textarea>
				
				<button type="submit" [disabled]="!messageInput.value?.trim() || isWaitingForResponse">
					<svg viewBox="0 0 24 24" width="24" height="24">
						<path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
					</svg>
				</button>
			</div>
		</form>
	</div>
</div>
  `,
    styles: `
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #ffffff;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
}

.is-typing-indicator {
    position: sticky;
    top: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 10px 0;
    color: #808080;
}

.message {
    max-width: 80%;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    position: relative;
}

.message .message-content {
    font-size: 0.9375rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.message .message-timestamp {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-top: 0.25rem;
}

.user-message {
    background-color: #007AFF;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 0.25rem;
}

.bot-message {
    background-color: #f0f0f0;
    color: #000000;
    align-self: flex-start;
    border-bottom-left-radius: 0.25rem;
}

.chat-input {
    border-top: 1px solid #e5e5e5;
    padding: 1rem;
    background-color: #ffffff;
}

.chat-input form {
    margin: 0;
}

.chat-input .input-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f0f0f0;
    border-radius: 0.75rem;
    padding-block: 0.25rem;
    padding-inline: 1rem;
}

.chat-input .input-container textarea {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0;
    font-size: 0.9375rem;
    line-height: 1.5;
    outline: none;
    resize: none;
    max-height: 135px;
}

.chat-input .input-container textarea::placeholder {
    color: #666666;
}

.chat-input .input-container button {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: #007AFF;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chat-input .input-container button:disabled {
    color: #cccccc;
    cursor: not-allowed;
}

.chat-input .input-container button svg {
    width: 1.5rem;
    height: 1.5rem;
}
  
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

html,
body {
    height: 100%;
}

body {
    margin: 0;
    font-family: Roboto, "Helvetica Neue", sans-serif;
}

.dots {
    width: 5.8px;
    height: 5.8px;
    border-radius: 50%;
    clip-path: inset(-12px -48px);
    color: #808080;
    box-shadow: 9.1px -19.2px, 18.2px -19.2px, 27.4px -19.2px;
    transform: translateX(-18.2px);
    animation: dots-y3c9ksmn 1s infinite;
}

@keyframes dots-y3c9ksmn {
    16.67% {
        box-shadow: 9.1px 0px, 18.2px -19.2px, 27.4px -19.2px;
    }

    33.33% {
        box-shadow: 9.1px 0px, 18.2px 0px, 27.4px -19.2px;
    }

    45%,
    55% {
        box-shadow: 9.1px 0px, 18.2px 0px, 27.4px 0px;
    }

    66.67% {
        box-shadow: 9.1px 19.2px, 18.2px 0px, 27.4px 0px;
    }

    83.33% {
        box-shadow: 9.1px 19.2px, 18.2px 19.2px, 27.4px 0px;
    }

    100% {
        box-shadow: 9.1px 19.2px, 18.2px 19.2px, 27.4px 19.2px;
    }
}
  `
})
export class NgChatbotUiComponent {
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
                    this.isWaitingForResponse = false;
                }
            }
        }
    }

    handleSendMessageByEnter(event: any) {
        if (event.key === 'Enter' && !event.shiftKey && !this.isWaitingForResponse) {
            if (this.messageInput.value && this.messageInput.value.trim().length !== 0) {
                event.preventDefault();
                this.sendMessage();
            }
        }
    }
}
