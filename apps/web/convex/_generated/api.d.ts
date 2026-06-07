/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bank from "../bank.js";
import type * as bankConnections from "../bankConnections.js";
import type * as categorize from "../categorize.js";
import type * as chat from "../chat.js";
import type * as crypto from "../crypto.js";
import type * as http from "../http.js";
import type * as import_ from "../import.js";
import type * as sources from "../sources.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  bank: typeof bank;
  bankConnections: typeof bankConnections;
  categorize: typeof categorize;
  chat: typeof chat;
  crypto: typeof crypto;
  http: typeof http;
  import: typeof import_;
  sources: typeof sources;
  transactions: typeof transactions;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
