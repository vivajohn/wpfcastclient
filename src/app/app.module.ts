import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MatIconModule, MatButtonModule, MatProgressSpinnerModule, 
  MatTooltipModule, MatSliderModule, MatSnackBarModule, MatDialogModule, 
  MatMenuModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FileDropDirective } from './directives/file-drop.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerComponent } from './components/player/player.component';
import { AudioPlusComponent } from './components/audio-plus/audio-plus.component';
import { HelpComponent } from './components/help/help.component';
import { ListMenuComponent } from './components/list-menu/list-menu.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { UploadButtonComponent } from './components/upload-button/upload-button.component';
import { HelpButtonComponent } from './components/help-button/help-button.component';
import { DlgStringComponent } from './components/dlg-string/dlg-string.component';
import { FormsModule } from '@angular/forms';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';

@NgModule({
  declarations: [
    AppComponent,
    FileDropDirective,
    PlayerComponent,
    AudioPlusComponent,
    HelpComponent,
    ListMenuComponent,
    TopMenuComponent,
    UploadButtonComponent,
    HelpButtonComponent,
    DlgStringComponent,
    ConfirmDeleteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSliderModule,
    DragDropModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  entryComponents: [
    HelpComponent,
    DlgStringComponent,
    ConfirmDeleteComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
