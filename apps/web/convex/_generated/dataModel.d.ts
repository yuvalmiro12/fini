/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { DataModelFromSchemaDefinition, DocumentByName, TableNamesInDataModel, SystemTableNames } from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>;

/**
 * The type of a document stored in Convex.
 */
export type Doc<TableName extends TableNames> = DocumentByName<DataModel, TableName>;

/**
 * An identifier for a document in Convex.
 *
 * Convex generates `Id`s and guarantees their uniqueness within and across tables.
 * `Id`s are 16 bytes long and stored as a base64 encoded string.
 *
 * To learn more, see [Data Modeling](https://docs.convex.dev/using/data-modeling).
 */
export type Id<TableName extends TableNames | SystemTableNames> =
  GenericId<TableName>;

/**
 * A type describing your Convex data model.
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;

/* prettier-ignore-end */
