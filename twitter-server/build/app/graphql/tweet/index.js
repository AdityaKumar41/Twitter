"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
const type_1 = require("./type");
const queries_1 = require("./queries");
const resolvers_1 = require("./resolvers");
const mutation_1 = require("./mutation");
exports.Tweet = {
    type: type_1.type,
    resolvers: resolvers_1.resolvers,
    mutations: mutation_1.mutations,
    queries: queries_1.queries,
};
