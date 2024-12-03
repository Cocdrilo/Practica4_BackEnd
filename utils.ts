import {part, vehicle, vehicleModel,partModel} from "./types.ts";

export const getRandomJoke = async () => {
    const url = "https://official-joke-api.appspot.com/random_joke";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error al obtener la broma: ${response.statusText}`);
        }

        const joke = await response.json();

        const  jokeString: String = joke.setup + ' ' + joke.punchline

        return jokeString
    } catch (error) {
        console.error("Hubo un error al obtener la broma:", error);
        return ""
    }
};

export const fromVehicleModelToVehicle = (vehicleModel : vehicleModel):vehicle =>{
    return{
        id: vehicleModel._id!.toString(),
        manufacturer: vehicleModel.manufacturer,
        year: vehicleModel.year,
        name:vehicleModel.name
    }
}

export const fromModelToPart = (partModel : partModel):part =>{
    return {
        id: partModel._id!.toString(),
        name: partModel.name,
        price: partModel.price,
        vehicleID: partModel.vehicleID.toString()
    }
}
