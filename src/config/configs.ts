export const INVALID_ASSET_PATH: string = "assets/local/invalid_asset.png";
export const REACT_APP_BACKEND_URL: string = process.env.REACT_APP_BACKEND_HOST && process.env.REACT_APP_BACKEND_PORT ?
    `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}`
    :
    "http://localhost:4000";
export const BATTLEFIELD_BLUR_HASH: string = "{7H2i;WB00j[9Ft7M{ofofazoLayoLayfQay00WB-;j[%gt7xuofoffQWBj[WBj[WBj[00WB~qfQ?cof%MfQt7j[ayj[ayfQayj[MxayofayoffQofayayj[t7ayt7WBofWBWBay%MfQxuj[t7j["