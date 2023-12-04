import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://127.0.0.1:8000/ap/v1/agent/tasks/';
  private currentTaskId: string | null = null;

  constructor(private http: HttpClient) {}

  // Start a new chat task
  startChatTask(taskName: string = 'Onboarding Chat with JAIDA'): Observable<any> {
    const body = { input: 'Have a friendly conversation with the user', name: taskName };
    return this.http.post(this.baseUrl, body);
  }

  // Send a message (step) in the chat
  sendMessage(userInput: string): Observable<any> {
    if (!this.currentTaskId) {
      throw new Error('No active task. Start a new chat task first.');
    }
    const body = { input: userInput, name: 'Chat with User' };
    return this.http.post(`${this.baseUrl}${this.currentTaskId}/steps`, body);
  }

  // Set the current task ID
  setCurrentTaskId(taskId: string) {
    this.currentTaskId = taskId;
  }
}
