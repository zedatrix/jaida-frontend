import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {
  public messages: Array<{ sender: string, content: string, isLoading?: boolean }> = [];
  public userInput: string = '';
  public isLoading: boolean = true;

  // Using '!' to assert that the property will be assigned.
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.startChatTask().subscribe(
      response => {
        this.chatService.setCurrentTaskId(response.task_id);
        if (response.output) {
          this.messages.push({ sender: 'JAIDA', content: response.output });
          this.isLoading = false;
        }
      },
      error => {
        console.error('Error starting chat task:', error);
        this.isLoading = false;
      }
    );
  }

  ngAfterViewInit(): void {
    this.setFocus();
  }

  sendMessage(): void {
    if (this.userInput.trim()) {
      const newMessage = { sender: 'Me', content: this.userInput, isLoading: true };
      this.messages.push(newMessage);
      this.userInput = ''; // Clear the input field

      this.chatService.sendMessage(newMessage.content).subscribe(
        response => {
          newMessage.isLoading = false; // Remove loading state
          if (response.output) {
            this.messages.push({ sender: 'JAIDA', content: response.output });
          }
        },
        error => {
          console.error('Error sending message:', error);
          newMessage.isLoading = false;
        }
      );
    }
  }

  lastMessageIsLoading(): boolean {
    if (this.messages.length === 0) return false;
    return !!this.messages[this.messages.length - 1].isLoading;
  }

  setFocus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }
}
