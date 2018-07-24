import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpDataService } from './mlb/http-data.service';
import { Observable } from 'rxjs';
import { share, mergeMap, map, pluck, tap, toArray } from 'rxjs/operators';

@Injectable()
export class TeamsService {

  private ROOT_URL = 'http://m.bluejays.mlb.com/shared/properties/style/';

  // Search 
  // http://lookup-service-prod.mlb.com/json/named.player_teams.bam?player_id=446099&season=2018

  // Stat Key
  // http://m.bluejays.mlb.com/sections/player2/components/careerstats/careerstats-config.json

  // Teams
  // http://lookup-service-prod.mlb.com/json/named.team_all_season.bam?team_all_season.col_in=name_display_brief&team_all_season.col_in=name_display_full&team_all_season.col_in=team_id&sort_order=name_asc&all_star_sw=%27N%27&league_list_id=%27mlb_hist%27&season=2018

  // Team Rosters

  // http://lookup-service-prod.mlb.com/json/named.roster_all.bam?roster_all.col_in=player_html&roster_all.col_in=player_id&roster_all.col_in=forty_man_sw&roster_all.col_in=status_code&team_id=%27141%27&ovrd_enc=utf-8

  // Pitching
  // http://lookup-service-prod.mlb.com/json/named.comp_player_has_stats_game_type.bam?player_id=446099&league_list_id=%27mlb_hist%27
  // http://lookup-service-prod.mlb.com/json/named.sport_pitching_composed.bam?game_type=%27R%27&league_list_id=%27mlb_hist%27&sort_by=%27season_asc%27&player_id=446099&sport_pitching_composed.season=2018

  // https://baseballsavant.mlb.com/player/zone?player_id=446099&player_type=pitcher&season=2018&hfGT=R|
  // https://baseballsavant.mlb.com/player/zone?player_id=446099&player_type=pitcher&season=2018&hfGT=R|&hfPR=&hfAB=28|29|
  // https://baseballsavant.mlb.com/player/zone?player_id=446099&player_type=pitcher&season=2018&hfGT=R|&group_by=name&sort_col=ba&sort_order=asc&min_abs=0
  // https://baseballsavant.mlb.com/player/zone?player_id=446099&player_type=pitcher&season=2018&hfGT=R|&group_by=name&sort_col=exit_velocity&sort_order=asc&min_abs=0

  constructor(
    private http: HttpDataService
  ) {}

  requestTeamRoster$(team): Observable<any> {
  	// Currently only returning Toronto Blue Jays data
    return this.http.getStaticData('http://lookup-service-prod.mlb.com/json/named.roster_all.bam?roster_all.col_in=player_html&roster_all.col_in=player_id&roster_all.col_in=forty_man_sw&roster_all.col_in=status_code&team_id=%27141%27&ovrd_enc=utf-8')
      .pipe(
      	mergeMap(res => this.teamPlayerIdsParser(res)),
      	map(res => this.randomPlayerId(res))
      )
  }

	teamPlayerIdsParser(stream) {
		return stream.pipe(
			pluck('roster_all', 'queryResults', 'row'),
			mergeMap(player => player), // TODO: Look into this error
			pluck('player_id'),
			toArray(),
			tap(res => console.log('player_ids: ', res))
		)
	}

	randomPlayerId(arr) {
	  const randomIndex = Math.floor(Math.random() * arr.length);
		return arr[randomIndex];
	}
}
