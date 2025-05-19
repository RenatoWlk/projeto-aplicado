import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl: 'assets/marker-icon-2x.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

@Component({
selector: 'app-map',
templateUrl: './map.component.html',
styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

private map!: L.Map;

ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Criar o mapa já com as opções que bloqueiam o zoom out e limitam o zoom in
    this.map = L.map('map', {
      center: [-22.838659, -47.0498384],
      zoom: 13,
      minZoom: 13,       // bloqueia zoom out
      maxZoom: 18,       // máximo zoom in
      zoomControl: false // esconde os controles padrão do Leaflet
    });

    // Adicionar camada de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Adiciona os marcadores com ícone vermelho
    L.marker([-22.838659, -47.0498384], { icon: redIcon }).addTo(this.map)
      .bindPopup('Casa do Renato');

    L.marker([-22.82377468659109, -47.06238270403627], { icon: redIcon }).addTo(this.map)
      .bindPopup('Hemocentro Unicamp');

    L.marker([-22.90956414345422, -47.07029810970188], { icon: redIcon }).addTo(this.map)
      .bindPopup('Hemocentro Mario Gatti');

    L.marker([-22.89376799958717, -47.05641652694881], { icon: redIcon }).addTo(this.map)
      .bindPopup('Centro de Hematologia e Hemoterapia Campinas');

    L.marker([-22.89564858936956, -47.06825670047348], { icon: redIcon }).addTo(this.map)
      .bindPopup('CHCM Centro de Hemoterapia Celular em Medicina');

    // Para evitar zoom out via scroll do mouse, força o zoom mínimo
    this.map.on('zoomend', () => {
      if (this.map.getZoom() < 13) {
        this.map.setZoom(13);
      }
    });
  }
}
