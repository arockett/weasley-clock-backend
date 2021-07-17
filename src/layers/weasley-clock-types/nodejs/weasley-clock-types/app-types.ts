
export enum Status {
  /*
   * Commented out status are on the roadmap ;)
   */
  Home = "HOME",
  InTransit = "IN_TRANSIT",
  Out = "OUT",
  //Abroad = "ABROAD",
  //Lost = "LOST",

  //Friends = "FRIENDS",
  //Family = "FAMILY",
  //Work = "WORK",
  //Gym = "GYM",
  //HappyPlace = "HAPPY_PLACE",

  //Airport = "AIRPORT",
  //Hospital = "HOSPITAL"
}

export interface StatusUpdateMessage {
  user: string,
  status: Status
}

export enum WaypointLabel {
  /*
   * Commented out labels are on the roadmap ;)
   */
  Home = "HOME",
  // Friends = "FRIENDS",
  // Family = "FAMILY",
  // Work = "WORK",
  // Gym = "GYM",
  // HappyPlace = "HAPPY_PLACE"
}