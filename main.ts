import {ApolloServer} from "@apollo/server"
import {startStandaloneServer} from "@apollo/server/standalone";
import {Collection, MongoClient, ObjectId} from "mongodb"
import { schemaDB } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import {partModel, vehicleModel} from "./types.ts";

const mongoUrl = "mongodb+srv://cocdrilo:cocdrilo@nebrijatest.n7ral.mongodb.net/?retryWrites=true&w=majority&appName=NebrijaTest";
if(!mongoUrl){
    console.error('no url in env')
    console.error('Error en la URL')
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
    context:async () => ({vehiclesCollection,partsCollection}),
    listen: { port: 3500 },
});


console.log(`Server running on: ${url}`);