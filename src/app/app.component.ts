import { Component, OnInit } from '@angular/core';
import { HttpDataService } from '../app/services/util/http-data.service';
import { GameStatsService } from '../app/services/mlb/game-stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {

  pitchers: Array<any>;

  constructor(private http: HttpDataService, private games: GameStatsService) {}

  ngOnInit() {
    this.games.getLinescoresArray()
      .subscribe((pitchers) => {
        console.log('pitchers: ', pitchers);
      });
  }
}
