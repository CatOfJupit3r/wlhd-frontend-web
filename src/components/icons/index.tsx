import createIconComponent, { IconComponentType } from '@components/icons/icon_factory';
import { FaBoxes } from 'react-icons/fa';
import { FaHourglassHalf } from 'react-icons/fa6';
import { GiKnapsack, GiSkills, GiSpellBook, GiSwordsEmblem } from 'react-icons/gi';
import { IoHeart, IoLayersSharp, IoShieldSharp } from 'react-icons/io5';
import { LuTally5, LuTriangle } from 'react-icons/lu';
import { MdOutlineAutoAwesomeMosaic } from 'react-icons/md';
import { PiClockCountdownBold, PiPlaceholderFill, PiSneakerMoveFill } from 'react-icons/pi';
import { TbChartAreaLineFilled } from 'react-icons/tb';

const Icons = [
    {
        src: '/assets/local/location.svg',
        alt: 'Location',
        displayName: 'LocationIcon',
    },
];

const iconExports = Icons.reduce(
    (acc, { src, alt, displayName }) => {
        acc[displayName] = createIconComponent(src, alt, displayName);
        return acc;
    },
    {} as { [key: string]: IconComponentType },
);

export const { LocationIcon } = iconExports;

export {
    GiSkills as AttributesIcon,
    MdOutlineAutoAwesomeMosaic as MiscIcon,
    GiSpellBook as SpellBookIcon,
    GiKnapsack as InventoryIcon,
    GiSwordsEmblem as WeaponryIcon,
    IoLayersSharp as StatusEffectsIcon,
    PiClockCountdownBold as CooldownIcon,
    FaHourglassHalf as DurationIcon,
    PiSneakerMoveFill as ActionPointsIcon,
    LuTally5 as UsesIcon,
    FaBoxes as QuantityIcon,
    LuTriangle as ActivenessIcon,
    IoShieldSharp as ArmorIcon,
    IoHeart as HealthIcon,
    PiPlaceholderFill as PlaceholderIcon,
    TbChartAreaLineFilled as AOEIcon,
};
