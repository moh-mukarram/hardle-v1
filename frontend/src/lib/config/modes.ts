export type GameMode = {
    id: string;
    title: string;
    tag: string;
    desc: string;
    fire: string;
    color: string;
    bg: string;
    tagColor: string;
    footer?: string;
};

export const MODES: GameMode[] = [
    {
        id: "extreme",
        title: "HAAAAAAAAARDLE",
        tag: "EXTREME",
        desc: "No color hints. Pure deduction.",
        fire: "🔥🔥🔥🔥🔥",
        color: "text-red-600",
        bg: "bg-red-500/10 border-red-500/20 hover:border-red-500/50",
        tagColor: "bg-red-500 text-white",
    },
    {
        id: "very_hard",
        title: "HAAAAARDLE",
        tag: "VERY HARD",
        desc: "Minimal hints. Brutal logic.",
        fire: "🔥🔥🔥🔥",
        color: "text-orange-500",
        bg: "bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50",
        tagColor: "bg-orange-500 text-white",
    },
    {
        id: "hard",
        title: "HARDLE",
        tag: "HARD",
        desc: "Easier Hardle.",
        fire: "🔥🔥🔥",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/50",
        tagColor: "bg-yellow-500 text-black",
    },
    {
        id: "daily",
        title: "DAILY HARDLE",
        tag: "DAILY",
        desc: "One puzzle per day. Compete globally.",
        fire: "🔥🔥🔥",
        color: "text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50",
        tagColor: "bg-blue-500 text-white",
        footer: "Resets in 23h",
    },
];
