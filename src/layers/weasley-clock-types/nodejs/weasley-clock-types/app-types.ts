
export enum Status {
  /*
   * Commented out status are on the roadmap ;)
   */
  Home = "Home",
  Traveling = "Traveling",
  Out = "Out",
  Abroad = "Abroad",
  //Lost = "Lost",

  Friends = "Friends",
  Family = "Family",
  Work = "Work",
  Gym = "Gym",
  HappyPlace = "HappyPlace",

  Airport = "Airport",
  Hospital = "Hospital"
}

export interface StatusUpdateMessage {
  user: string,
  status: Status
}

export enum WaypointLabel {
  Home = "Home",
  Friends = "Friends",
  Family = "Family",
  Work = "Work",
  Gym = "Gym",
  HappyPlace = "HappyPlace"
}