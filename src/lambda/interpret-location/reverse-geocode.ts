import { LocationClient, SearchForPositionResult, SearchPlaceIndexForPositionCommand, SearchPlaceIndexForPositionCommandOutput } from '@aws-sdk/client-location';

const LOCATION = new LocationClient({region: 'us-east-2'});


export class ReverseGeocodeResult {
  readonly UnknownCountry: string = 'UNKNOWN';
  country: string = this.UnknownCountry;
  atAirport: boolean = false;
  atHospital: boolean = false;

  constructor(rawResponse?: SearchPlaceIndexForPositionCommandOutput) {
    if (rawResponse !== undefined && rawResponse.Results !== undefined && rawResponse.Results.length >= 1) {
      this.country = rawResponse.Results[0].Place?.Country ?? this.UnknownCountry
    }
  }
}

/*
 * Impure functions, they talk to the dirty outside world!
 */
export async function reverseGeocode(lon: number, lat: number): Promise<ReverseGeocodeResult> {
  try {
    const response = await LOCATION.send(new SearchPlaceIndexForPositionCommand({
      IndexName: process.env.PLACE_INDEX_NAME,
      Position: [lon, lat]
    }));
    console.log(`[SUCCESS] Reverse geocoded position:\n${JSON.stringify(response, null, 2)}`);
    return new ReverseGeocodeResult(response);
  } catch (err) {
    console.log(`[WARNING] Reverse geocoding failed:\n${JSON.stringify(err, null, 2)}`, err.stack);
    return new ReverseGeocodeResult();
  }
}