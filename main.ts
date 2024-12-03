import {ApolloServer} from "@apollo/server"
import {startStandaloneServer} from "@apollo/server/standalone";
import {MongoClient, ObjectId} from "mongodb"
import { schemaDB } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import {partModel, vehicleModel} from "./types.ts";

const mongoUrl = Deno.env.get('mongoDB')
if(!mongoUrl){
    console.error('no url in env')
    Deno.exit(-1)
}

const client = new MongoClient (mongoUrl)
await client.connect()
const dataBase = client.db('Vehicles_DB')

export const vehiclesCollection =  dataBase.collection<vehicleModel>('vehicles')
export const partsCollection = dataBase.collection<partModel>('parts')

const server = new ApolloServer({
    typeDefs : schemaDB,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    context: async () => ({ }),
    listen: { port: 8000 },
});


console.log(`Server running on: ${url}`);