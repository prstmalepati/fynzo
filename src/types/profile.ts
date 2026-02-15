export type MaritalStatus = "single" | "married"

export interface HouseholdProfile {
  maritalStatus: MaritalStatus
  members: number
}
