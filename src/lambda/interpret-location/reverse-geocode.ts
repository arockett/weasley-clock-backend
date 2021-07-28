import { LocationClient, SearchForPositionResult, SearchPlaceIndexForPositionCommand, SearchPlaceIndexForPositionCommandOutput } from '@aws-sdk/client-location';


const AWS_REGION = process.env.AWS_REGION ?? 'us-east-2';
const LOCATION = new LocationClient({region: AWS_REGION});


export class ReverseGeocodeResult {
  readonly UnknownCountry: string = 'UNKNOWN';
  country: string = this.UnknownCountry;
  atAirport: boolean = false;
  atHospital: boolean = false;

  constructor(rawResponse?: SearchPlaceIndexForPositionCommandOutput) {
    if (rawResponse !== undefined && rawResponse.Results !== undefined && rawResponse.Results.length >= 1) {
      this.country = rawResponse.Results[0].Place?.Country ?? this.UnknownCountry
      rawResponse.Results.forEach(result => {
        if (placeIsAirport(result)) {
          this.atAirport = true;
        }
      });
    }
  }
}

function placeIsAirport(placeResult: SearchForPositionResult): boolean {
  const address = placeResult.Place?.Label?.toLowerCase() ?? ""
  if (address.search('airport') != -1) {
    return true;
  } else {
    return false;
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
    console.warn(`Reverse geocoding failed:\n${JSON.stringify(err, null, 2)}`, err.stack);
    return new ReverseGeocodeResult();
  }
}