import { ObjectId, OptionalId } from "mongodb";

export type vehicleModel = OptionalId<{
  name: string;
  manufacturer: string;
  year: number;
}>;

export type partModel = OptionalId<{
  name: string;
  price: number;
  vehicleID : ObjectId
}>;

export type vehicle = {
  id: string;
  name: string;
  manufacturer: string;
  year: number;
};

export type part = {
  id: string;
  name: string;
  price: number;
  vehicleID : string
};

export type vehicleWithJokeAndParts = {
  vehicle: vehicle;
  joke: string;
  parts: part
}

