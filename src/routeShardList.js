import { IncomingMessage, ServerResponse } from "http";
import { ShardRepository } from "./ShardRepository.js";
import { sendResponse } from "./helpers.js";

/**
 * 
 * @param {IncomingMessage} request 
 * @param {ServerResponse} response 
 */
export function routeShardList(request, response) {
    console.log("Request for shardList")

    const shardRepository = new ShardRepository()

    const shards = shardRepository.getShardsForWeb()

    sendResponse(response, 200, shards)


}
