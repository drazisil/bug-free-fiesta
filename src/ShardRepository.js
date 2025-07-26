import { ShardInstance } from "./ShardInstance.js";

/**
 * @type {Map<number, ShardInstance>}
 */
const registeredShards = new Map()

export class ShardRepository {

    constructor() {
        registeredShards.set(42, new ShardInstance(42, "Demo", "Demo Shard", "rusty-motors.com"))
    }

    /**
     * @returns {ShardInstance[]}
     */
    getShards() {
        return registeredShards.values().toArray()
    }

    /**
     * @returns {string}
     */
    getShardsForWeb() {

        const shards = this.getShards()

        let shardResponse = []

        for (const shard of shards) {
            const shardString = `[${shard.name}]
      Description=${shard.description}
      ShardId=${shard.id}
      LoginServerIP=${shard.host}
      LoginServerPort=${shard.loginPort}
      LobbyServerIP=${shard.host}
      LobbyServerPort=${shard.lobbyPort}
      MCOTSServerIP=${shard.host}
      StatusId=${shard.statusId}
      Status_Reason=${shard.statusReason}
      ServerGroup_Name=${shard.serverGroup}
      Population=${shard.population}
      MaxPersonasPerUser=${shard.maxPersonasAllowedPerUser}}
      DiagnosticServerHost=${shard.host}
      DiagnosticServerPort=80`;
            shardResponse.push(shardString)
        }
        return shardResponse.join("\n")
    }




}
