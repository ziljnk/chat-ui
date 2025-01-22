import { Component } from '@angular/core';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ChatComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chat-ui';

  customSendMessage(message: string): Promise<any> {
    // const API_ENDPOINT = `https://chat-ui.free.beeceptor.com/`; 
	  // console.log('message :>> ', message);
  
    // return new Promise((resolve, reject) => {
    //   fetch(API_ENDPOINT, {
    //     method: 'GET', 
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //     .then(response => response.json()) 
    //     .then(data => {
    //       resolve(data.content);
    //     })
    //     .catch(error => {
    //       reject(`Error: ${error.message}`);
    //     });

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. Nice to meet you! I am a chatbot. ');
        }, 5000);
      });
    // });
  }
  

  handleUserMessage(message: string) {
    console.log('User sent message:', message);
  }

  handleBotResponse(response: string) {
    console.log('Bot responded with:', response);
  }
}
