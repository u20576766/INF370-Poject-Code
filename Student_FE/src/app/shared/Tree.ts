import { Department } from "./department";
import { Faculty } from "./faculty";

export interface Tree {
    faculties: Faculty[];
    departments: Department[];
  }