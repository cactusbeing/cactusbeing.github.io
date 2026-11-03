export type SkillTag = 'listen' | 'respond' | 'empathy' | 'ask_question' | 'share_related' | 'respect_boundary' | 'close_conversation';
export type Difficulty = 1 | 2 | 3;
export type SceneId = 'classroom' | 'hallway' | 'lunch' | 'playground' | 'club' | 'outing';
export type FeedbackLevel = 'effective' | 'acceptable' | 'try_another';
export type Emotion = 'neutral' | 'happy' | 'thoughtful' | 'sad' | 'leaving';
export type Ending = 'extended' | 'brief' | 'respectful_close' | 'repair';
export interface Choice { id: string; text: string; imageCue: SkillTag; feedbackLevel: FeedbackLevel; rationale: string; skillTags: SkillTag[]; scores: Partial<Record<SkillTag, 0 | 1 | 2>>; npcReaction: { text: string; emotion: Emotion }; nextNodeId: string }
export interface DecisionNode { id: string; kind: 'decision'; npcText: string; npcEmotion: Emotion; choices: Choice[] }
export interface EndNode { id: string; kind: 'end'; closingText: string; ending: Ending }
export type DialogueNode = DecisionNode | EndNode;
export interface DialogueGraph { startNodeId: string; nodes: Record<string, DialogueNode> }
export interface Scenario extends DialogueGraph { id: string; title: string; sceneId: SceneId; npcId: string; topic: string; setting: string; skillTags: SkillTag[]; supportedDifficulties: Difficulty[]; contentVersion: number; easy: DialogueGraph }
export interface Settings { difficulty: Difficulty; sceneIds: SceneId[]; skillTags: SkillTag[]; sessionLength: 3 | 5 | 10; readAloud: boolean; showImmediateFeedback: boolean; showHints: boolean; showDemo: boolean; textSize: 18 | 22 | 26; reducedMotion: boolean; shuffleChoices: boolean; }
export interface Answer { nodeId: string; choiceId: string; feedbackLevel: FeedbackLevel; usedHint: boolean; usedDemo: boolean; retried: boolean; attempt: number; scores: Choice['scores']; text: string; reaction: string }
export interface AttemptRecord { scenarioId: string; difficulty: Difficulty; dateISO: string; choices: Answer[]; completed: boolean; ending?: Ending }
export interface Session { id: string; profileId: string; mode: 'free' | 'daily' | 'lesson'; settings: Settings; seed: number; scenarioIds: string[]; index: number; nodeId: string; phase: 'choose' | 'reaction' | 'end'; selectedChoiceId: string | null; usedHint: boolean; usedDemo: boolean; attempt: number; records: AttemptRecord[]; completed: boolean; createdAt: string }
export interface History { recentScenarioIds: string[]; playCount: Record<string, number>; lastPlayed: Record<string, string> }
export interface StoredRecord { session: Session }
export interface LocalData { version: 1; settings: Settings; profileId: string; histories: Record<string, History>; records: StoredRecord[]; achievements: string[]; lessons: number[]; dailySelection: Record<string, { version: number; ids: string[] }>; activeSession: Session | null }
