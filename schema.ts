
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

type Query{
    getVehicles : [vehicle!]!
    getVehicle (id: String!) : vehicle
    getVehiclesByManufacturer(manufacturer: String!) : [vehicle!]!
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