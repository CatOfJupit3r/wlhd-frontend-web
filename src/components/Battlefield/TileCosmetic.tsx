import {tileStyle} from "./styles";
import {INVALID_ASSET_PATH} from "../../config/configs";
import {generateAssetPath, splitDescriptor} from "./utils";

const TileCosmetic = (props: {
    full_descriptor: string,
    onClick?: Function,
    className?: string,
    id: string
}) => {
    const {
        full_descriptor,
        onClick,
        className,
        id} = props;
    const [dlc, descriptor] = splitDescriptor(full_descriptor)

    return <img
        src={generateAssetPath(dlc, descriptor)}
        onClick={onClick ? (event) => onClick(event) : undefined}
        alt={descriptor !== "tile" ? dlc + "::" + descriptor : undefined}
        style={tileStyle}
        onError={(event) => {
            event.currentTarget.src = INVALID_ASSET_PATH
            event.currentTarget.alt = "invalid"
        }
        }
        className={`${className}`}
        id={id}
        key={id}
    />
}

export default TileCosmetic;