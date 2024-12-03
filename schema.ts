
export const schemaDB = `#graphql
type vehicle {
    id : String!
    name : String!
    manufacturer : String!
    year: Int!
}

type part {
    id: String!
    name: String!
    price : Int!
    vehicleID : String!
}

type vehicleWithJokeAndParts {
    vehicle: vehicle!
    joke : String !
    parts : [part]
}


type Query{
    getVehicles : [vehicleWithJokeAndParts!]!
    getVehicle (id: String!) : vehicleWithJokeAndParts
    getVehiclesByManufacturer(manufacturer: String!) : [vehicleWithJokeAndParts!]!
    getVehiclesByYearRange (startYear : Int!, endYear : Int!) : [vehicle!]!

    getParts : [part!]!
    getPartsFromVehicle(id: String!) : [part!]!

}

type Mutation {
    addVehicle (name: String!,manufacturer: String!, year: Int!) : vehicle!
    addPart (name : String!, price: Int!,vehicleID: String!) : part!

    updateVehicle (id: String!, name: String, manufacturer: String, year: Int ) : vehicle!
    
    deletePart(id: String!) : part!

}

`