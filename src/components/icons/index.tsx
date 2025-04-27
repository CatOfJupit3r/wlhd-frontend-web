import { FaBoxes } from 'react-icons/fa';
import { FaHourglassHalf } from 'react-icons/fa6';
import { GiKnapsack, GiSkills, GiSpellBook, GiSwordsEmblem } from 'react-icons/gi';
import { IoHeart, IoLayersSharp, IoShieldSharp } from 'react-icons/io5';
import { LuTally5, LuTriangle } from 'react-icons/lu';
import { MdOutlineAutoAwesomeMosaic } from 'react-icons/md';
import { PiClockCountdownBold, PiPlaceholderFill, PiSneakerMoveFill } from 'react-icons/pi';
import { TbChartAreaLineFilled } from 'react-icons/tb';

import createIconComponent, { IconComponentType } from '@components/icons/icon_factory';

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
    PiSneakerMoveFill as ActionPointsIcon,
    LuTriangle as ActivenessIcon,
    TbChartAreaLineFilled as AOEIcon,
    IoShieldSharp as ArmorIcon,
    GiSkills as AttributesIcon,
    PiClockCountdownBold as CooldownIcon,
    FaHourglassHalf as DurationIcon,
    IoHeart as HealthIcon,
    GiKnapsack as InventoryIcon,
    MdOutlineAutoAwesomeMosaic as MiscIcon,
    PiPlaceholderFill as PlaceholderIcon,
    FaBoxes as QuantityIcon,
    GiSpellBook as SpellBookIcon,
    IoLayersSharp as StatusEffectsIcon,
    LuTally5 as UsesIcon,
    GiSwordsEmblem as WeaponryIcon,
};
