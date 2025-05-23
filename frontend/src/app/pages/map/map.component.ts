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
  private API_URL = 'http://localhost:8080/api/bloodbanks';  // Ajuste para o seu backend

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-22.838659, -47.0498384],
      zoom: 13,
      minZoom: 13,
      maxZoom: 18,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.loadBloodBanksMarkers();

    this.map.on('zoomend', () => {
      if (this.map.getZoom() < 13) {
        this.map.setZoom(13);
      }
    });
  }

  private async loadBloodBanksMarkers() {
    try {
      const response = await fetch(this.API_URL);
      const bloodBanks = await response.json();

      bloodBanks.forEach((bank: any) => {
        const lat = bank.address?.latitude;
        const lng = bank.address?.longitude;

        if (lat && lng) {
          L.marker([lat, lng], { icon: redIcon }).addTo(this.map)
            .bindPopup(`<b>${bank.name}</b><br/>${bank.address.street}, ${bank.address.city}`);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar hemocentros:', error);
    }
  }
}
