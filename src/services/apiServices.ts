import {REACT_APP_BACKEND_URL} from "../config/configs";


/*

These services are used to make API calls to the server and receive responses.

In plans:
- Make GET requests.
- Make POST requests to the server.

- GET requests:
    - Create game using provided game_id.
    - Add entity to the game by descriptor.
    - Get possible actions for the active player.
    - Get game state.
- POST requests:
    - Send action to the server.

*/


export const getTranslations = async (language: string, dlc: string): Promise<{ [key: string]: string }> => {
    try{
        const response = await fetch(`${REACT_APP_BACKEND_URL}/translation?dlc=${dlc}&language=${language}`);
        return await response.json()

    } catch (e) {
        console.error(e)
        return {}
    }
}
