import type { Prisma } from '@prisma/client';

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  insuranceApplications?: InsuranceApplication[];
}

export enum Relationship {
  SPOUSE = 'SPOUSE',
  SIBLING = 'SIBLING',
  PARENT = 'PARENT',
  FRIEND = 'FRIEND',
  OTHER = 'OTHER'
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  relationship: Relationship;
  personInsuranceApplications?: PersonInsuranceApplication[];
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  insuranceApplicationId: number | null;
  insuranceApplication?: InsuranceApplication | null;
}

export interface InsuranceApplication {
  resumeUrl: string;
  id?: number;
  dateCreated: Date;
  addressId: number;
  address?: Address | null;
  vehicles?: Prisma.VehicleCreateNestedManyWithoutInsuranceApplicationInput;
  personInsuranceApplications?: Prisma.PersonInsuranceApplicationCreateNestedManyWithoutApplicationInput;
}

export type InsuranceApplicationInclude = {
  address?: boolean | { select?: Address };
  vehicles?: boolean | {
    select?: {
      id?: boolean,
      make?: boolean,
      model?: boolean,
      year?: boolean,
      vehicle?: boolean | {
        include?: VehicleInclude
      }
    }
  };
  people?: boolean | {
    select?: {
        id?: boolean,
        firstName?: boolean,
        lastName?: boolean,
        dateOfBirth?: boolean,
        relationship?: boolean,
        personInsuranceApplications?: boolean | {
          select?: PersonInsuranceApplicationInclude
        }
    }
  }
};


export type VehicleInclude = {
  insuranceApplication?: boolean | InsuranceApplicationInclude;
};

export type PersonInclude = {
  personInsuranceApplications?: boolean | {
    select?: {
      id?: boolean,
      application?: boolean | {
        include?: InsuranceApplicationInclude
      }
    }
  }
}

export interface PersonInsuranceApplication {
  id: number;
  personId: number;
  applicationId: number;
  person?: Person | null;
  application?: InsuranceApplication | null;
}

export type PersonInsuranceApplicationInclude = {
  person?: boolean | { select?: PersonInclude };
  application?: boolean | { select?: InsuranceApplicationInclude };
};

export type PersonInsuranceApplicationCreateInput = {
  personId: number;
  applicationId: number;
};
