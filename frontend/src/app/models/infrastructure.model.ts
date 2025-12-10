export interface Infrastructure {
  bridge_id: string;
  name: string;
  location: string;
}

export interface InfrastructureLL {
  bridge_id?: string;
  name: string;
  Latitude: string;
  Longitude: string;
}

export interface InfrastructureCreate {
  name: string;
  location: string;
}

export interface InfrastructureUpdate {
  name?: string;
  location?: string;
}
