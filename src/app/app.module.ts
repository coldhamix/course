import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
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
export class AppModule { }
