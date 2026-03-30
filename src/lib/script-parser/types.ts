export type BeatId =
  | "opening_image"
  | "theme_stated"
  | "setup"
  | "catalyst"
  | "debate"
  | "break_into_two"
  | "b_story"
  | "fun_and_games"
  | "midpoint"
  | "bad_guys_close_in"
  | "all_is_lost"
  | "dark_night_of_the_soul"
  | "break_into_three"
  | "finale"
  | "final_image";

export type MetadataEntry = {
  key: string;
  value: string;
  lineNumber: number;
};

export type GlobalMetadata = {
  project: {
    title?: string;
    format?: "feature" | "pilot" | "short" | "play";
    targetPages?: number;
    genre?: string;
  };
  theme: {
    core?: string;
    lie?: string;
    truth?: string;
    moralArgument?: string;
  };
};

export type CharacterMaster = {
  id: string;
  name?: string;
  role?: string;
  want?: string;
  lie?: string;
  truth?: string;
  voice?: string;
  mask?: string;
};

export type CharacterSceneData = {
  sceneObjective?: string;
  emotionStart?: string;
  emotionEnd?: string;
  hiddenAgenda?: string;
  arcMove?: string;
};

export type SceneDialogueData = {
  subtext?: string;
  conflict?: string;
  turn?: string;
  expositionRisk?: "low" | "medium" | "high";
  onTheNoseRisk?: "low" | "medium" | "high";
  coverage?: "weak" | "partial" | "strong";
  silence?: string;
  voiceNote?: string;
  objectives: Record<string, string>;
  verbalActions: Record<string, string>;
};

export type ParsedScene = {
  id?: string;
  title?: string;
  actId?: "act_1" | "act_2a" | "act_2b" | "act_3";
  beatId?: BeatId;
  threadId?: "a_story" | "b_story" | "c_story" | "subplot";

  status?: "not_started" | "in_progress" | "drafted" | "needs_revision" | "complete";
  complete?: boolean;

  function?: "setup" | "escalation" | "payoff" | "transition" | "reversal" | "resolution";

  goal?: string;
  obstacle?: string;
  turn?: string;
  outcome?: string;

  summary?: string;
  theme?: string;
  pov?: string;
  priority?: "low" | "medium" | "high" | "critical";
  notes?: string;

  characters: string[];
  characterSceneData: Record<string, CharacterSceneData>;
  dialogue: SceneDialogueData;

  beatStatus?: "not_started" | "in_progress" | "drafted" | "needs_revision" | "complete";
  beatComplete?: boolean;
  promiseOfPremise?: boolean;
  valueShift?: string;
  emotionalTurn?: string;

  revisionPriority?: "low" | "medium" | "high" | "critical";
  revisionReason?: string;
  pacingFlag?: "short_scene" | "long_scene" | "late_beat" | "early_beat" | "slow_middle" | "rushed_payoff";
  pacingNote?: string;

  slugline: string;
  contentStartLine: number;
  contentEndLine: number;
  metadataStartLine: number;
  metadataEndLine: number;

  lineCount: number;
  estimatedPageStart: number;
  estimatedPageEnd: number;
  estimatedPageLength: number;

  characterCues: string[];
  rawMetadata: MetadataEntry[];
  rawText: string;
};

export type SceneCoverage = {
  hasGoal: boolean;
  hasObstacle: boolean;
  hasTurn: boolean;
  hasOutcome: boolean;
  structurallyComplete: boolean;
  hasCharacters: boolean;
  hasDialogueSubtext: boolean;
  hasDialogueConflict: boolean;
  hasDialogueTurn: boolean;
  dialogueCoverageLevel: "weak" | "partial" | "strong";
};

export type BeatState = {
  id: BeatId;
  label: string;
  targetPageRange?: [number, number];
  sceneIds: string[];
  status: "not_started" | "in_progress" | "drafted" | "needs_revision" | "complete";
  complete: boolean;
  actualPage?: number;
};

export type ScriptSummary = {
  totalScenes: number;
  completedScenes: number;
  draftedScenes: number;
  inProgressScenes: number;
  revisionScenes: number;
  totalEstimatedPages: number;
  beatCounts: {
    complete: number;
    drafted: number;
    inProgress: number;
    notStarted: number;
    needsRevision: number;
  };
  dialogueCoverage: {
    strongScenes: number;
    partialScenes: number;
    weakScenes: number;
  };
  structuralCoverage: {
    completeScenes: number;
    incompleteScenes: number;
  };
};

export type ValidationIssue = {
  severity: "warning" | "error";
  lineNumber?: number;
  key?: string;
  message: string;
  sceneId?: string;
};

export type ParsedScript = {
  lines: string[];
  rawText: string;
  global: GlobalMetadata;
  characters: CharacterMaster[];
  scenes: ParsedScene[];
  beats: BeatState[];
  summary: ScriptSummary;
  coverageBySceneId: Record<string, SceneCoverage>;
  validationIssues: ValidationIssue[];
};

export type CurrentContext = {
  currentSceneId?: string;
  currentActId?: string;
  currentBeatId?: BeatId;
  currentThreadId?: string;
  currentSceneTitle?: string;
  currentEstimatedPage?: number;
};

export type LeftSidebarModel = {
  projectTitle?: string;
  format?: string;
  targetPages?: number;
  theme?: {
    core?: string;
    lie?: string;
    truth?: string;
    moralArgument?: string;
  };
  acts: { id: string; active: boolean }[];
  beats: {
    id: BeatId;
    label: string;
    active: boolean;
    targetPageRange?: [number, number];
  }[];
  currentScene?: {
    id?: string;
    title?: string;
    estimatedPage?: number;
  };
};

export type RightSidebarModel = {
  summary: ScriptSummary;
  beatProgress: BeatState[];
  sceneCoverage: {
    sceneId?: string;
    sceneTitle?: string;
    structurallyComplete: boolean;
    dialogueCoverage: "weak" | "partial" | "strong";
    missingFields: string[];
  }[];
  characterProgress: {
    characterId: string;
    name?: string;
    scenesPresent: number;
  }[];
  validationIssues: ValidationIssue[];
};

export type ParseScriptResult = {
  parsedScript: ParsedScript;
  leftSidebar: LeftSidebarModel;
  rightSidebar: RightSidebarModel;
  currentContext?: CurrentContext;
};
