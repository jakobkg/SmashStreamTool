export type AppSettings = {
  slippiAddress?: string;
  slippiPort?: number;

  obsAddress: string;
  obsPort: number;
  obsPassword?: string;

  tournamentBracketLink?: string;

  obsSources?: {
    slippiSource?: string;

    p1NameSource?: string;
    p1TeamSource?: string;
    p1ScoreSource?: string;
    p1WLSource?: string;

    p2NameSource?: string;
    p2TeamSource?: string;
    p2ScoreSource?: string;
    p2WLSource?: string;

    tournamentNameSource?: string;
    tournamentRoundSource?: string;
    tournamentBracketSource?: string;
  };

  obsScenes?: {
    gameplayScene?: string;
    menuScene?: string;
    bracketScene?: string;
    castersScene?: string;
  };
};
