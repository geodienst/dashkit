import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { clearTranslations, loadTranslations } from '@angular/localize';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { StyleSpecification } from 'maplibre-gl';
import { MapButton, MapItem, MapView } from './map-view';
import { ControlStub, GeolocateStub, MapStub, NavigationStub, ScaleStub, stubMapLibre } from './map-view.stubs';

const style: StyleSpecification = { version: 8, sources: {}, layers: [] };

const places: MapItem[] = [
  { name: 'A', icon: 'child_care', location: { lon: 5, lat: 52 } },
  { name: 'B', icon: 'groups', location: { lon: 6, lat: 51 } },
  { name: 'C', icon: 'transgender', location: { lon: 7, lat: 53 } },
];

// Shows all places.
function createMapView() {
  stubMapLibre();
  const fixture = TestBed.createComponent(MapView);
  fixture.componentRef.setInput('basemapStyle', style);
  fixture.componentRef.setInput('items', places);
  fixture.componentRef.setInput('shownItems', places);
  return fixture;
}

const mapButtons: MapButton[] = [
  { id: 'first', icon: 'list', label: 'First' },
  { id: 'second', icon: 'map', label: 'Second' },
];

describe('MapView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    clearTranslations();
  });

  it('passes the given basemap style to the map', async () => {
    const fixture = createMapView();
    await fixture.whenStable();

    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;
    expect(map.mapStyle()).toBe(style);
  });

  it('shows a marker at the location of each shown item', async () => {
    const fixture = createMapView();
    await fixture.whenStable();

    const markers = fixture.debugElement.queryAll(By.css('mgl-marker'));
    expect(markers.map((marker) => marker.componentInstance.lngLat())).toEqual([
      [5, 52],
      [6, 51],
      [7, 53],
    ]);
  });

  it('shows markers only for the shown items', async () => {
    const fixture = createMapView();
    fixture.componentRef.setInput('shownItems', [places[0]]);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('mgl-marker').length).toBe(1);
  });

  it('shows the icon of each item in its marker', async () => {
    const fixture = createMapView();
    await fixture.whenStable();

    const icons = fixture.nativeElement.querySelectorAll('mgl-marker mat-icon');
    expect([...icons].map((icon: Element) => icon.textContent?.trim())).toEqual(['child_care', 'groups', 'transgender']);
  });

  it('shows the number of shown items of all items in the count gauge', async () => {
    const fixture = createMapView();
    fixture.componentRef.setInput('shownItems', [places[0]]);
    await fixture.whenStable();

    const gauge = fixture.nativeElement.querySelector('gd-count-gauge');
    expect(gauge?.querySelector('.count')?.textContent).toBe('1');
    expect(gauge?.textContent).toContain('of 3');
  });

  it('shows the logo next to the count gauge', async () => {
    const fixture = createMapView();
    fixture.componentRef.setInput('logo', 'some/logo.png');
    await fixture.whenStable();

    const logo = fixture.nativeElement.querySelector('gd-image img');
    expect(logo?.getAttribute('src')).toBe('some/logo.png');
  });

  it('shows no logo without one', async () => {
    const fixture = createMapView();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('gd-image')).toBeNull();
  });

  it('shows a legend of the marker icons with the given labels', async () => {
    const fixture = createMapView();
    fixture.componentRef.setInput('legendLabels', { transgender: 'Trans people' });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('gd-legend')?.textContent).toContain('Trans people');
  });

  it('shows the count gauge next to the legend instead of in the bottom right corner on a small screen', async () => {
    // jsdom has no matchMedia; this stand-in matches every media query, like a smartphone screen would match the small ones.
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query, addListener() {}, removeListener() {} }));
    const fixture = createMapView();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.bottom-left gd-legend + gd-count-gauge')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('gd-count-gauge').length).toBe(1);
  });

  it('shows the reset button only as icon next to the count gauge on a small screen', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query, addListener() {}, removeListener() {} }));
    const fixture = createMapView();
    await fixture.whenStable();
    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;

    map.moveStart.emit({ originalEvent: new WheelEvent('wheel') });
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('.bottom-left gd-count-gauge + button');
    expect(button?.textContent?.trim()).toBe('restart_alt');
    expect(button?.getAttribute('aria-label')).toBe('Reset');
  });

  it('emits the item of a clicked marker', async () => {
    const fixture = createMapView();
    await fixture.whenStable();
    const clicked: unknown[] = [];
    fixture.componentInstance.markerClick.subscribe((item) => clicked.push(item));

    fixture.nativeElement.querySelector('mgl-marker gd-marker-icon').click();

    expect(clicked).toEqual([places[0]]);
  });

  it('shows the name of each item as tooltip on hover over its marker', async () => {
    const fixture = createMapView();
    await fixture.whenStable();

    // Only the markers; the legend's "Other" icons have tooltips too.
    const tooltips = fixture.debugElement
      .queryAll(By.css('mgl-marker gd-marker-icon'))
      .map((element) => element.injector.get(MatTooltip));
    expect(tooltips.map((tooltip) => tooltip.message)).toEqual(['A', 'B', 'C']);
  });

  it("shows MapLibre's zoom buttons without the compass", async () => {
    const fixture = createMapView();
    await fixture.whenStable();

    const navigation = fixture.debugElement.query(By.directive(NavigationStub))?.injector.get(NavigationStub);
    expect(navigation?.showCompass()).toBe(false);
  });

  it("shows MapLibre's scale bar", async () => {
    const fixture = createMapView();
    await fixture.whenStable();

    expect(fixture.debugElement.query(By.directive(ScaleStub))).not.toBeNull();
  });

  it("shows MapLibre's geolocate button", async () => {
    const fixture = createMapView();
    await fixture.whenStable();

    expect(fixture.debugElement.query(By.directive(GeolocateStub))).not.toBeNull();
  });

  it('shows the given buttons with icon and label as controls in the top right corner, below the other controls', async () => {
    const fixture = createMapView();
    fixture.componentRef.setInput('buttons', mapButtons);
    await fixture.whenStable();

    // MapLibre stacks the controls of a corner in the order they are added. Controls created in an @for are added
    // before the static ones, so all buttons share the last, static control, which is added after the locate button.
    const last = fixture.debugElement.queryAll(By.directive(ControlStub)).at(-1)!;
    expect((last.componentInstance as ControlStub).position()).toBe('top-right');
    const buttons: HTMLElement[] = [...last.nativeElement.querySelectorAll('button')];
    expect(buttons.map((button) => button?.querySelector('mat-icon')?.textContent.trim())).toEqual(['list', 'map']);
    expect(buttons.map((button) => button?.getAttribute('aria-label'))).toEqual(['First', 'Second']);
    expect(buttons.map((button) => button?.textContent)).toEqual([
      expect.stringContaining('First'),
      expect.stringContaining('Second'),
    ]);
  });

  it('emits the id of a clicked button', async () => {
    const fixture = createMapView();
    fixture.componentRef.setInput('buttons', mapButtons);
    await fixture.whenStable();
    const clicked: string[] = [];
    fixture.componentInstance.buttonClick.subscribe((id) => clicked.push(id));

    [...fixture.nativeElement.querySelectorAll('mgl-control button')].at(-1)?.click();

    expect(clicked).toEqual(['second']);
  });

  it('shows only the icons of the buttons with iconOnly, keeping the label for screen readers', async () => {
    const fixture = createMapView();
    fixture.componentRef.setInput('buttons', mapButtons);
    fixture.componentRef.setInput('iconOnly', true);
    await fixture.whenStable();

    const button = [...fixture.nativeElement.querySelectorAll('mgl-control button')].at(-1);
    // "map" is the icon's ligature, the only text left.
    expect(button?.textContent.trim()).toBe('map');
    expect(button?.getAttribute('aria-label')).toBe('Second');
  });

  it('passes the zoom button labels in the loaded language to the map', async () => {
    loadTranslations({ 'mapView.zoomIn': 'Vergrößern', 'mapView.zoomOut': 'Verkleinern' });
    const fixture = createMapView();
    await fixture.whenStable();

    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;
    expect(map.locale()).toEqual({ 'NavigationControl.ZoomIn': 'Vergrößern', 'NavigationControl.ZoomOut': 'Verkleinern' });
  });

  it("collapses MapLibre's expanded attribution after 5 seconds, so it does not cover the map on a small screen", async () => {
    const fixture = createMapView();
    await fixture.whenStable();
    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;
    // On small screens MapLibre shows its compact attribution expanded until the user drags the map.
    const container = document.createElement('div');
    container.innerHTML = '<details class="maplibregl-ctrl-attrib maplibregl-compact maplibregl-compact-show"></details>';
    const attribution = container.firstElementChild!;
    vi.useFakeTimers();

    map.mapLoad.emit({ getContainer: () => container });

    vi.advanceTimersByTime(4999);
    expect(attribution.classList.contains('maplibregl-compact-show')).toBe(true);
    vi.advanceTimersByTime(1);
    expect(attribution.classList.contains('maplibregl-compact-show')).toBe(false);
  });

  it('fits the map to the bounds of all items, also the ones not shown', async () => {
    const fixture = createMapView();
    fixture.componentRef.setInput('shownItems', [places[0]]);
    await fixture.whenStable();

    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;
    expect(map.fitBounds()).toEqual([[5, 51], [7, 53]]);
  });

  it('fits the map to all items again and emits reset when the reset button is clicked', async () => {
    const fixture = createMapView();
    await fixture.whenStable();
    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;
    const fitBounds = vi.fn();
    map.mapLoad.emit({ fitBounds });
    map.moveStart.emit({ originalEvent: new WheelEvent('wheel') });
    const resets: unknown[] = [];
    fixture.componentInstance.reset.subscribe(() => resets.push(true));

    await (await TestbedHarnessEnvironment.loader(fixture).getHarness(MatButtonHarness.with({ text: /Reset/ }))).click();

    expect(fitBounds).toHaveBeenCalledWith([[5, 51], [7, 53]], { padding: 50, maxZoom: 10 });
    expect(resets.length).toBe(1);
  });

  it('flies to an item and shows the reset button when zoomTo is called', async () => {
    const fixture = createMapView();
    await fixture.whenStable();
    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;
    const flyTo = vi.fn();
    map.mapLoad.emit({ flyTo });

    fixture.componentInstance.zoomTo(places[0]);

    expect(flyTo).toHaveBeenCalledWith({ center: [5, 52], zoom: 14 });
    expect(await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonHarness)).toHaveLength(1);
  });

  it('shows the reset button label in the loaded language', async () => {
    loadTranslations({ 'mapView.reset': 'Zurücksetzen' });
    const fixture = createMapView();
    await fixture.whenStable();
    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;
    map.moveStart.emit({ originalEvent: new WheelEvent('wheel') });

    const button = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatButtonHarness);
    expect(await button.getText()).toContain('Zurücksetzen');
  });

  it('hides the reset button at start and after a move started by code', async () => {
    const fixture = createMapView();
    await fixture.whenStable();
    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;

    map.moveStart.emit({});

    expect(await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonHarness)).toHaveLength(0);
  });

  it('shows the reset button after the user moved the map', async () => {
    const fixture = createMapView();
    await fixture.whenStable();
    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;

    map.moveStart.emit({ originalEvent: new WheelEvent('wheel') });

    expect(await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonHarness)).toHaveLength(1);
  });

  it('shows the reset button when the items are filtered', async () => {
    const fixture = createMapView();
    await fixture.whenStable();

    fixture.componentRef.setInput('filtered', true);

    expect(await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatButtonHarness)).toHaveLength(1);
  });

  it('hides the reset button again after it was clicked', async () => {
    const fixture = createMapView();
    await fixture.whenStable();
    const map = fixture.debugElement.query(By.directive(MapStub)).componentInstance as MapStub;
    map.moveStart.emit({ originalEvent: new WheelEvent('wheel') });
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await (await loader.getHarness(MatButtonHarness)).click();

    expect(await loader.getAllHarnesses(MatButtonHarness)).toHaveLength(0);
  });
});
