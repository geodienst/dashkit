import { Component, Directive, input, output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ControlComponent,
  GeolocateControlDirective,
  MapComponent,
  MarkerComponent,
  NavigationControlDirective,
  ScaleControlDirective,
} from '@maplibre/ngx-maplibre-gl';
import { MapView } from '@geodienst/dashkit';

// MapLibre needs WebGL, which the test DOM does not have, so the map, marker and controls are replaced by plain stand-ins.
@Component({ selector: 'mgl-map', template: '<ng-content />' })
export class MapStub {
  readonly mapStyle = input();
  readonly center = input();
  readonly zoom = input();
  readonly locale = input();
  readonly fitBounds = input();
  readonly fitBoundsOptions = input();
  readonly mapLoad = output<unknown>();
  readonly moveStart = output<unknown>();
}

@Component({ selector: 'mgl-marker', template: '<ng-content />' })
export class MarkerStub {
  readonly lngLat = input();
}

@Component({ selector: 'mgl-control', template: '<ng-content />' })
export class ControlStub {
  readonly position = input();
}

@Directive({ selector: '[mglNavigation]' })
export class NavigationStub {
  readonly showCompass = input();
}

@Directive({ selector: '[mglScale]' })
export class ScaleStub {}

@Directive({ selector: '[mglGeolocate]' })
export class GeolocateStub {}

// Swaps only MapLibre's components for the stubs; all other imports of MapView stay real,
// so a new import in MapView doesn't break the tests.
export function stubMapLibre() {
  TestBed.overrideComponent(MapView, {
    remove: {
      imports: [MapComponent, MarkerComponent, ControlComponent, NavigationControlDirective, ScaleControlDirective, GeolocateControlDirective],
    },
    add: { imports: [MapStub, MarkerStub, ControlStub, NavigationStub, ScaleStub, GeolocateStub] },
  });
}
