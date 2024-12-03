export const getRandomJoke = async () => {
    const url = "https://official-joke-api.appspot.com/random_joke";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error al obtener la broma: ${response.statusText}`);
        }

        const joke = await response.json();

        // Mostrar la broma en consola
        console.log(`Broma: ${joke.setup}`);
        console.log(`Respuesta: ${joke.punchline}`);
    } catch (error) {
        console.error("Hubo un error al obtener la broma:", error);
    }
};


//getRandomJoke(); //Función que te da la broma aleatoria