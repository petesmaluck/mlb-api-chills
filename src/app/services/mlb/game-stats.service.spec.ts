/* tslint:disable:no-unused-variable */
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GameStatsService } from './game-stats.service';
import * as moment from 'moment';

describe('RemoteService', () => {
  let service: GameStatsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GameStatsService]
    });

    // inject the service
    service = TestBed.get(GameStatsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should have a service instance', () => {
    expect(service).toBeDefined();
  });

  it('should return the json', () => {
    service.requestTodaysGames().subscribe(data => {
      expect(data.scheduledInnings).toBe(9);
    });

    // TODO: More details API response
    const req = httpMock.expectOne(service.ROOT_URL + 'date=' + moment().format('YYYY') + '-' + moment().format('MM') + '-' + '23' + service.PARAMS, 'call to api');
    expect(req.request.method).toBe('GET');

    req.flush({
      scheduledInnings: 9
    });
  });
});
