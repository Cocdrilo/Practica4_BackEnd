import { Collection, ObjectId } from "mongodb";
import {
  part,
  partModel,
  vehicle,
  vehicleModel,
  vehicleWithJokeAndParts,
} from "./types.ts";
import { partsCollection, vehiclesCollection } from "./main.ts";
import {fromModelToPart, fromVehicleModelToVehicle, getRandomJoke} from "./utils.ts";

export const resolvers = {
  Query: {
    getVehicles: async (_: unknown, __: unknown, context: {
      vehiclesCollection: Collection<vehicleModel>;
      partsCollection: Collection<partModel>;
    }): Promise<vehicleWithJokeAndParts[]> => {
      const vehiclesModel = await vehiclesCollection.find().toArray();
      const vehicle = vehiclesModel.map((u) => fromVehicleModelToVehicle(u));

      const parts = await context.partsCollection.find({
        vehicleID: vehicle[0].id,
      }).toArray();

      const joke = await getRandomJoke();
      if (!joke) {
        console.log("No deberia pasar nunca");
      }
      const vehicleWithJoke: vehicleWithJokeAndParts[] = await Promise.all(
        vehicle.map(async (vehicle) => {
          // Obtener las partes del vehículo basado en el ID
          const parts = await context.partsCollection.find({
            vehicleID: new ObjectId(vehicle.id),
          }).toArray();

          // Retornar el vehículo con su broma y las partes asociadas
          return {
            vehicle,
            joke,
            parts,
          };
        }),
      );
      return vehicleWithJoke;
    },
    getVehicle: async (_: unknown, args: { id: string }, context: {
      vehiclesCollection: Collection<vehicleModel>;
      partsCollection: Collection<partModel>;
    }): Promise<vehicleWithJokeAndParts | null> => {
      const vehicleModel = await context.vehiclesCollection.findOne({
        _id: new ObjectId(args.id),
      });
      if (!vehicleModel) {
        return null;
      } else {
        const vehicle = fromVehicleModelToVehicle(vehicleModel);
        const parts = await context.partsCollection.find({
          vehicleID: new ObjectId(vehicle.id),
        }).toArray();
        const joke = await getRandomJoke();
        if (!joke) {
          console.log("No deberia pasar nunca");
        }
        return {
          vehicle,
          joke,
          parts,
        };
      }
    },
    getVehiclesByManufacturer: async (
      _: unknown,
      args: { manufacturer: string },
      context: {
        vehiclesCollection: Collection<vehicleModel>;
        partsCollection: Collection<partModel>;
      },
    ): Promise<vehicleWithJokeAndParts[]> => {
      //Busca por manufacturer y no pone las partes
      const vehiclesModel = await context.vehiclesCollection.find({
        manufacturer: args.manufacturer,
      }).toArray();
      const vehicle = vehiclesModel.map((u) => fromVehicleModelToVehicle(u));
      const joke = await getRandomJoke();
      if (!joke) {
        console.log("No deberia pasar nunca");
      }
      console.log(vehicle);
      const vehicleWithJoke: vehicleWithJokeAndParts[] = await Promise.all(
        vehicle.map(async (vehicle) => {
          return {
            vehicle,
            joke,
          };
        }),
      );
      return vehicleWithJoke;
    },

    getVehiclesByYearRange: async (
      _: unknown,
      args: { startYear: number; endYear: number },
      context: {
        vehiclesCollection: Collection<vehicleModel>;
        partsCollection: Collection<partModel>;
      },
    ): Promise<vehicle[]> => {
      const vehiclesModel = await context.vehiclesCollection.find({
        year: {
          $gte: args.startYear,
          $lte: args.endYear,
        },
      }).toArray();
      return vehiclesModel.map((u) => fromVehicleModelToVehicle(u));
    },
    getParts: async (_: unknown, __: unknown, context: {
      partsCollection: Collection<partModel>;
    }): Promise<part[]> => {
      const partModels = await context.partsCollection.find().toArray();
      const parts = partModels.map((u) => fromModelToPart(u));
      return parts;
    },
    getPartsFromVehicle: async (
      _: unknown,
      args: { id: string },
      context: {
        partsCollection: Collection<partModel>;
        vehiclesCollection: Collection<vehicleModel>;
      },
    ): Promise<partModel[]> => {
      const vehicleModel = await context.vehiclesCollection.findOne({
        _id: new ObjectId(args.id),
      });
      if (!vehicleModel) {
        return [];
      }
      return context.partsCollection.find({ vehicleID: new ObjectId(args.id) })
        .toArray();
    },
  },
  Mutation: {
    addVehicle: async (
      _: unknown,
      args: { name: string; manufacturer: string; year: number },
      context: { vehiclesCollection: Collection<vehicleModel> },
    ): Promise<vehicle> => {
      const vehicle: vehicleModel = {
        name: args.name,
        manufacturer: args.manufacturer,
        year: args.year,
      };
      const vehicleAñadir = await context.vehiclesCollection.insertOne(vehicle);
      return {
        id: vehicle._id!.toString(),
        name: vehicle.name,
        manufacturer: vehicle.manufacturer,
        year: vehicle.year,
      };
    },
    addPart: async (
      _: unknown,
      args: { name: string; price: number; vehicleID: string },
      context: { partsCollection: Collection<partModel> },
    ): Promise<partModel> => {
      const part: partModel = {
        name: args.name,
        price: args.price,
        vehicleID: new ObjectId(args.vehicleID),
      };
      const partAñadir = await context.partsCollection.insertOne(part);
      return {
        ...part,
        id: part._id!.toString(),
      };
    },
    deletePart: async ( _: unknown, args: { id: string }, context: { partsCollection: Collection<partModel> }, ): Promise<part | null> => {
        const partModel = await context.partsCollection.findOneAndDelete({ _id: new ObjectId(args.id) });
        if (!partModel) {
            return null;
        }
        const part = fromModelToPart(partModel)
        return part
    },
    updateVehicle: async ( _: unknown, args: { id: string, name?: string, manufacturer?: string, year?: number }, context: { vehiclesCollection: Collection<vehicleModel> }, ): Promise<vehicle | null> => {
        const vehicleModel = await context.vehiclesCollection.findOneAndUpdate({ _id: new ObjectId(args.id) }, { $set: args }, { returnDocument: "after" });
        if (!vehicleModel) {
            return null;
        }
        const vehicle = fromVehicleModelToVehicle(vehicleModel)
        return vehicle
    }

  },
};
