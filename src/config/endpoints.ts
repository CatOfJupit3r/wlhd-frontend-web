import {REACT_APP_BACKEND_URL} from "./configs";

export const GET_BATTLEFIELD = (game_id: string) => `${REACT_APP_BACKEND_URL}/${game_id}/battlefield`
export const GET_ACTIONS = (game_id: string, entity_id: string) => `${REACT_APP_BACKEND_URL}/${game_id}/action_options/${entity_id}`
export const GET_ALL_MESSAGES = (game_id: string) => `${REACT_APP_BACKEND_URL}/${game_id}/all_messages`
export const GET_THE_MESSAGE = (game_id: string, memory_cell: string) => `${REACT_APP_BACKEND_URL}/${game_id}/message/${memory_cell.toString()}`
export const GET_ENTITY_INFO = (game_id: string, entity_id: string) => `${REACT_APP_BACKEND_URL}/${game_id}/entity/${entity_id}`
export const GET_ALL_ENTITIES_INFO = (game_id: string) => `${REACT_APP_BACKEND_URL}/${game_id}/entities_info`