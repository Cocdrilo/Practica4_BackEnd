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
  manufacturer: string;
  year: number;
};

export type part = {
  id: string;
  name: string;
  price: number;
  vehicleId : string
};
