export const MaritalStatusMap: Record<string, number> = {
    Single: 1,
    Married: 2,
    Divorced: 3,
    Widower: 4
  };
  
  export const ReverseMaritalStatusMap: Record<number, string> = {
    1: 'Single',
    2: 'Married',
    3: 'Divorced',
    4: 'Widower'
  };
  
  export function toMaritalStatusValue(status: string): number | null {
    return MaritalStatusMap[status] ?? null;
  }
  
  export function toMaritalStatusString(value: number): string | null {
    return ReverseMaritalStatusMap[value] ?? null;
  }
  