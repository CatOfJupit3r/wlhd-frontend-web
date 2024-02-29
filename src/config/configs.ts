export const CLEAN_DLC: boolean = true; // Set to true to clean DLC
export const UPDATE_ON_LAUNCH: boolean = true; // Set try to reach to API server for updates to installed DLCs
export const INVALID_ASSET_PATH: string = "assets/local/invalid_asset.png";
export const IMAGE_SIZE: number = 64
export const BATTLEFIELD_DIMENSIONS: [number, number] = [IMAGE_SIZE, IMAGE_SIZE]
export const REACT_APP_BACKEND_URL: string = process.env.REACT_APP_BACKEND_HOST && process.env.REACT_APP_BACKEND_PORT ?
    `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}`
    :
    "http://localhost:4000";
export const GAME_SERVER_URL: string = process.env.GAME_SERVER_HOST && process.env.GAME_SERVER_PORT ?
    `http://${process.env.GAME_SERVER_HOST}:${process.env.GAME_SERVER_PORT}`
    :
    "http://localhost:5000";
console.log(process.env)
console.log(process.env.GAME_SERVER_HOST, process.env.GAME_SERVER_PORT, GAME_SERVER_URL)
export const GAME_API_URL: string = process.env.GAME_API_HOST && process.env.GAME_API_PORT ?
    `http://${process.env.GAME_API_HOST}:${process.env.GAME_API_PORT}`
    :
    "http://localhost:3000";
console.log(process.env.GAME_API_HOST, process.env.GAME_API_PORT, GAME_API_URL)