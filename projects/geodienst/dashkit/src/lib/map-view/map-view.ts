import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  ControlComponent,
  GeolocateControlDirective,
  MapComponent,
  MarkerComponent,
  NavigationControlDirective,
  ScaleControlDirective,
} from '@maplibre/ngx-maplibre-gl';
import { LngLatBoundsLike, Map, MapLibreEvent, StyleSpecification } from 'maplibre-gl';
import { map } from 'rxjs';
import { CountGauge } from '../count-gauge/count-gauge';
import { Image } from '../image/image';
import { Legend } from '../legend/legend';
import { MarkerIcon } from '../marker-icon/marker-icon';

// What the map needs of an item: where its marker goes, its icon, and its name, shown as tooltip.
export interface MapItem {
  name: string;
  icon: string;
  location: { lon: number; lat: number };
}

// A button shown as a map control; buttonClick emits its id.
export interface MapButton {
  id: string;
  icon: string;
  label: string;
}

@Component({
  imports: [
    MapComponent,
    MarkerComponent,
    ControlComponent,
    NavigationControlDirective,
    ScaleControlDirective,
    GeolocateControlDirective,
    CountGauge,
    Image,
    Legend,
    MarkerIcon,
    MatButton,
    MatIcon,
    MatTooltip,
  ],
  selector: 'gd-map-view',
  styleUrl: './map-view.css',
  templateUrl: './map-view.html',
})
export class MapView<T extends MapItem> {
  // The map is shown once the style is set.
  readonly basemapStyle = input<StyleSpecification>();
  // All items; the bounds and the count gauge's total cover them.
  readonly items = input<T[]>([]);
  // Only these get a marker.
  readonly shownItems = input<T[]>([]);
  // Set while the caller filters the items; shows the reset button.
  readonly filtered = input(false);
  readonly markerClick = output<T>();
  readonly reset = output();
  // Shown in the top right corner below MapLibre's own controls, in this order.
  readonly buttons = input<MapButton[]>([]);
  // Only the icons; the label stays as aria-label.
  readonly iconOnly = input(false);
  // Shown next to the count gauge, e.g. a funding logo.
  readonly logo = input<string>();
  // Icon name → label for the legend; the order of the keys is the order in the legend.
  readonly legendLabels = input<Record<string, string>>({});
  protected readonly iconOf = (item: T) => item.icon;
  // On a smartphone-sized screen (below 600px) the count gauge sits next to the legend instead of in the bottom right corner.
  protected readonly small = toSignal(
    inject(BreakpointObserver)
      .observe(Breakpoints.XSmall)
      .pipe(map((state) => state.matches)),
  );
  readonly buttonClick = output<string>();
  // Translated labels of MapLibre's own controls, keyed by MapLibre's text ids.
  protected readonly locale = {
    'NavigationControl.ZoomIn': $localize`:@@mapView.zoomIn:Zoom in`,
    'NavigationControl.ZoomOut': $localize`:@@mapView.zoomOut:Zoom out`,
  };
  // Smallest box around all items; undefined while there are none, so the default view stays.
  protected readonly bounds = computed((): LngLatBoundsLike | undefined => {
    const locations = this.items().map((item) => item.location);
    if (locations.length === 0) return undefined;
    const lons = locations.map((location) => location.lon);
    const lats = locations.map((location) => location.lat);
    return [
      [Math.min(...lons), Math.min(...lats)],
      [Math.max(...lons), Math.max(...lats)],
    ];
  });
  protected readonly fitBoundsOptions = { padding: 50, maxZoom: 10 };
  // Set by the map's load event; needed to move the map back on reset.
  protected map?: Map;
  private readonly destroyRef = inject(DestroyRef);
  // On small screens MapLibre shows its attribution expanded until the user drags the map; it covers too much, so it collapses after 5 seconds.
  protected onMapLoad(map: Map) {
    this.map = map;
    const timeout = setTimeout(
      () => map.getContainer().querySelector('.maplibregl-compact-show')?.classList.remove('maplibregl-compact-show'),
      5000,
    );
    this.destroyRef.onDestroy(() => clearTimeout(timeout));
  }
  // The reset button is only shown if the user moved the map or a filter is set.
  protected readonly movedByUser = signal(false);
  // Only moves started by the user (scroll, drag, zoom buttons) carry the original browser event.
  protected onMoveStart(event: MapLibreEvent<unknown>) {
    if (event.originalEvent) this.movedByUser.set(true);
  }
  // Zooms back to all items and lets the caller reset its filters.
  protected resetView() {
    const bounds = this.bounds();
    if (bounds) this.map?.fitBounds(bounds, this.fitBoundsOptions);
    this.movedByUser.set(false);
    this.reset.emit();
  }
  // Flies the map to one item; counts as a move, so the reset button appears.
  zoomTo(item: T) {
    const { lon, lat } = item.location;
    this.map?.flyTo({ center: [lon, lat], zoom: 14 });
    this.movedByUser.set(true);
  }
}
