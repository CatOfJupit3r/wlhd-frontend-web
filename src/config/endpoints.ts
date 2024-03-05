import {REACT_APP_BACKEND_URL} from "./configs";

export const GET_BATTLEFIELD = (game_id: string) => `${REACT_APP_BACKEND_URL}/${game_id}/battlefield`