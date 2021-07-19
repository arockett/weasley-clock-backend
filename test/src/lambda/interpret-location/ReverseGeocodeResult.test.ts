import { SearchPlaceIndexForPositionCommandOutput } from "src/lambda/interpret-location/node_modules/@aws-sdk/client-location/dist/types";
import { ReverseGeocodeResult } from "src/lambda/interpret-location/reverse-geocode";

function resultTemplate(): SearchPlaceIndexForPositionCommandOutput {
  return {
    $metadata: {
      httpStatusCode: 200,
      requestId: "8cec0c11-de0f-4a49-ab43-ede7f13e02e2",
      attempts: 1,
      totalRetryDelay: 0
    },
    Results: [
      {
        Place: {
          AddressNumber: "795",
          Country: "USA",
          Geometry: {
            Point: [-104.99058035186928, 39.72881964813069]
          },
          Label: "785-799 Speer Blvd, Denver, CO, 80204, USA",
          Municipality: "Denver",
          Neighborhood: "Lincoln Park",
          PostalCode: "80204",
          Region: "Colorado",
          SubRegion: "City and County of Denver"
        }
      }
    ],
    Summary: {
      DataSource: "Esri",
      MaxResults: 50,
      Position: [-104.9906, 39.7288]
    }
  }
}

test('ReverseGeocodeResult default values', () => {
  // WHEN
  const reverseGeocodeResult = new ReverseGeocodeResult();
  // THEN
  expect(reverseGeocodeResult.country).toBe(reverseGeocodeResult.UnknownCountry);
  expect(reverseGeocodeResult.atAirport).toBeFalsy();
  expect(reverseGeocodeResult.atHospital).toBeFalsy();
})

test('ReverseGeocodeResult.country set correctly', () => {
  // WHEN
  let serviceResult = resultTemplate();
  // @ts-ignore: Don't mess with null checking to simplify reusing object template
  serviceResult.Results[0].Place.Country = 'USA';
  const reverseGeocodeResult = new ReverseGeocodeResult(serviceResult);
  // THEN
  expect(reverseGeocodeResult.country).toBe('USA');
})

test('ReverseGeocodeResult.atAirport set correctly', () => {
  // WHEN
  let serviceResult = resultTemplate();
  // @ts-ignore: Don't mess with null checking to simplify reusing object template
  serviceResult.Results[0].Place.Label = "Denver Int'l Airport, 8500 Pena Blvd, Denver, CO, 80249, USA";
  const reverseGeocodeResult = new ReverseGeocodeResult(serviceResult);
  // THEN
  expect(reverseGeocodeResult.atAirport).toBeTruthy();
})