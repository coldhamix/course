import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElectronService } from './providers/electron.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FileComponent } from './sidebar/file/file.component';
import { ImageComponent } from './sidebar/image/image.component';
import { DrawingComponent } from './sidebar/drawing/drawing.component';
import { FxComponent } from './sidebar/fx/fx.component';
import { DrawingService } from './sidebar/drawing/drawing.service';
import { CanvasService } from './canvas/canvas.service';
import { FxService } from './fx/fx.service';
import { FileService } from './sidebar/file/file.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    FileComponent,
    ImageComponent,
    DrawingComponent,
    FxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ElectronService,
    DrawingService,
    CanvasService,
    FxService,
    FileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
