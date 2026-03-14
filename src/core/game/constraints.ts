export type MaxInstructionsConstraint = {
  type: "max-instructions";
  count: number;
};

export type AllowedInstructionsConstraint = {
  type: "allowed-instructions";
  allowed: string[];
};

export type MaxInstructionCountConstraint = {
  type: "max-instruction-count";
  instruction: string;
  count: number;
};

export type Constraint =
  | MaxInstructionsConstraint
  | AllowedInstructionsConstraint
  | MaxInstructionCountConstraint;
export type EvaluatedConstraint = Constraint & { met: boolean };
