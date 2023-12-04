import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  public messages: Array<{ sender: string, content: string }> = [];
  public userInput: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.startChatTask().subscribe(
      response => {
        this.chatService.setCurrentTaskId(response.task_id);
        console.log(response.task_id);
        // Add initial response from JAIDA to the messages
        if (response.output) {
          this.messages.push({ sender: 'JAIDA', content: response.output });
        }
      },
      error => {
        console.error('Error starting chat task:', error);
        // Optionally, show a user-friendly error message
      }
    );
  }

  sendMessage(): void {
    if (this.userInput.trim()) {
      // Add user's message to the chat
      this.messages.push({ sender: 'Me', content: this.userInput });

      this.chatService.sendMessage(this.userInput).subscribe(
        response => {
          // Add JAIDA's response to the chat
          // Assuming the response contains a field 'message'
          if (response.output) {
            this.messages.push({ sender: 'JAIDA', content: response.output });
          }
        },
        error => {
          console.error('Error sending message:', error);
          // Optionally, show a user-friendly error message
        }
      );

      // Clear the input field
      this.userInput = '';
    }
  }
}
