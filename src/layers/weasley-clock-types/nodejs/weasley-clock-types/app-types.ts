
export enum Status {
  /*
   * Commented out status are on the roadmap ;)
   */
  Home,
  InTransit,
  Out,
  //Abroad,
  //Lost,

  //Friends,
  //Family,
  //Work,
  //Gym,
  //HappyPlace,

  //Airport,
  //Hospital
}

export interface StatusUpdateMessage {
  user: string,
  status: Status
}