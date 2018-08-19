import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpDataService } from '../util/http-data.service';
import { Observable, of } from 'rxjs';
import { concat, map, filter, mergeMap, catchError, pluck, share, tap, toArray } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class GameStatsService {

  private mlbGameData: any;

  public ROOT_URL = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&';
  public PARAMS = '&hydrate=team(leaders(showOnPreview(leaderCategories=[homeRuns,runsBattedIn,battingAverage],statGroup=[pitching,hitting]))),linescore(matchup,runners),flags,liveLookin,review,broadcasts(all),decisions,person,probablePitcher,stats,homeRuns,previousPlay,game(content(media(featured,epg),summary),tickets),seriesStatus(useOverride=true)&language=en';

  constructor(
    private http: HttpDataService
  ) {}

  requestTodaysGames(): Observable<any> {
    return this.http.getStaticData(this.ROOT_URL + 'date=' + moment().format('YYYY') + '-' + moment().format('MM') + '-' + '23' + this.PARAMS)
      .pipe(
        mergeMap(games => games),
        mergeMap((games: any) => games.dates[0].games), // TODO: Setup games interface
        map(games => games),
        share()
      );
  }

  pollTodaysGames(interval): Observable<any> {
    return this.http.pollingData(this.ROOT_URL + 'date=' + moment().format('YYYY') + '-' + moment().format('MM') + '-' + moment().format('DD') + this.PARAMS, interval)
      .pipe(
        mergeMap(res => res),
        mergeMap((games: any) => games.dates[0].games),
        map(games => games),
        share()
      );
  }

  // Utility function

  pluckGameData(...params) {
    return this.requestTodaysGames()
      .pipe(
        pluck(...params)
      );
  }

  // Game Data

  todaysGameByTeam(team): Observable<any> {
    return this.requestTodaysGames()
      .pipe(
        filter(game => (game.teams.away.team.locationName === team) || (game.teams.home.team.locationName === team)),
        catchError(err => of('error found', err))
      );
  }

  getLiveGames(): Observable<any> {
    return this.pollTodaysGames(60000)
       .pipe(
        filter(game => game.status.abstractGameState === 'Live'),
        catchError(err => of('error found', err))
      );
  }

  // Probable Pitcher

  probableAwayPitchers(): Observable<any> {
    return this.requestTodaysGames()
      .pipe(
        pluck('teams', 'away', 'probablePitcher')
      );
  }

  probableHomePitchers(): Observable<any> {
    return this.requestTodaysGames()
      .pipe(
        pluck('teams', 'home', 'probablePitcher')
      );
  }

  probablePitchersArray(): Observable<any> {
    return this.requestTodaysGames()
      .pipe(
        pluck('teams'),
        map((team: any) => { // TODO: Setup team interface
          return {
            'away': { 'teamID': team.away.team.id, 'teamName': team.away.team.name, 'pitcher': team.away.probablePitcher },
            'home': { 'teamID': team.home.team.id, 'teamName': team.home.team.name, 'pitcher': team.home.probablePitcher }
          }
        }),
        toArray()
      );
  }

  // Linescores

  getLinescoresArray(): Observable<Array<any>> {
    return this.requestTodaysGames()
      .pipe(
        pluck('linescore')
      );
  }

  getLinescoreByTeam(team): Observable<any> {
    return this.todaysGameByTeam(team)
      .pipe(
        pluck('linescore')
      );
  }
}
