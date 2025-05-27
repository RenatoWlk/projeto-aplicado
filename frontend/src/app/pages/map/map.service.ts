import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, concat } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MapConstants } from './constants/map.constants'; 

export interface Location {
  name: string;
  coords: [number, number];
  address: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  // Dados estáticos de fallback
  private staticLocations: Location[] = [
    {
      name: 'Hemocentro Unicamp',
      coords: [-22.82377468659109, -47.06238270403627],
      address: 'Rua Tessália Vieira de Camargo, 126 - Cidade Universitária, Campinas - SP',
      phone: '(19) 3521-8700',
    },
    {
      name: 'Hemocentro Mario Gatti',
      coords: [-22.90956414345422, -47.07029810970188],
      address: 'Av. Pref. Faria Lima, 600 - Parque Itália, Campinas - SP',
      phone: '(19) 3772-5915',
    },
    {
      name: 'Centro de Hematologia e Hemoterapia Campinas',
      coords: [-22.89376799958717, -47.05641652694881],
      address: 'R. Luzitana, 1824 - Centro, Campinas - SP',
      phone: '(19) 3251-9811',
    },
    {
      name: 'CHCM Centro de Hemoterapia Celular em Medicina',
      coords: [-22.89564858936956, -47.06825670047348],
      address: 'Av. Andrade Neves, 1231 - Centro, Campinas - SP',
      phone: '(19) 3231-1234',
    },
  ];

  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    const static$ = of(this.staticLocations);
    const backend$ = this.http.get<Location[]>(MapConstants.GET_LOCATIONS_ENDPOINT).pipe(
      catchError(() => of([])) // Se der erro, retorna vazio para não quebrar a aplicação
    );

    return concat(static$, backend$);
  }
}
