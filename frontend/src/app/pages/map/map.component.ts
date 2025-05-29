import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MapService, Location } from './map.service';
import { Subscription } from 'rxjs';

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
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markersLayer = L.layerGroup();

  locations: Location[] = [];
  selectedLocation: Location | null = null;
  private locationsSub?: Subscription;

  constructor(private mapService: MapService) {}

  ngAfterViewInit(): void {
    this.locationsSub = this.mapService.getLocations().subscribe({
      next: (locs) => {
        this.locations = locs;
        if (!this.map) {
          this.initMap();
        } else {
          this.updateMarkers();
        }
      },
      error: (err) => console.error('Erro ao carregar locais', err),
    });
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

    this.markersLayer.addTo(this.map); // Adiciona o layer dos marcadores

    this.updateMarkers();
  }

  private updateMarkers(): void {
    this.markersLayer.clearLayers(); // Limpa só os marcadores

    this.locations.forEach((loc) => {
      const marker = L.marker(loc.coords as L.LatLngExpression, { icon: blueIcon })
        .on('click', () => this.selectLocation(loc))
        .bindPopup(`<b>${loc.name}</b><br>${loc.address}<br>${loc.phone}`);

      marker.addTo(this.markersLayer);
    });
  }

  selectLocation(location: Location) {
    this.selectedLocation = location;
    this.map.setView(location.coords as L.LatLngExpression, 15);
  }

  ngOnDestroy(): void {
    this.locationsSub?.unsubscribe();
  }
}
