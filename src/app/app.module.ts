import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

import { HttpDataService } from '../app/services/mlb/http-data.service';
import { GameStatsService } from '../app/services/mlb/game-stats.service';
import { TeamsService } from '../app/services/teams.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [HttpDataService, GameStatsService, TeamsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
