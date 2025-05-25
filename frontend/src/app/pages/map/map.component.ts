import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // ➝ Importa CommonModule
import * as L from 'leaflet';

const blueIcon = new L.Icon({
  iconUrl: 'assets/marker-icon-2x.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

@Component({
  selector: 'app-map',
  standalone: true,   // ➝ Se você estiver usando standalone (provável)
  imports: [CommonModule], // ➝ Adiciona aqui
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;

  locations = [
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

  selectedLocation: any = null;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-22.838659, -47.0498384],
      zoom: 13,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.locations.forEach((loc) => {
      const marker = L.marker(loc.coords as L.LatLngExpression, { icon: blueIcon })
        .addTo(this.map)
        .on('click', () => this.selectLocation(loc));

      marker.bindPopup(loc.name);
    });
  }

  selectLocation(location: any) {
    this.selectedLocation = location;
    this.map.setView(location.coords as L.LatLngExpression, 15);
  }
}
