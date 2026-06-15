export type UserRole = "administrator" | "healthcare_professional";

export type UserDto = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

export type InviteUserInput = {
  name: string;
  email: string;
  roles: UserRole[];
  password: string;
};

export type PatientSex = "m" | "f";

export type PatientDto = {
  id: string;
  name: string;
  sex: PatientSex;
  birthDate: string;
  guardianId: string | null;
  guardian?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
};

export type CreatePatientInput = {
  name: string;
  sex: PatientSex;
  birthDate: string;
  guardian?: {
    name: string;
  };
};

export type SymptomCategory = "behavioral" | "cognitive" | "physical";

export type SymptomDto = {
  id: string;
  symptomName: string;
  category: SymptomCategory | null;
  weight?: number | string;
};

export type ScreeningResult = "suspected" | "low_risk";

export type EvaluationDto = {
  id: string;
  userId: string;
  patientId: string;
  score: number;
  screeningResult: ScreeningResult;
  assessmentDate: string;
  appliedThreshold: number;
};

export type CreateEvaluationInput = {
  patientId: string;
  sintomas: {
    id: string;
    presente: boolean;
  }[];
};
