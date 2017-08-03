import { DialogComponent } from './../components/dialog/dialog.component';
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

  constructor(private dialog: MdDialog) { }

  /**
   * Display a popup window with a message and a confirm and cancel options.
   * @param String the title of the window
   * @param String the message in the window
   * @return boolean if the message has been confirmed or not
   */
  public confirm(title: string, message: string): Observable<boolean> {
    return this.openDialog<boolean>(title, message, 'confirm');
  }

  /**
   * Display a popup window with a message, a text input, an accept and cancel options.
   * @param String the title of the window
   * @param String the message in the window
   * @return String the value of the text, null if no text or cancel has been selected
   */
  public prompt(title: string, message: string): Observable<string> {
    return this.openDialog<string>(title, message, 'prompt');
  }

  /**
   * Display a popup window with a message, a text input and an Ok button
   * @param String the title of the window
   * @param String the message in the window
   */
  public alert(title: string, message: string) {
    this.openDialog<any>(title, message, 'alert');
  }

  private openDialog<T>(title: string, message: string, type: string): Observable<T> {
    let dialogRef: MdDialogRef<DialogComponent>;
    dialogRef = this.dialog.open(DialogComponent, {
      //height: '300px',
      width: '500px'
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.type = type;
    return dialogRef.afterClosed();
  }
}
