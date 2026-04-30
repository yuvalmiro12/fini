/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  actionGeneric,
  httpActionGeneric,
  queryGeneric,
  mutationGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
  componentsGeneric,
} from "convex/server";
import type {
  ActionBuilder,
  HttpActionBuilder,
  QueryBuilder,
  MutationBuilder,
  InternalActionBuilder,
  InternalMutationBuilder,
  InternalQueryBuilder,
  DatabaseReader,
  DatabaseWriter,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

/**
 * Define a query in this Convex app's public API.
 */
export declare const query: QueryBuilder<DataModel, "public">;

/**
 * Define a mutation in this Convex app's public API.
 */
export declare const mutation: MutationBuilder<DataModel, "public">;

/**
 * Define an action in this Convex app's public API.
 */
export declare const action: ActionBuilder<DataModel, "public">;

/**
 * Define a query that is only accessible from other Convex functions (not publicly).
 */
export declare const internalQuery: InternalQueryBuilder<DataModel>;

/**
 * Define a mutation that is only accessible from other Convex functions.
 */
export declare const internalMutation: InternalMutationBuilder<DataModel>;

/**
 * Define an action that is only accessible from other Convex functions.
 */
export declare const internalAction: InternalActionBuilder<DataModel>;

/**
 * Define an HTTP action.
 */
export declare const httpAction: HttpActionBuilder;

export declare const components: {};

/* prettier-ignore-end */
